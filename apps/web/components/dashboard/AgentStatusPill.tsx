import { cn } from "@repo/ui/lib/utils";

export type AgentStatusType = "Live" | "On Call" | "Offline" | "Paused";

interface AgentStatusPillProps {
    status: AgentStatusType;
    className?: string;
}

const variantMap: Record<AgentStatusType, { bg: string; dot: string }> = {
    "Live": { bg: "bg-green-100 text-green-700 border border-green-200", dot: "bg-live" },
    "On Call": { bg: "bg-orange-100 text-brand border border-orange-200", dot: "bg-brand" },
    "Offline": { bg: "bg-red-100 text-danger border border-red-200", dot: "bg-danger" },
    "Paused": { bg: "bg-amber-100 text-amber-700 border border-amber-200", dot: "bg-warning" },
};

export default function AgentStatusPill({ status, className }: AgentStatusPillProps) {
    const v = variantMap[status] ?? variantMap["Offline"];
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-vl-xs font-medium",
            v.bg,
            className
        )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", v.dot)} />
            {status}
        </span>
    );
}
