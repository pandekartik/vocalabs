
import { cn } from "@repo/ui/lib/utils";
import { Phone } from "lucide-react";

interface CallControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'call' | 'end';
    children?: React.ReactNode;
}

export default function CallControlButton({ variant, className, children, ...props }: CallControlButtonProps) {
    const isCall = variant === 'call';

    return (
        <button
            className={cn(
                "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-[10px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                "text-white text-center font-sans text-[16px] font-semibold leading-[20px]",
                "shadow-[0px_4px_14px_0px_rgba(254,100,31,0.30)]", // Specific shadow from request
                isCall ? "bg-[#1DB013] hover:bg-[#16A34A]" : "bg-[#B01313] hover:bg-[#8a0f0f]",
                className
            )}
            {...props}
        >
            {/* Default Icons if children not provided, or can be composed */}
            {children ? children : (
                <>
                    <Phone className={cn("h-5 w-5 fill-current", isCall ? "" : "rotate-[135deg]")} />
                    <span>{isCall ? "Call" : "End Call"}</span>
                </>
            )}
        </button>
    );
}
