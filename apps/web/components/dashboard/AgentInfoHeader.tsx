
import { cn } from "@repo/ui/lib/utils";
import AgentStatusPill, { AgentStatusType } from "./AgentStatusPill";

interface AgentInfoHeaderProps {
    status: AgentStatusType;
    className?: string;
}

export default function AgentInfoHeader({ status, className }: AgentInfoHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3 rounded-3xl border border-white/10 p-6 shadow-sm backdrop-blur-[42px]",
                className
            )}
            style={{
                background: "linear-gradient(110.65deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)"
            }}
        >
            <h2 className="font-medium text-[#0c335c] text-base">Agent Information</h2>
            <div className="flex items-center gap-2 w-full">
                {/* Avatar */}
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(254,100,31,0.05)] p-1 backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(94.88deg, rgba(254, 100, 31, 0.2) 0%, rgba(254, 100, 31, 0.1) 100%)"
                    }}
                >
                    <span className="text-xs text-[#111]">K.P.</span>
                </div>

                {/* Name & Phone */}
                <div className="flex flex-1 flex-col justify-center">
                    <p className="font-medium text-[#0c335c] text-sm">Kartik Pande</p>
                    <p className="text-xs text-[#64748b]">+91 7722010666</p>
                </div>

                {/* Status Pill */}
                <AgentStatusPill status={status} />
            </div>
        </div>
    );
}
