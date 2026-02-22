
import { create } from 'zustand';
import { Device, Call } from '@twilio/voice-sdk';
import { APIUSER, APIUSERDIAL } from '@/lib/axios';
import { playRecordingPaused, playRecordingResumed, playHoldOn, playHoldOff } from '@/lib/callSounds';

// Module-level reference to the outbound WebSocket so auto-accept can attach it to the call
let _outboundWs: WebSocket | null = null;

interface TranscriptMessage {
    speaker: 'Agent' | 'Customer';
    text: string;
}

interface CallState {
    device: Device | null;
    connection: Call | null;
    callStatus: 'idle' | 'registered' | 'connecting' | 'ringing' | 'in-progress' | 'ending' | 'ended' | 'error';
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
    sendDTMF: (digit: string) => void;
    toggleMute: () => void;
    toggleHold: () => Promise<void>;
    toggleRecording: () => Promise<void>;
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

                // Send heartbeat to mark agent online in Redis
                // (critical for inbound call routing — agent must be online)
                const authToken = localStorage.getItem("token");
                if (authToken) {
                    // heartbeat is at root /heartbeat, not under /calls
                    import('axios').then(({ default: axios }) => {
                        axios.post('https://api.vocalabstech.com/heartbeat', {}, {
                            headers: { Authorization: `Bearer ${authToken}` },
                        }).then(() => console.log("💓 Agent heartbeat sent (online)"))
                            .catch((e) => console.warn("Heartbeat failed:", e));

                        // Periodic heartbeat every 30s to maintain online status
                        const heartbeatInterval = setInterval(() => {
                            const t = localStorage.getItem("token");
                            if (!t) { clearInterval(heartbeatInterval); return; }
                            axios.post('https://api.vocalabstech.com/heartbeat', {}, {
                                headers: { Authorization: `Bearer ${t}` },
                            }).catch(() => { });
                        }, 30000);
                        (newDevice as any)._heartbeatInterval = heartbeatInterval;
                    });
                }
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

                    // Attach the outbound WebSocket to the call object for cleanup in endCall()
                    if (_outboundWs) {
                        (call as any)._ws = _outboundWs;
                        _outboundWs = null;
                    }

                    const timer = setInterval(() => {
                        set((state) => ({ duration: state.duration + 1 }));
                    }, 1000);
                    (call as any)._timer = timer;

