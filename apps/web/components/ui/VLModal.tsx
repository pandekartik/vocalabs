/**
 * VocaLabs Design System — Modal Shell Primitive
 *
 * Usage:
 *   <VLModal isOpen={open} onClose={close} title="Add Agent" size="md">
 *     {content}
 *   </VLModal>
 */
"use client";
import React from "react";
import { X } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

type ModalSize = "sm" | "md" | "lg";

interface VLModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    size?: ModalSize;
    children: React.ReactNode;
    footer?: React.ReactNode;
    /** Prevent closing by clicking backdrop */
    dismissible?: boolean;
    className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-[400px]",
    md: "max-w-[600px]",
    lg: "max-w-[800px]",
};

export function VLModal({
    isOpen,
    onClose,
    title,
    subtitle,
    size = "md",
    children,
    footer,
    dismissible = true,
    className,
}: VLModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={dismissible ? onClose : undefined}
            />

            {/* Shell */}
            <div
                className={cn(
                    "bg-white rounded-xl w-full shadow-vl-md relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200",
                    sizeClasses[size],
                    className
                )}
            >
                {/* Header */}
                {(title || subtitle) && (
                    <div className="flex items-start justify-between px-8 py-6 border-b border-vl-gray-4 shrink-0">
                        <div>
                            {title && (
                                <h2 className="text-vl-xl font-bold text-navy leading-tight">{title}</h2>
                            )}
                            {subtitle && (
                                <p className="text-vl-sm text-vl-gray-3 mt-1">{subtitle}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-vl-gray-1 rounded-md transition-colors text-vl-gray-3 ml-4 shrink-0 -mt-1 -mr-2"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Scrollable Body */}
                <div className="px-8 py-6 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-8 py-5 border-t border-vl-gray-4 bg-vl-gray-1/50 flex justify-end gap-3 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
