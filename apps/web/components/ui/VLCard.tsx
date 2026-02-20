/**
 * VocaLabs Design System — Card Primitive
 *
 * Usage:
 *   <VLCard>Content</VLCard>
 *   <VLCard variant="glass">Blurred glass card</VLCard>
 *   <VLCard variant="solid" className="p-8">Custom padding</VLCard>
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

export type CardVariant = "glass" | "solid" | "outline" | "dark-glass";

interface VLCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    shadow?: boolean;
    radius?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
    glass:
        "border border-white/10 backdrop-blur-glass",
    solid:
        "bg-white border border-vl-gray-4",
    outline:
        "bg-transparent border border-vl-gray-2",
    "dark-glass":
        "border border-[rgba(17,17,17,0.05)] backdrop-blur-glass",
};

const variantStyles: Record<CardVariant, React.CSSProperties> = {
    glass: { background: "var(--vl-glass)" },
    solid: {},
    outline: {},
    "dark-glass": { background: "var(--vl-glass-dark)" },
};

const radiusClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
} as const;

export function VLCard({
    variant = "solid",
    shadow = false,
    radius = "lg",
    className,
    children,
    style,
    ...rest
}: VLCardProps) {
    return (
        <div
            className={cn(
                "p-6",
                variantClasses[variant],
                radiusClasses[radius],
                shadow && "shadow-vl-sm",
                className
            )}
            style={{ ...variantStyles[variant], ...style }}
            {...rest}
        >
            {children}
        </div>
    );
}
