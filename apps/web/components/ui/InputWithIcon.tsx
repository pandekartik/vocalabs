import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging, if not I'll just use template literals consistently or check if it exists.

export interface InputWithIconProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative flex items-center w-full">
                {icon && (
                    <div className="absolute left-3 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        "flex h-12 w-full rounded-md border border-gray-200 bg-[#F5F6FA] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        icon ? "pl-10" : "", // Add padding if icon exists
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
