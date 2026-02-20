import { cn } from "@repo/ui/lib/utils";

export type AgentStatusType = "Live" | "On Call" | "Offline" | "Paused";

interface AgentStatusPillProps {
    status: AgentStatusType;
    className?: string;
}

const variantMap: Record<AgentStatusType, { bg: string }> = {
    "Live": { bg: "bg-[#1db013] text-white" },
    "On Call": { bg: "bg-brand text-white" },
    "Offline": { bg: "bg-[#b01313] text-white" },
    "Paused": { bg: "bg-warning text-white" },
};

export default function AgentStatusPill({ status, className }: AgentStatusPillProps) {
    const v = variantMap[status] ?? variantMap["Offline"];
    return (
        <span className={cn(
            "inline-flex items-center justify-center rounded-3xl px-3 py-1 text-[10px] font-medium uppercase shadow-sm",
            v.bg,
            className
        )}>
            {status}
        </span>
    );
}
