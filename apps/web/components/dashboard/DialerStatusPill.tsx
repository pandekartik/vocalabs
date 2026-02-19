
import { cn } from "@repo/ui/lib/utils";
import { Signal, Loader2, Ban } from "lucide-react";

export type DialerStatusType = "Connected" | "Initializing" | "Disconnected";

interface DialerStatusPillProps {
    status: DialerStatusType;
    className?: string;
}

export default function DialerStatusPill({ status, className }: DialerStatusPillProps) {
    return (
        <div className={cn(
            "flex items-center gap-1 rounded-3xl px-3 py-1",
            status === "Connected" && "bg-[#1db013]",
            status === "Initializing" && "bg-[#fe641f]",
            status === "Disconnected" && "bg-[#b01313]",
            className
        )}>
            {status === "Connected" && <Signal className="h-3 w-3 text-white" />}
            {status === "Initializing" && <Loader2 className="h-3 w-3 text-white animate-spin" />}
            {status === "Disconnected" && <Ban className="h-3 w-3 text-white" />}

            <span className="text-[10px] font-medium text-white uppercase">{status}</span>
        </div>
    );
}
