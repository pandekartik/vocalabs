/**
 * VocaLabs Design System — Typography Primitives
 *
 * Usage:
 *   <VLHeading>Page Title</VLHeading>
 *   <VLTitle>Section Title</VLTitle>
 *   <VLBody muted>Helper text</VLBody>
 *   <VLLabel required>Email</VLLabel>
 *   <VLCaption>10 MINS AGO</VLCaption>
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

type PolyProps<T extends React.ElementType> = {
    as?: T;
    className?: string;
    children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

// Page heading — 28px bold navy
export function VLHeading<T extends React.ElementType = "h1">({
    as,
    className,
    children,
    ...rest
}: PolyProps<T>) {
    const Tag = as || "h1";
    return (
        <Tag className={cn("text-vl-2xl font-bold text-navy leading-tight", className)} {...rest}>
            {children}
        </Tag>
    );
}

// Section / card title — 18px semibold navy
export function VLTitle<T extends React.ElementType = "h2">({
    as,
    className,
    children,
    ...rest
}: PolyProps<T>) {
    const Tag = as || "h2";
    return (
        <Tag className={cn("text-vl-lg font-semibold text-navy", className)} {...rest}>
            {children}
        </Tag>
    );
}

// Modal / subsection title — 16px medium navy
export function VLSubtitle<T extends React.ElementType = "h3">({
    as,
    className,
    children,
    ...rest
}: PolyProps<T>) {
    const Tag = as || "h3";
    return (
        <Tag className={cn("text-vl-md font-medium text-navy", className)} {...rest}>
            {children}
        </Tag>
    );
}

// Body text — 14px regular ink (or muted gray-3)
interface VLBodyProps extends PolyProps<"p"> {
    muted?: boolean;
}
export function VLBody({ as, className, children, muted, ...rest }: VLBodyProps) {
    const Tag = as || "p";
    return (
        <Tag
            className={cn("text-vl-base leading-relaxed", muted ? "text-vl-gray-3" : "text-ink", className)}
            {...rest}
        >
            {children}
        </Tag>
    );
}

// Form label — 13px medium navy, with optional required star
interface VLLabelProps {
    htmlFor?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
}
export function VLLabel({ htmlFor, required, className, children }: VLLabelProps) {
    return (
        <label htmlFor={htmlFor} className={cn("block text-vl-sm font-medium text-navy", className)}>
            {children}
            {required && <span className="text-danger ml-0.5">*</span>}
        </label>
    );
}

// Caption / secondary info — 12px regular gray-3
export function VLCaption<T extends React.ElementType = "span">({
    as,
    className,
    children,
    ...rest
}: PolyProps<T>) {
    const Tag = as || "span";
    return (
        <Tag className={cn("text-vl-xs text-vl-gray-3", className)} {...rest}>
            {children}
        </Tag>
    );
}

// Uppercase micro label — 10px bold gray-3 with letter-spacing
export function VLMicroLabel<T extends React.ElementType = "span">({
    as,
    className,
    children,
    ...rest
}: PolyProps<T>) {
    const Tag = as || "span";
    return (
        <Tag
            className={cn("text-vl-caps font-semibold uppercase tracking-widest text-vl-gray-3", className)}
            {...rest}
        >
            {children}
        </Tag>
    );
}
