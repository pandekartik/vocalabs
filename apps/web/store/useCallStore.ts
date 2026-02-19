
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
    isOnHold: boolean;
    isRecordingPaused: boolean;
    duration: number;
    transcript: TranscriptMessage[];
    phoneNumber: string;
    errorMessage: string | null;
    incomingCall: Call | null;
    streamSid: string | null;

    showPostCallDrawer: boolean;
    setShowPostCallDrawer: (show: boolean) => void;

    // Actions
    initializeDevice: () => Promise<void>;
    setPhoneNumber: (number: string) => void;
    initiateCall: () => Promise<void>;
    endCall: () => void;
    acceptIncomingCall: () => void;
    rejectIncomingCall: () => void;
    toggleMute: () => void;
    toggleHold: () => void;
    toggleRecording: () => void;
    addTranscriptMessage: (message: TranscriptMessage) => void;
    resetState: () => void;
    setMockState: (state: Partial<CallState>) => void;
}

export const useCallStore = create<CallState>((set, get) => ({
    device: null,
    connection: null,
    incomingCall: null,
    callStatus: 'idle',
    isMuted: false,
    isOnHold: false,
    isRecordingPaused: false,
    duration: 0,
    transcript: [],
    phoneNumber: '',
    errorMessage: null,
    streamSid: null,
    showPostCallDrawer: false,

    initializeDevice: async () => {
        try {
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
                console.log("Incoming call", call);
                set({ incomingCall: call });
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
                supervisor_name: "Test User",
                customer_id: userDetails?.customer_id,
                organisation_id: userDetails?.organisation_id,
                domain: userDetails?.domain_id,
                processes: userDetails?.processes,
            };

            const response = await APIUSERDIAL.post("/call", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { frontend_url } = response.data;
            if (!frontend_url) throw new Error("No WebSocket URL received");

            const streamSid = frontend_url.split("/").pop();
            set({ streamSid });

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

            const connection = await device.connect({ params: payload });
            set({ connection });

            connection.on("accept", () => {
                set({ callStatus: 'in-progress' });
                const timer = setInterval(() => {
                    set((state) => ({ duration: state.duration + 1 }));
                }, 1000);
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

    acceptIncomingCall: () => {
        const { incomingCall } = get();
        if (incomingCall) {
            incomingCall.accept();
            set({ connection: incomingCall, incomingCall: null, callStatus: 'in-progress' });
            // Setup listeners or status for the accepted call if needed
            const timer = setInterval(() => {
                set((state) => ({ duration: state.duration + 1 }));
            }, 1000);
            (incomingCall as any)._timer = timer;
            incomingCall.on("disconnect", () => {
                get().endCall();
            });
        }
    },

    rejectIncomingCall: () => {
        const { incomingCall } = get();
        if (incomingCall) {
            incomingCall.reject();
            set({ incomingCall: null });
        }
    },

    endCall: () => {
        const { connection } = get();
        if (connection) {
            if ((connection as any)._timer) clearInterval((connection as any)._timer);
            connection.disconnect();
        }

        set({
            connection: null,
            incomingCall: null,
            callStatus: 'idle',
            isMuted: false,
            isOnHold: false,
            isRecordingPaused: false,
            showPostCallDrawer: true // Trigger post-call drawer
        });
    },

    toggleMute: () => {
        const { connection, isMuted } = get();
        if (connection) {
            connection.mute(!isMuted);
        }
        set({ isMuted: !isMuted });
    },

    toggleHold: () => {
        set((state) => ({ isOnHold: !state.isOnHold }));
    },

    toggleRecording: () => {
        set((state) => ({ isRecordingPaused: !state.isRecordingPaused }));
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
            errorMessage: null,
            incomingCall: null,
            showPostCallDrawer: false
        });
    },

    setShowPostCallDrawer: (show) => set({ showPostCallDrawer: show }),

    setMockState: (state: Partial<CallState>) => set((prev) => ({ ...prev, ...state }))
}));
