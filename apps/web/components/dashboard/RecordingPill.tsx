
import { cn } from "@repo/ui/lib/utils";
import { Circle, Pause } from "lucide-react";

interface RecordingPillProps {
    isPaused?: boolean;
    className?: string;
}

export default function RecordingPill({ isPaused = false, className }: RecordingPillProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-2 px-3 py-1 rounded-2xl border border-[rgba(17,17,17,0.05)] backdrop-blur-[42px] transition-all",
                className
            )}
            style={{
                backgroundImage: isPaused
                    ? "linear-gradient(112.14deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    : "linear-gradient(116.85deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
            }}
        >
            {isPaused ? (
                <>
                    {/* Vector icon replacement */}
                    <Pause className="h-3 w-3 text-[#111]" fill="currentColor" />
                    <span className="font-medium text-[#111] text-[10px] uppercase tracking-wide">Paused</span>
                </>
            ) : (
                <>
                    {/* Ellipse icon replacement */}
                    <Circle className="h-3 w-3 text-[#B01313] fill-[#B01313]" />
                    <span className="font-medium text-[#111] text-[10px] uppercase tracking-wide">Recording</span>
                </>
            )}
        </div>
    );
}