                    call.on("disconnect", async (call: any) => {
                        console.log("📞 Call disconnected (outbound call ended)", {
                            callSid: get().callSid,
                            callParameters: call?.parameters,
                        });
                        // Guard: if we're on hold, the conference state change can
                        // trigger a spurious disconnect event — don't end the call.
                        if (get().isOnHold) {
                            console.log("⚠️ Disconnect during hold — ignoring (conference state change)");
                            return;
                        }
                        // Report disconnect reason to backend (customer initiated)
                        // MUST complete before endCall() to avoid race condition
                        // where /end sets disconnect_reason=AGENT before this arrives
                        const token = localStorage.getItem("token");
                        const currentCallSid = get().callSid;
                        if (currentCallSid && token) {
                            try {
                                await APIUSERDIAL.post(`/${currentCallSid}/disconnect-reason`, { reason: 'customer' }, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                console.log("✅ Disconnect reason (customer) saved before endCall");
                            } catch (e) {
                                console.warn("Failed to save disconnect reason:", e);
                            }
                        }
                        get().endCall();
                    });

                    call.on("cancel", () => {
                        console.log("📞 Call canceled (outbound call was canceled)");
                        get().endCall();
                    });

                    call.on("reject", () => {
                        console.log("📞 Call rejected (outbound call was rejected)");
                        get().endCall();
                    });

                    call.on("error", (error: any) => {
                        console.error("❌ Call error:", error);
                        set({ errorMessage: error?.message || "Call error" });
                        get().endCall();
                    });
                } else {
                    // Genuine inbound call — show popup
                    const inboundCallSid = call.parameters?.CallSid || null;
                    // Read customer's phone number from custom parameters
                    // (passed by backend via add_agent_to_conference)
                    const customerNum = (call as any).customParameters?.get?.('customerNumber')
                        || call.parameters?.From || null;
                    set({
                        incomingCall: call,
                        callSid: inboundCallSid,
                        phoneNumber: customerNum || 'Unknown',
                    });

                    // Pre-fetch stream_sid so it's ready when user accepts
                    // (WebSocket needs stream_sid, not CallSid, for transcript delivery)
                    if (inboundCallSid) {
                        const token = localStorage.getItem("token");
                        if (token) {
                            APIUSERDIAL.get(`/${inboundCallSid}/stream-info`, {
                                headers: { Authorization: `Bearer ${token}` },
                            }).then((res) => {
                                const { stream_sid, call_id, call_sid } = res.data;
                                // IMPORTANT: call_sid from stream-info is the CUSTOMER's
                                // call_sid (resolved via Redis mapping). All backend
                                // endpoints need this — not the agent's participant SID.
                                set({
                                    streamSid: stream_sid,
                                    callId: call_id,
                                    callSid: call_sid || inboundCallSid,
                                });
                                console.log("📡 Pre-fetched stream info for inbound:", { stream_sid, call_id, call_sid });
                            }).catch((e) => {
                                console.warn("Failed to fetch stream info:", e);
                            });
                        }
                    }

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
            // Clear heartbeat interval
            if ((device as any)._heartbeatInterval) {
                clearInterval((device as any)._heartbeatInterval);
            }
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
            _outboundWs = ws; // Store reference for auto-accept handler
            ws.onopen = () => {
                console.log("✅ WebSocket connected for call events");
                // Send keepalive pings every 15s to prevent nginx/proxy from
                // closing the connection due to inactivity
                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ event: "ping" }));
                    } else {
                        clearInterval(pingInterval);
                    }
                }, 15000);
                (ws as any)._pingInterval = pingInterval;
            };
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event !== "heartbeat" && data.event !== "pong") {
                        console.log("📨 WS message received:", data.event);
                    }

                    // Full transcript content from STT (matching reference agent-assist pattern)
                    // Replaces entire transcript array with properly-tagged conversation
                    if (data.event === "full_content" && data.data?.transcripts) {
                        console.log("📋 Received full_content with", data.data.transcripts.length, "entries");
                        const messages: TranscriptMessage[] = data.data.transcripts
                            .filter((t: any) => t.event === "transcription" && t.data && t.data.trim())
                            .map((t: any) => ({
                                speaker: t.speaker === "Agent" ? "Agent" as const : "Customer" as const,
                                text: t.data,
                            }));
                        console.log("📋 Parsed", messages.length, "transcript messages (filtered empty)");
                        set({ transcript: messages });
                        return;
                    }

                    // Individual transcript event (backwards compatibility)
                    if (data.event === "transcript" && data.is_final && data.transcript && data.transcript.trim()) {
                        const speaker = data.speaker || "Customer";
                        get().addTranscriptMessage({
                            speaker: speaker === "Agent" ? "Agent" : "Customer",
                            text: data.transcript,
                        });
                    }

                    // Stream ended by Twilio
                    if (data.event === "stream_ended") {
                        console.log("📡 Stream ended, call complete");
                    }

                    // Call ended — backend pushes this when Twilio sends terminal status
                    // (completed, failed, busy, no-answer, canceled)
                    // Critical for pre-bridge: customer rejects/doesn't answer →
                    // agent's Device never gets incoming call → no "disconnect" event.
                    // This WebSocket event is the only way for frontend to know.
                    if (data.event === "call_ended") {
                        console.log("📡 Call ended via WebSocket:", data.status, "call_sid:", data.call_sid);
                        get().endCall();
                    }
                } catch (e) {
                    console.error("WebSocket message parsing error", e);
                }
            };
            ws.onerror = (error) => console.error("WebSocket error:", error);
            ws.onclose = () => {
                console.log("WebSocket closed");
                if ((ws as any)._pingInterval) clearInterval((ws as any)._pingInterval);
            };

            // 3. Backend has already called twilio.calls.create(to=destination)
            //    When destination answers, TwiML bridges to our Device.
            //    Mark as pendingOutbound so incoming handler auto-accepts.
            set({ pendingOutbound: true, callStatus: 'connecting' });
            console.log("⏳ Backend calling destination, waiting for bridge to agent Device...");

            // 4. Poll call status as FALLBACK for pre-bridge termination detection
            //    If WebSocket drops or misses the call_ended event, this catches it.
            //    Polls GET /calls/{callId} every 5s while pendingOutbound.
            const statusPollInterval = setInterval(async () => {
                const { pendingOutbound: stillPending, callId: currentCallId, callStatus: currentStatus } = get();
                // Stop polling once call is bridged, ended, or idle
                if (!stillPending || !currentCallId || currentStatus === 'in-progress' || currentStatus === 'idle' || currentStatus === 'ending') {
                    clearInterval(statusPollInterval);
                    return;
                }
                try {
                    const pollToken = localStorage.getItem("token");
                    if (!pollToken) return;
                    const res = await APIUSERDIAL.get(`/${currentCallId}`, {
                        headers: { Authorization: `Bearer ${pollToken}` },
                    });
                    const status = res.data?.status;
                    const terminalStatuses = ['completed', 'failed', 'busy', 'no-answer', 'canceled', 'no_answer'];
                    if (terminalStatuses.includes(status)) {
                        console.log(`📡 Poll detected call ended: status=${status}`);
                        clearInterval(statusPollInterval);
                        get().endCall();
                    }
                } catch (e: any) {
                    // Don't treat errors as "call ended" — just log and try again next interval
                    console.warn("📡 Poll status check failed:", e?.response?.status || e?.message);
                }
            }, 5000);

            // Store references for cleanup
            (ws as any)._statusPollInterval = statusPollInterval;

            // Timeout: destination needs to answer before Twilio bridges
            setTimeout(() => {
                const { pendingOutbound: stillPending, callSid: currentCallSid } = get();
                if (stillPending) {
                    console.error("Timeout: destination didn't answer or bridge failed");

                    // Terminate the Twilio call so destination stops ringing
                    const token = localStorage.getItem("token");
                    if (currentCallSid && token) {
                        APIUSERDIAL.post(`/${currentCallSid}/end`, {}, {
                            headers: { Authorization: `Bearer ${token}` },
                        }).catch(() => { });
                    }

                    // Reset to idle so the UI returns to the dialer view
                    set({
                        pendingOutbound: false,
                        callStatus: 'idle',
                        callSid: null,
                        streamSid: null,
                        connection: null,
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
        const { incomingCall, streamSid, callSid } = get();
        if (incomingCall) {
            incomingCall.accept();
            set({
                connection: incomingCall,
                incomingCall: null,
                callStatus: 'in-progress',
                duration: 0,
                transcript: [],
            });

            const timer = setInterval(() => {
                set((state) => ({ duration: state.duration + 1 }));
            }, 1000);
            (incomingCall as any)._timer = timer;

            // Connect WebSocket for live transcription (if streamSid available)
            const sid = streamSid || incomingCall.parameters?.CallSid;
            if (sid) {
                const token = localStorage.getItem("token");
                const wsUrl = `wss://api.vocalabstech.com/ws/call-events/${sid}?token=${token}`;
                const ws = new WebSocket(wsUrl);
                ws.onopen = () => console.log("✅ Inbound call WebSocket connected");
                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log("📨 [Inbound] WS message:", data.event);

                        if (data.event === "full_content" && data.data?.transcripts) {
                            console.log("📋 [Inbound] Received full_content with", data.data.transcripts.length, "entries");
                            const messages: TranscriptMessage[] = data.data.transcripts
                                .filter((t: any) => t.event === "transcription" && t.data && t.data.trim())
                                .map((t: any) => ({
                                    speaker: t.speaker === "Agent" ? "Agent" as const : "Customer" as const,
                                    text: t.data,
                                }));
                            console.log("📋 [Inbound] Parsed", messages.length, "transcript messages (filtered empty)");
                            set({ transcript: messages });
                            return;
                        }

                        if (data.event === "transcript" && data.is_final && data.transcript && data.transcript.trim()) {
                            const speaker = data.speaker || "Customer";
                            get().addTranscriptMessage({
                                speaker: speaker === "Agent" ? "Agent" : "Customer",
                                text: data.transcript,
                            });
                        }
                    } catch (e) {
                        console.error("WebSocket message parsing error", e);
                    }
                };
                ws.onerror = (error) => console.error("Inbound WS error:", error);
                ws.onclose = () => console.log("Inbound WS closed");
                (incomingCall as any)._ws = ws;
            }

            incomingCall.on("disconnect", async () => {
                // Guard: if we're on hold, ignore conference state change
                if (get().isOnHold) {
                    console.log("⚠️ Inbound disconnect during hold — ignoring");
                    return;
                }
                // Customer hung up — report disconnect reason
                // MUST complete before endCall() to avoid race condition
                const token = localStorage.getItem("token");
                const currentCallSid = get().callSid || callSid;
                if (currentCallSid && token) {
                    try {
                        await APIUSERDIAL.post(`/${currentCallSid}/disconnect-reason`, { reason: 'customer' }, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        console.log("✅ Disconnect reason (customer) saved before endCall");
                    } catch (e) {
                        console.warn("Failed to save disconnect reason:", e);
                    }
                }
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
        const { incomingCall, callSid } = get();
        if (incomingCall) {
            // Tell backend to redirect the CUSTOMER's call to voicemail
            // and end the conference so all legs disconnect cleanly
            const token = localStorage.getItem("token");
            if (callSid && token) {
                import('axios').then(({ default: axios }) => {
                    axios.post('https://api.vocalabstech.com/twilio/send-to-voicemail',
                        { call_sid: callSid },
                        { headers: { Authorization: `Bearer ${token}` } }
                    ).then(() => {
                        console.log("✅ Customer redirected to voicemail");
                    }).catch((e) => {
                        console.warn("Failed to send to voicemail:", e);
                    });
                });
            }
            // Reject the agent's incoming call leg locally
            incomingCall.reject();
            set({ incomingCall: null, showVoicemailToast: true });
        }
    },

    sendDTMF: (digit: string) => {
        const { connection } = get();
        if (connection) {
            connection.sendDigits(digit);
            console.log(`📱 DTMF sent: ${digit}`);
        }
    },

    endCall: () => {
        const { connection, callStatus, callSid } = get();

        // Guard against double-trigger (disconnect event + user click)
        if (callStatus === 'idle' || callStatus === 'ended' || callStatus === 'ending') {
            console.log(`⚠️ endCall skipped — already ${callStatus}`);
            return;
        }

        console.log(`🔴 endCall called — callSid=${callSid}, callStatus=${callStatus}`);

        // Mark as ending immediately to prevent re-entry
        set({ callStatus: 'ending' });

        // Terminate the Twilio call for BOTH parties via backend API
        // This is the critical step — it tells Twilio to end the parent call
        // which automatically ends all child legs (including the <Dial> to customer)
        const token = localStorage.getItem("token");
        if (callSid && token) {
            console.log(`📡 Sending POST /${callSid}/end to terminate both parties...`);
            APIUSERDIAL.post(`/${callSid}/end`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(() => {
                console.log(`✅ Backend confirmed call ${callSid} terminated`);
            }).catch((e) => {
                console.warn("Backend end-call failed (call may already be over):", e?.response?.status, e?.message);
            });
        } else {
            console.warn(`⚠️ Cannot send end-call to backend: callSid=${callSid}, hasToken=${!!token}`);
        }

        // Clean up the local Twilio Device connection
        try {
            if (connection) {
                // Stop the call duration timer
                if ((connection as any)._timer) {
                    clearInterval((connection as any)._timer);
                    (connection as any)._timer = null;
                }
                // Close the WebSocket for live transcription
                if ((connection as any)._ws) {
                    const wsRef = (connection as any)._ws;
                    // Clean up status polling interval
                    if (wsRef._statusPollInterval) {
                        clearInterval(wsRef._statusPollInterval);
                        wsRef._statusPollInterval = null;
                    }
                    // Clean up ping interval
                    if (wsRef._pingInterval) {
                        clearInterval(wsRef._pingInterval);
                        wsRef._pingInterval = null;
                    }
                    try { wsRef.close(); } catch (e) { }
                    (connection as any)._ws = null;
                }
                // Disconnect the local Twilio call leg
                try {
                    connection.disconnect();
                    console.log("✅ Local connection disconnected");
                } catch (e) {
                    console.warn("Error disconnecting local call:", e);
                }
            }
        } catch (e) {
            console.warn("Error in endCall cleanup:", e);
        }

        // Reset all call-related state
        set({
            connection: null,
            incomingCall: null,
            pendingOutbound: false,
            callStatus: 'idle',
            callSid: null,
            streamSid: null,
            isMuted: false,
            isOnHold: false,
            isRecordingPaused: false,
            showPostCallDrawer: true,
        });
        console.log("✅ Call state reset to idle");
    },

    toggleMute: () => {
        const { connection, isMuted } = get();
        if (connection) {
            connection.mute(!isMuted);
            console.log(`Call ${!isMuted ? "muted" : "unmuted"}`);
        }
        set({ isMuted: !isMuted });
    },

    toggleHold: async () => {
        const { isOnHold, callSid } = get();
        const token = localStorage.getItem("token");
        if (!callSid || !token) {
            console.warn("Cannot toggle hold: no active call or token");
            return;
        }

        // Conference-based hold: customer hears hold music, agent hears silence.
        // Uses backend API → Twilio Conference participant hold.
        //
        // Old local mute approach (commented out for reference):
        // connection.mute(!isOnHold);
        // set({ isOnHold: !isOnHold, isMuted: !isOnHold });

        const endpoint = isOnHold
            ? `/${callSid}/unhold`
            : `/${callSid}/hold`;

        try {
            await APIUSERDIAL.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!isOnHold) {
                playHoldOn();
                console.log("Call put on hold (conference hold)");
            } else {
                playHoldOff();
                console.log("Call resumed from hold (conference unhold)");
            }
            set({ isOnHold: !isOnHold });
        } catch (e: any) {
            console.error(`Failed to ${isOnHold ? 'unhold' : 'hold'} call:`, e);
        }
    },

    toggleRecording: async () => {
        const { isRecordingPaused, callSid } = get();
        const token = localStorage.getItem("token");
        if (!callSid || !token) {
            console.warn("Cannot toggle recording: no active call or token");
            return;
        }

        const endpoint = isRecordingPaused
            ? `/${callSid}/resume-recording`
            : `/${callSid}/pause-recording`;

        try {
            await APIUSERDIAL.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ isRecordingPaused: !isRecordingPaused });

            // Play audio notification to agent
            if (!isRecordingPaused) {
                playRecordingPaused();
            } else {
                playRecordingResumed();
            }
            console.log(`Recording ${isRecordingPaused ? 'resumed' : 'paused'}`);
        } catch (e: any) {
            console.error(`Failed to ${isRecordingPaused ? 'resume' : 'pause'} recording:`, e);
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
