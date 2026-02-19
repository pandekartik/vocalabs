"use client";

import { useEffect } from "react";

import RecentCallsCard from "@/components/dashboard/RecentCallsCard";
import DialerCard from "@/components/dashboard/DialerCard";
import ActiveCallCard from "@/components/dashboard/ActiveCallCard";
import CallInputCard from "@/components/dashboard/CallInputCard";
import ActiveCallRightPanel from "@/components/dashboard/ActiveCallRightPanel";
import { useCallStore } from "@/store/useCallStore";
import DebugCallControl from "@/components/dashboard/DebugCallControl";

import IncomingCallPopup from "@/components/IncomingCallPopup";

export default function DashboardClient() {
    const { callStatus, initializeDevice, incomingCall, acceptIncomingCall, rejectIncomingCall } = useCallStore();
    const isCallActive = callStatus !== 'idle';

    useEffect(() => {
        // Initialize device on mount
        initializeDevice();
    }, [initializeDevice]);

    return (
        <div className="flex h-full gap-4">
            <div className="flex w-[400px] shrink-0 flex-col gap-4">

                {!isCallActive ? (
                    <div className="flex-1 min-h-0">
                        <DialerCard onCallStart={() => { }} />
                    </div>
                ) : (
                    <div className="flex-1 min-h-0 flex flex-col gap-4">
                        <div className="shrink-0">
                            <ActiveCallCard onEndCall={() => { }} />
                        </div>
                        <div className="flex-1 min-h-0">
                            <CallInputCard />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1">
                {!isCallActive ? <RecentCallsCard /> : <ActiveCallRightPanel />}
            </div>

            <IncomingCallPopup
                isVisible={!!incomingCall}
                onAccept={acceptIncomingCall}
                onDecline={rejectIncomingCall}
                onClose={rejectIncomingCall}
                callerName={incomingCall?.parameters?.From || "Unknown Caller"}
            />

            <DebugCallControl />
        </div>
    );
}
