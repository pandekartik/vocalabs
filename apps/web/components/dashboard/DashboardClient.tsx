"use client";

import { useState } from "react";
import AgentInfoCard from "@/components/dashboard/AgentInfoCard";
import RecentCallsCard from "@/components/dashboard/RecentCallsCard";
import DialerCard from "@/components/dashboard/DialerCard";
import ActiveCallCard from "@/components/dashboard/ActiveCallCard";
import CallInputCard from "@/components/dashboard/CallInputCard";
import ActiveCallRightPanel from "@/components/dashboard/ActiveCallRightPanel";

export default function DashboardClient() {
    const [isCallActive, setIsCallActive] = useState(false);

    return (
        <div className="flex h-full gap-4">
            <div className="flex w-[400px] shrink-0 flex-col gap-4">
                <AgentInfoCard status={isCallActive ? "ON CALL" : "LIVE"} />
                {!isCallActive ? (
                    <div className="flex-1 min-h-0">
                        <DialerCard onCallStart={() => setIsCallActive(true)} />
                    </div>
                ) : (
                    <div className="flex-1 min-h-0 flex flex-col gap-4">
                        <div className="shrink-0">
                            <ActiveCallCard onEndCall={() => setIsCallActive(false)} />
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
        </div>
    );
}
