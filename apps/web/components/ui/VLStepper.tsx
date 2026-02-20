/**
 * VocaLabs Design System — Stepper Primitive
 *
 * Usage:
 *   <VLStepper
 *     steps={[
 *       { label: "Basic Info", icon: User },
 *       { label: "Role", icon: Shield },
 *       { label: "Review", icon: FileText },
 *     ]}
 *     currentStep={2}
 *   />
 */
import React from "react";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface StepDef {
    label: string;
    icon: LucideIcon;
}

interface VLStepperProps {
    steps: StepDef[];
    currentStep: number; // 1-based
    className?: string;
}

export function VLStepper({ steps, currentStep, className }: VLStepperProps) {
    const total = steps.length;

    return (
        <div className={cn("flex items-center justify-between relative", className)}>
            {/* Track */}
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-vl-gray-4 z-0" />
            <div
                className="absolute top-5 left-0 h-[2px] bg-brand z-0 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (total - 1)) * 100}%` }}
            />

            {steps.map((step, i) => {
                const stepNum = i + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                const Icon = step.icon;

                return (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-pill flex items-center justify-center transition-all duration-300 border-2",
                                isActive &&
                                "bg-brand border-brand text-white shadow-vl-orange",
                                isCompleted &&
                                "bg-brand/10 border-brand text-brand",
                                !isActive && !isCompleted &&
                                "bg-white border-vl-gray-2 text-vl-gray-3"
                            )}
                        >
                            {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                        </div>
                        <span
                            className={cn(
                                "text-vl-xs font-medium absolute -bottom-6 whitespace-nowrap",
                                isActive || isCompleted ? "text-navy" : "text-vl-gray-3"
                            )}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
