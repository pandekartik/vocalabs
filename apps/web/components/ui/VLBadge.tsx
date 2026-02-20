/**
 * VocaLabs Design System — Badge Primitive
 *
 * Usage:
 *   <VLBadge variant="live">Live</VLBadge>
 *   <VLBadge variant="oncall">On Call</VLBadge>
 *   <VLBadge variant="info" dot={false}>Inbound Only</VLBadge>
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

export type BadgeVariant =
    | "live"
    | "oncall"
    | "offline"
    | "paused"
    | "info"
    | "warning"
    | "danger"
    | "neutral";

interface VLBadgeProps {
    variant?: BadgeVariant;
    dot?: boolean;
    pulse?: boolean;
    className?: string;
    children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
    live: "bg-green-100 text-green-700 border border-green-200",
    oncall: "bg-orange-100 text-brand border border-orange-200",
    offline: "bg-red-100 text-red-700 border border-red-200",
    paused: "bg-amber-100 text-amber-700 border border-amber-200",
    info: "bg-blue-100 text-blue-700 border border-blue-200",
    warning: "bg-amber-50 text-amber-600 border border-amber-200",
    danger: "bg-red-50 text-red-600 border border-red-200",
    neutral: "bg-vl-gray-1 text-vl-gray-3 border border-vl-gray-2",
};

const dotClasses: Record<BadgeVariant, string> = {
    live: "bg-green-500",
    oncall: "bg-brand",
    offline: "bg-danger",
    paused: "bg-amber-500",
    info: "bg-info",
    warning: "bg-warning",
    danger: "bg-danger",
    neutral: "bg-vl-gray-3",
};

export function VLBadge({
    variant = "neutral",
    dot = true,
    pulse = false,
    className,
    children,
}: VLBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-vl-xs font-medium",
                variantClasses[variant],
                className
            )}
        >
            {dot && (
                <span className="relative flex h-1.5 w-1.5">
                    {pulse && (
                        <span
                            className={cn(
                                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                dotClasses[variant]
                            )}
                        />
                    )}
                    <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotClasses[variant])} />
                </span>
            )}
            {children}
        </span>
    );
}
