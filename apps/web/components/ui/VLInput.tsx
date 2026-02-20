/**
 * VocaLabs Design System — Input Primitive
 *
 * Usage:
 *   <VLInput label="Email" type="email" placeholder="you@example.com" />
 *   <VLInput label="Search" icon={<Search size={16} />} variant="search" />
 *   <VLInput label="Name" error="Name is required" />
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

type InputVariant = "default" | "search" | "filled";

interface VLInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
    rightAdornment?: React.ReactNode;
    variant?: InputVariant;
    required?: boolean;
    /** className applied to the outer wrapper div for layout control (e.g. flex-1) */
    wrapperClassName?: string;
}

export function VLInput({
    label,
    error,
    hint,
    icon,
    rightAdornment,
    variant = "default",
    required,
    className,
    wrapperClassName,
    id,
    ...rest
}: VLInputProps) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const baseInput = cn(
        "w-full bg-transparent text-vl-base text-ink placeholder:text-vl-gray-3 focus:outline-none transition-colors",
        icon && "pl-8",
        rightAdornment && "pr-8"
    );

    const wrapperClass = cn(
        "relative flex items-center border rounded-sm px-3.5 py-2.5 transition-colors",
        variant === "filled" && "bg-vl-gray-1",
        variant === "search" && "bg-vl-gray-1",
        variant === "default" && "bg-white",
        error
            ? "border-danger focus-within:border-danger"
            : "border-vl-gray-2 focus-within:border-brand",
    );

    return (
        <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
            {label && (
                <label htmlFor={inputId} className="text-vl-sm font-medium text-navy">
                    {label}
                    {required && <span className="text-danger ml-0.5">*</span>}
                </label>
            )}
            <div className={wrapperClass}>
                {icon && (
                    <span className="absolute left-3.5 text-vl-gray-3 flex items-center">
                        {icon}
                    </span>
                )}
                <input
                    id={inputId}
                    className={cn(baseInput, className)}
                    {...rest}
                />
                {rightAdornment && (
                    <span className="absolute right-3.5 text-vl-gray-3 flex items-center">
                        {rightAdornment}
                    </span>
                )}
            </div>
            {error && <p className="text-vl-xs text-danger">{error}</p>}
            {!error && hint && <p className="text-vl-xs text-vl-gray-3">{hint}</p>}
        </div>
    );
}
