import { cn } from "@repo/ui/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    children: React.ReactNode;
}

export function Card({ title, children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "flex w-full flex-col gap-3 rounded-[24px] border border-white/10 p-6 shadow-[0px_4px_8px_0px_rgba(26,26,26,0.12)] backdrop-blur-[42px]",
                className
            )}
            style={{
                background:
                    "linear-gradient(103.27deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)",
            }}
            {...props}
        >
            {title && (
                <h3 className="text-base font-medium text-[#0c335c]">{title}</h3>
            )}
            <div className="flex-1">{children}</div>
        </div>
    );
}
