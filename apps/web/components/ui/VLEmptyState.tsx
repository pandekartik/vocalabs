/**
 * VocaLabs Design System — Empty State Primitive
 *
 * Usage:
 *   <VLEmptyState
 *     icon={<Users size={32} />}
 *     title="No agents found"
 *     subtitle="Try adjusting your filters"
 *     action={<VLButton onClick={onClear}>Clear Filters</VLButton>}
 *   />
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

interface VLEmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export function VLEmptyState({
    icon,
    title,
    subtitle,
    action,
    className,
}: VLEmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-12 text-center w-full",
                className
            )}
        >
            {icon && (
                <div className="w-16 h-16 bg-vl-gray-1 rounded-pill flex items-center justify-center mb-4 text-vl-gray-3">
                    {icon}
                </div>
            )}
            <p className="text-vl-md font-semibold text-navy mb-1">{title}</p>
            {subtitle && (
                <p className="text-vl-sm text-vl-gray-3 max-w-xs">{subtitle}</p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
