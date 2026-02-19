
import { cn } from "@repo/ui/lib/utils";

export type AgentStatusType = "Live" | "On Call" | "Offline";

interface AgentStatusPillProps {
    status: AgentStatusType;
    className?: string;
}

export default function AgentStatusPill({ status, className }: AgentStatusPillProps) {
    return (
        <div className={cn(
            "flex items-center gap-1 rounded-3xl px-3 py-1",
            status === "Live" && "bg-[#1db013]",
            status === "On Call" && "bg-[#fe641f]",
            status === "Offline" && "bg-[#b01313]",
            className
        )}>
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="text-[10px] font-medium text-white uppercase">{status}</span>
        </div>
    );
}
