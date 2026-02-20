"use client";

import React, { useState } from "react";
import { User, Shield, FileText } from "lucide-react";
import { VLModal, VLButton, VLInput, VLToggle, VLStepper } from "@/components/ui/vl";

interface AddAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type AgentRole = "inbound" | "outbound" | "both" | "";

const STEPS = [
    { label: "Basic Info", icon: User },
    { label: "Role & Permissions", icon: Shield },
    { label: "Review", icon: FileText },
];

export function AddAgentModal({ isOpen, onClose, onSuccess }: AddAgentModalProps) {
    const [step, setStep] = useState(1);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [employeeId, setEmployeeId] = useState("");

    const [role, setRole] = useState<AgentRole>("");
    const [hasDailyLimit, setHasDailyLimit] = useState(false);
    const [dailyLimit, setDailyLimit] = useState("100");
    const [hasDurationLimit, setHasDurationLimit] = useState(false);
    const [durationLimit, setDurationLimit] = useState("60");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const reset = () => {
        setStep(1); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setEmployeeId("");
        setRole(""); setHasDailyLimit(false); setHasDurationLimit(false);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => { setShowSuccess(false); onSuccess(); onClose(); reset(); }, 2000);
        }, 1000);
    };

    const isStep1Valid = firstName.trim() && lastName.trim() && email.includes("@");
    const isStep2Valid = role !== "";

    const renderStep1 = () => (
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
                <h3 className="text-vl-lg font-semibold text-navy">Basic Information</h3>
                <p className="text-vl-sm text-vl-gray-3 mt-1">Enter the agent's personal and contact details.</p>
            </div>
            <div className="flex gap-4">
                <VLInput label="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" wrapperClassName="flex-1" />
                <VLInput label="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" wrapperClassName="flex-1" />
            </div>
            <VLInput label="Email Address" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john.doe@company.com" />
            <div className="flex gap-4">
                <VLInput label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" wrapperClassName="flex-1" />
                <VLInput label="Employee ID (Optional)" value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="EMP-12345" wrapperClassName="flex-1" />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
                <h3 className="text-vl-lg font-semibold text-navy">Role & Permissions</h3>
                <p className="text-vl-sm text-vl-gray-3 mt-1">Define what type of calls this agent can handle.</p>
            </div>

            <div>
                <p className="text-vl-sm font-medium text-navy mb-3">Agent Type</p>
                <div className="grid grid-cols-3 gap-3">
                    {(["inbound", "outbound", "both"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`py-3 rounded-sm border-2 text-vl-sm font-medium capitalize transition-all ${role === r
                                ? "border-brand bg-brand/10 text-brand"
                                : "border-vl-gray-2 bg-white text-vl-gray-3 hover:border-vl-gray-3"
                                }`}
                        >
                            {r === "both" ? "Inbound & Outbound" : `${r} Only`}
                        </button>
                    ))}
                </div>
            </div>

            {role && (
                <div className="bg-vl-gray-1 rounded-md p-5 border border-vl-gray-4 flex flex-col gap-5">
                    <p className="text-vl-sm font-semibold text-navy">Call Limits</p>
                    <VLToggle
                        checked={hasDailyLimit}
                        onChange={setHasDailyLimit}
                        label="Daily Call Limit"
                        description="Maximum number of calls allowed per day"
                    />
                    {hasDailyLimit && (
                        <VLInput type="number" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} className="w-24 text-center" hint="calls / day" />
                    )}
                    <div className="h-px bg-vl-gray-4" />
                    <VLToggle
                        checked={hasDurationLimit}
                        onChange={setHasDurationLimit}
                        label="Maximum Call Duration"
                        description="Auto-terminate calls exceeding this limit"
                    />
                    {hasDurationLimit && (
                        <VLInput type="number" value={durationLimit} onChange={e => setDurationLimit(e.target.value)} className="w-24 text-center" hint="minutes / call" />
                    )}
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
                <h3 className="text-vl-lg font-semibold text-navy">Review & Confirm</h3>
                <p className="text-vl-sm text-vl-gray-3 mt-1">Ensure all details are correct before adding the agent.</p>
            </div>
            {[
                {
                    label: "Agent Profile", rows: [
                        { k: "Full Name", v: `${firstName} ${lastName}` },
                        { k: "Email", v: email },
                        { k: "Phone", v: phone || "Not provided" },
                        { k: "Employee ID", v: employeeId || "Not provided" },
                    ]
                },
                {
                    label: "Permissions", rows: [
                        { k: "Agent Type", v: role === "both" ? "Inbound & Outbound" : `${role} Only` },
                        { k: "Daily Limit", v: hasDailyLimit ? `${dailyLimit} calls` : "Unlimited" },
                        { k: "Duration Limit", v: hasDurationLimit ? `${durationLimit} mins` : "Unlimited" },
                    ]
                },
            ].map(section => (
                <div key={section.label} className="bg-vl-gray-1 rounded-md border border-vl-gray-4 p-5">
                    <p className="text-vl-caps font-semibold text-vl-gray-3 tracking-widest mb-4">{section.label}</p>
                    <div className="grid grid-cols-2 gap-4">
                        {section.rows.map(r => (
                            <div key={r.k}>
                                <p className="text-vl-xs text-vl-gray-3">{r.k}</p>
                                <p className="text-vl-sm font-medium text-navy mt-0.5">{r.v}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-pill flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
            <h2 className="text-vl-xl font-bold text-navy mb-2">Agent Added!</h2>
            <p className="text-vl-sm text-vl-gray-3 max-w-xs">An invitation has been sent to <span className="text-navy font-medium">{email}</span> with login instructions.</p>
        </div>
    );

    return (
        <VLModal
            isOpen={isOpen}
            onClose={onClose}
            title={showSuccess ? undefined : "Add New Agent"}
            size="md"
            footer={!showSuccess ? (
                <>
                    <VLButton variant="ghost" onClick={step === 1 ? onClose : () => setStep(s => s - 1)}>
                        {step === 1 ? "Cancel" : "Back"}
                    </VLButton>
                    {step < 3 ? (
                        <VLButton
                            variant="primary"
                            onClick={() => setStep(s => s + 1)}
                            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                        >
                            Next Step
                        </VLButton>
                    ) : (
                        <VLButton variant="primary" isLoading={isSubmitting} onClick={handleSubmit}>
                            Confirm & Add Agent
                        </VLButton>
                    )}
                </>
            ) : undefined}
        >
            {showSuccess ? renderSuccess() : (
                <>
                    <VLStepper steps={STEPS} currentStep={step} className="mb-10" />
                    <div className="mt-6">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>
                </>
            )}
        </VLModal>
    );
}
