/**
 * VocaLabs Design System — Toggle Primitive
 *
 * Usage:
 *   <VLToggle checked={enabled} onChange={setEnabled} label="Enable feature" />
 */
import React from "react";
import { cn } from "@repo/ui/lib/utils";

interface VLToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
}

export function VLToggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    id,
    className,
}: VLToggleProps) {
    const inputId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
        <label
            htmlFor={inputId}
            className={cn(
                "flex items-center gap-3 cursor-pointer select-none",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <div className="relative flex-1">
                {label && <p className="text-vl-sm font-medium text-navy">{label}</p>}
                {description && <p className="text-vl-xs text-vl-gray-3 mt-0.5">{description}</p>}
            </div>

            <div className="relative inline-flex items-center shrink-0">
                <input
                    id={inputId}
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div
                    className={cn(
                        "w-11 h-6 rounded-pill transition-colors duration-200",
                        "peer-focus:ring-2 peer-focus:ring-brand/30",
                        checked ? "bg-brand" : "bg-vl-gray-2"
                    )}
                />
                <div
                    className={cn(
                        "absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
                        checked && "translate-x-5"
                    )}
                />
            </div>
        </label>
    );
}
