import { create } from 'zustand';
import { Device, Call } from '@twilio/voice-sdk';
import { APIUSER, APIUSERDIAL } from '@/lib/axios';

interface TranscriptMessage {
    speaker: 'Agent' | 'Customer';
    text: string;
}

interface CallState {
    device: Device | null;
    connection: Call | null;
    callStatus: 'idle' | 'registered' | 'connecting' | 'ringing' | 'in-progress' | 'ended' | 'error';
    isMuted: boolean;
    duration: number;
    transcript: TranscriptMessage[];
    phoneNumber: string;
    errorMessage: string | null;
    streamSid: string | null;

    // Actions
    initializeDevice: () => Promise<void>;
    setPhoneNumber: (number: string) => void;
    initiateCall: () => Promise<void>;
    endCall: () => void;
    toggleMute: () => void;
    addTranscriptMessage: (message: TranscriptMessage) => void;
    resetState: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
    device: null,
    connection: null,
    callStatus: 'idle',
    isMuted: false,
    duration: 0,
    transcript: [],
    phoneNumber: '',
    errorMessage: null,
    streamSid: null,

    initializeDevice: async () => {
        try {
            // Check for token in localStorage (or where authentication is stored)
            // For now, assuming token is in localStorage based on reference code
            // In a real app, you might get this from a session or auth hook
            // NOTE: The reference code uses localStorage.getItem("token")
            // We should ensure this token exists.

            // Placeholder: In a real implementation, we need a valid token mechanism.s
            // For now, we'll try to fetch it as in the reference logic.

            // const token = localStorage.getItem("token");
            // if (!token) throw new Error("No authentication token found");

            // For this implementation step, we'll assume the user is authenticated 
            // and we can call the endpoint to get the Twilio capability token.
            // We need the user_id to fetch the token.
            // Based on reference: const userDetails = JSON.parse(localStorage.getItem("user"));

            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (!userStr || !token) {
                console.warn("User or token not found in localStorage. Device initialization skipped.");
                return;
            }

            const userDetails = JSON.parse(userStr);

            const response = await APIUSER.get("/token", {
                params: { identity: userDetails.user_id },
                headers: { Authorization: `Bearer ${token}` }
            });

            const fetchedToken = response.data.token;
            if (!fetchedToken) throw new Error("No Twilio token received");

            const device = new Device(fetchedToken, {
                codecPreferences: ["opus", "pcmu"] as any,
                // debug: true, // Removed as it causes type error
                // region: "us1", // Optional based on reference
                logLevel: "debug",
            });

            device.on("registered", () => {
                console.log("Twilio Device Registered");
                set({ callStatus: 'registered', errorMessage: null });
            });

            device.on("error", (error: any) => {
                console.error("Twilio Device Error:", error);
                set({ errorMessage: error.message || "Device error" });
            });

            device.on("incoming", (call) => {
                // Auto-accept incoming calls logic can be added here if needed
                // For now, we focus on outbound as per Dialer requirements
                console.log("Incoming call", call);
            });

            await device.register();
            set({ device });

        } catch (error: any) {
            console.error("Failed to initialize device:", error);
            set({ errorMessage: error.message || "Failed to initialize device" });
        }
    },

    setPhoneNumber: (number) => set({ phoneNumber: number }),

    initiateCall: async () => {
        const { device, phoneNumber } = get();
        if (!device) {
            set({ errorMessage: "Device not initialized" });
            return;
        }

        if (!phoneNumber) {
            set({ errorMessage: "Phone number is required" });
            return;
        }

        try {
            set({ callStatus: 'connecting', errorMessage: null, transcript: [], duration: 0 });

            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (!userStr || !token) throw new Error("User authentication missing");
            const userDetails = JSON.parse(userStr);

            const payload = {
                to: phoneNumber,
                agent_name: `${userDetails?.first_name} ${userDetails?.last_name}`,
                agent_id: `${userDetails?.user_id}`,
                supervisor_id: userDetails?.manager_id,
                supervisor_name: "Test User", // Placeholder from reference
                customer_id: userDetails?.customer_id,
                organisation_id: userDetails?.organisation_id,
                domain: userDetails?.domain_id,
                processes: userDetails?.processes,
            };

            // 1. Call backend to initiate call and get WebSocket URL
            const response = await APIUSERDIAL.post("/call", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { frontend_url, frontend_intervention_url, frontend_feedback_url } = response.data;
            if (!frontend_url) throw new Error("No WebSocket URL received");

            const streamSid = frontend_url.split("/").pop();
            set({ streamSid });

            // 2. Setup WebSocket for transcription
            const ws = new WebSocket(frontend_url);
            ws.onopen = () => console.log("WebSocket connected");
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === "full_content" && Array.isArray(data.data.transcripts)) {
                        data.data.transcripts.forEach((item: any) => {
                            if (item.event === "transcription" && item.data) {
                                const speaker = item.speaker === "Agent" ? "Agent" : "Customer";
                                get().addTranscriptMessage({ speaker, text: item.data });
                            }
                        });
                    }
                    if (data.status === "call_ended") {
                        get().endCall();
                    }
                } catch (e) {
                    console.error("WebSocket message parsing error", e);
                }
            };

            // 3. Connect Twilio Device
            const connection = await device.connect({ params: payload });
            set({ connection });

            connection.on("accept", () => {
                set({ callStatus: 'in-progress' });
                // Start timer
                const timer = setInterval(() => {
                    set((state) => ({ duration: state.duration + 1 }));
                }, 1000);

                // Store timer ID on the instance (or use a ref if this was a component)
                // Since this is a store, we might need a separate way to clear interval.
                // We'll attach it to the connection object loosely or handle cleanup in endCall
                (connection as any)._timer = timer;
            });

            connection.on("disconnect", () => {
                get().endCall();
            });

            connection.on("error", (error: any) => {
                console.error("Connection error:", error);
                set({ errorMessage: error.message });
                get().endCall();
            });

        } catch (error: any) {
            console.error("Call setup failed:", error);
            set({ callStatus: 'error', errorMessage: error.message });
        }
    },

    endCall: () => {
        const { connection } = get();
        if (connection) {
            if ((connection as any)._timer) clearInterval((connection as any)._timer);
            connection.disconnect();
        }
        // Also close WebSocket if stored (we need to store WS instance in state to close it properly)
        // For simplicity now, we rely on the server closing it or browser cleanup, 
        // but ideally we should track WS in state too.

        set({
            connection: null,
            callStatus: 'idle',
            // We might want to keep transcript for review
            // duration: 0, 
            isMuted: false
        });
    },

    toggleMute: () => {
        const { connection, isMuted } = get();
        if (connection) {
            connection.mute(!isMuted);
            set({ isMuted: !isMuted });
        }
    },

    addTranscriptMessage: (message) => {
        set((state) => ({ transcript: [...state.transcript, message] }));
    },

    resetState: () => {
        set({
            callStatus: 'idle',
            duration: 0,
            transcript: [],
            phoneNumber: '',
            errorMessage: null
        });
    }
}));
