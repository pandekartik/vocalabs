
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
    callSid: string | null;
    callId: string | null;
    isDeviceRegistered: boolean;
    isInitializing: boolean;
    pendingOutbound: boolean;

    showPostCallDrawer: boolean;
    setShowPostCallDrawer: (show: boolean) => void;
    showVoicemailToast: boolean;
    setShowVoicemailToast: (show: boolean) => void;

    // Actions
    initializeDevice: () => Promise<void>;
    destroyDevice: () => void;
    refreshToken: () => Promise<void>;
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
    callSid: null,
    callId: null,
    showPostCallDrawer: false,
    showVoicemailToast: false,
    isDeviceRegistered: false,
    isInitializing: false,
    pendingOutbound: false,

    initializeDevice: async () => {
        // Prevent double-initialization
        const { device: existingDevice, isInitializing } = get();
        if (isInitializing) {
            console.log("Device initialization already in progress, skipping.");
            return;
        }
        if (existingDevice && existingDevice.state !== 'destroyed') {
            console.log("Device already exists and is not destroyed, skipping init.");
            // If device exists but not registered, try registering
            if (existingDevice.state !== 'registered') {
                try {
                    await existingDevice.register();
                } catch (e) {
                    console.error("Failed to re-register existing device:", e);
                }
            }
            return;
        }

        set({ isInitializing: true, errorMessage: null });

        try {
            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (!userStr || !token) {
                console.warn("User or token not found in localStorage. Device initialization skipped.");
                set({ isInitializing: false });
                return;
            }

            const userDetails = JSON.parse(userStr);
            const identity = userDetails.user_id;

            if (!identity) {
                console.warn("User ID not found. Device initialization skipped.");
                set({ isInitializing: false });
                return;
            }

            // Request microphone permission before initializing device
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log("Microphone permission granted");
            } catch (micError) {
                console.error("Microphone access denied:", micError);
                set({
                    errorMessage: "Microphone access denied. Please allow microphone access to use the dialer.",
                    isInitializing: false,
                });
                return;
            }

            // Fetch Twilio access token from backend
            console.log("Fetching Twilio token for identity:", identity);
            const response = await APIUSER.get("/token", {
                params: { identity },
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedToken = response.data.token;
            if (!fetchedToken) {
                throw new Error("No Twilio token received from server");
            }
            console.log("Twilio token received successfully");

            // Create the Twilio Device with recommended settings
            const newDevice = new Device(fetchedToken, {
                codecPreferences: ["opus", "pcmu"] as any,
                logLevel: "warn",
                closeProtection: "A call is currently in progress. Leaving this page will end the call.",
                edge: "roaming",
            });

            // ─── Event: registered ────────────────────────────────────────
            newDevice.on("registered", () => {
                console.log("✅ Twilio Device registered — ready for calls");
                set({
                    callStatus: 'registered',
                    isDeviceRegistered: true,
                    errorMessage: null,
                });
            });

            // ─── Event: registering ───────────────────────────────────────
            newDevice.on("registering", () => {
                console.log("⏳ Twilio Device registering...");
            });

            // ─── Event: unregistered ──────────────────────────────────────
            newDevice.on("unregistered", () => {
                console.log("⚠️ Twilio Device unregistered");
                set({ isDeviceRegistered: false });
            });

            // ─── Event: error ─────────────────────────────────────────────
            newDevice.on("error", (twilioError: any) => {
                console.error("❌ Twilio Device Error:", twilioError);
                set({
                    errorMessage: twilioError?.message || "Twilio Device error",
                });
            });

            // ─── Event: incoming ──────────────────────────────────────────
            newDevice.on("incoming", (call: Call) => {
                console.log("📞 Incoming call from:", call.parameters?.From);

                const { pendingOutbound } = get();

                if (pendingOutbound) {
                    // This is our outbound call bridge — auto-accept
                    console.log("✅ Auto-accepting outbound call bridge...");
                    call.accept();
                    set({
                        connection: call,
                        incomingCall: null,
                        pendingOutbound: false,
                        callStatus: 'in-progress',
                    });

                    const timer = setInterval(() => {
                        set((state) => ({ duration: state.duration + 1 }));
                    }, 1000);
                    (call as any)._timer = timer;

                    call.on("disconnect", () => {
                        console.log("� Call disconnected");
                        get().endCall();
                    });

                    call.on("error", (error: any) => {
                        console.error("❌ Call error:", error);
                        set({ errorMessage: error?.message || "Call error" });
                        get().endCall();
                    });
                } else {
                    // Genuine inbound call — show popup
                    set({ incomingCall: call });

                    call.on("cancel", () => {
                        console.log("Incoming call cancelled by caller");
                        set({ incomingCall: null });
                    });

                    call.on("disconnect", () => {
                        console.log("Incoming call disconnected");
                        set({ incomingCall: null });
                    });
                }
            });

            // ─── Event: tokenWillExpire (auto-refresh) ────────────────────
            newDevice.on("tokenWillExpire", async () => {
                console.log("🔄 Twilio token expiring soon, refreshing...");
                try {
                    const currentToken = localStorage.getItem("token");
                    const currentUserStr = localStorage.getItem("user");
                    if (!currentToken || !currentUserStr) return;

                    const currentUser = JSON.parse(currentUserStr);
                    const refreshResponse = await APIUSER.get("/token", {
                        params: { identity: currentUser.user_id },
                        headers: { Authorization: `Bearer ${currentToken}` },
                    });

                    const newToken = refreshResponse.data.token;
                    if (newToken) {
                        newDevice.updateToken(newToken);
                        console.log("✅ Twilio token refreshed successfully");
                    }
                } catch (err) {
                    console.error("Failed to refresh Twilio token:", err);
                }
            });

            // ─── Event: destroyed ─────────────────────────────────────────
            newDevice.on("destroyed", () => {
                console.log("🔴 Twilio Device destroyed");
                set({
                    device: null,
                    isDeviceRegistered: false,
                    callStatus: 'idle',
                });
            });

            // Register the device to receive incoming calls
            console.log("Registering Twilio Device...");
            await newDevice.register();

            set({
                device: newDevice,
                isInitializing: false,
            });

            console.log("✅ Twilio Device initialization complete");

        } catch (error: any) {
            console.error("❌ Failed to initialize Twilio Device:", error);
            set({
                errorMessage: error?.response?.data?.detail || error?.message || "Failed to initialize device",
                isInitializing: false,
            });
        }
    },

    destroyDevice: () => {
        const { device, connection } = get();

        // Disconnect any active call
        if (connection) {
            try {
                connection.disconnect();
            } catch (e) {
                console.warn("Error disconnecting call during device destroy:", e);
            }
        }

        // Destroy the device
        if (device) {
            try {
                device.destroy();
                console.log("Twilio Device destroyed on logout");
            } catch (e) {
                console.warn("Error destroying Twilio Device:", e);
            }
        }

        set({
            device: null,
            connection: null,
            incomingCall: null,
            callStatus: 'idle',
            isDeviceRegistered: false,
            isMuted: false,
            isOnHold: false,
            isRecordingPaused: false,
            duration: 0,
            transcript: [],
            phoneNumber: '',
            errorMessage: null,
            streamSid: null,
            callSid: null,
            showPostCallDrawer: false,
            showVoicemailToast: false,
        });
    },

    refreshToken: async () => {
        const { device } = get();
        if (!device || device.state === 'destroyed') return;

        try {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            if (!token || !userStr) return;

            const userDetails = JSON.parse(userStr);
            const response = await APIUSER.get("/token", {
                params: { identity: userDetails.user_id },
                headers: { Authorization: `Bearer ${token}` },
            });

            const newToken = response.data.token;
            if (newToken) {
                device.updateToken(newToken);
                console.log("Twilio token refreshed via manual trigger");
            }
        } catch (err) {
            console.error("Failed to refresh Twilio token:", err);
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

            // 1. Call backend to create DB record & get WebSocket URLs
            const payload = {
                to_number: phoneNumber,
                customer_id: userDetails?.customer_id || null,
                domain: userDetails?.domain_id || null,
                processes: userDetails?.processes || null,
            };

            console.log("Initiating outbound call to:", phoneNumber);
            const response = await APIUSERDIAL.post("/outbound", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { frontend_url, stream_sid, call_sid, call_id } = response.data;
            if (!frontend_url) throw new Error("No WebSocket URL received from backend");

            set({ streamSid: stream_sid, callSid: call_sid, callId: call_id });

            // 2. Connect WebSocket for live transcription and events
            const ws = new WebSocket(frontend_url);
            ws.onopen = () => console.log("WebSocket connected for call events");
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === "full_content" && Array.isArray(data.data?.transcripts)) {
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
            ws.onerror = (error) => console.error("WebSocket error:", error);
            ws.onclose = () => console.log("WebSocket closed");

            // 3. Backend has already called twilio.calls.create(to=destination)
            //    When destination answers, TwiML bridges to our Device.
            //    Mark as pendingOutbound so incoming handler auto-accepts.
            set({ pendingOutbound: true, callStatus: 'connecting' });
            console.log("⏳ Backend calling destination, waiting for bridge to agent Device...");

            // Timeout: destination needs to answer before Twilio bridges
            setTimeout(() => {
                const { pendingOutbound: stillPending } = get();
                if (stillPending) {
                    console.error("Timeout: destination didn't answer or bridge failed");
                    set({
                        pendingOutbound: false,
                        callStatus: 'error',
                        errorMessage: "Call failed: destination didn't answer.",
                    });
                }
            }, 60000);

        } catch (error: any) {
            console.error("❌ Call setup failed:", error);
            const detail = error?.response?.data?.detail;
            set({
                callStatus: 'error',
                errorMessage: detail || error.message || "Call setup failed",
            });
        }
    },

    acceptIncomingCall: () => {
        const { incomingCall } = get();
        if (incomingCall) {
            incomingCall.accept();
            set({ connection: incomingCall, incomingCall: null, callStatus: 'in-progress' });

            const timer = setInterval(() => {
                set((state) => ({ duration: state.duration + 1 }));
            }, 1000);
            (incomingCall as any)._timer = timer;

            incomingCall.on("disconnect", () => {
                get().endCall();
            });

            incomingCall.on("error", (error: any) => {
                console.error("Incoming call error:", error);
                set({ errorMessage: error?.message });
                get().endCall();
            });
        }
    },

    rejectIncomingCall: () => {
        const { incomingCall } = get();
        if (incomingCall) {
            incomingCall.reject();
            set({ incomingCall: null, showVoicemailToast: true });
        }
    },

    endCall: () => {
        const { connection, callStatus } = get();

        // Guard against double-trigger (disconnect event + user click)
        if (callStatus === 'idle' || callStatus === 'ended') return;

        try {
            if (connection) {
                if ((connection as any)._timer) clearInterval((connection as any)._timer);
                try {
                    connection.disconnect();
                } catch (e) {
                    console.warn("Error disconnecting call:", e);
                }
            }
        } catch (e) {
            console.warn("Error in endCall cleanup:", e);
        }

        set({
            connection: null,
            incomingCall: null,
            callStatus: 'idle',
            isMuted: false,
            isOnHold: false,
            isRecordingPaused: false,
            showPostCallDrawer: true,
        });
    },

    toggleMute: () => {
        const { connection, isMuted } = get();
        if (connection) {
            connection.mute(!isMuted);
            console.log(`Call ${!isMuted ? "muted" : "unmuted"}`);
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
            streamSid: null,
            callSid: null,
            callId: null,
            pendingOutbound: false,
            showPostCallDrawer: false,
            showVoicemailToast: false,
        });
    },

    setShowPostCallDrawer: (show) => set({ showPostCallDrawer: show }),
    setShowVoicemailToast: (show) => set({ showVoicemailToast: show }),

    setMockState: (state: Partial<CallState>) => set((prev) => ({ ...prev, ...state })),
}));
