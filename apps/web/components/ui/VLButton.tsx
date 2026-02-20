/**
 * VocaLabs Design System — Button Primitive
 * 
 * Usage:
 *   <VLButton>Submit</VLButton>
 *   <VLButton variant="secondary" size="sm">Cancel</VLButton>
 *   <VLButton variant="danger" isLoading>Deleting...</VLButton>
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface VLButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-brand text-white hover:bg-brand-hover shadow-vl-orange disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
        "bg-white border border-vl-gray-2 text-navy hover:bg-vl-gray-1 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
        "bg-transparent text-navy hover:bg-vl-gray-1 disabled:opacity-50",
    danger:
        "bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3.5 py-2 text-vl-sm rounded-sm gap-1.5",
    md: "px-5 py-2.5 text-vl-sm font-medium rounded-sm gap-2",
    lg: "px-6 py-3 text-vl-base font-medium rounded-sm gap-2",
};

export function VLButton({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    ...rest
}: VLButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center transition-colors font-medium select-none",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : leftIcon ? (
                leftIcon
            ) : null}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}
