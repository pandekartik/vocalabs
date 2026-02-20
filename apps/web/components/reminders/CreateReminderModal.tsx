"use client";

import React, { useState } from "react";
import { Search, CheckCircle, ChevronDown } from "lucide-react";
import { VLModal, VLButton, VLToggle } from "@/components/ui/vl";
import { cn } from "@repo/ui/lib/utils";

interface CreateReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    edit?: boolean;
}

const AGENTS = ["Me", "Sarah Johnson", "Mike Chen", "John Doe", "Priya Sharma"];
const NOTIFY_BEFORE = ["5 min before", "15 min before", "30 min before", "1 hour before", "1 day before"];

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
    <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full appearance-none bg-vl-gray-1 border border-vl-gray-2 rounded-sm px-3.5 py-2.5 pr-8 text-vl-sm text-navy focus:outline-none focus:border-brand cursor-pointer"
        >
            {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-vl-gray-3 pointer-events-none" />
    </div>
);

const InputField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
        <label className="text-vl-sm font-medium text-navy mb-1.5 block">
            {label}{required && <span className="text-danger ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

export function CreateReminderModal({ isOpen, onClose, edit }: CreateReminderModalProps) {
    const [contact, setContact] = useState("");
    const [subject, setSubject] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("09:00");
    const [priority, setPriority] = useState("Normal");
    const [notes, setNotes] = useState("");
    const [assignTo, setAssignTo] = useState("Me");
    const [notifyBefore, setNotifyBefore] = useState("15 min before");
    const [sendEmail, setSendEmail] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const isValid = contact.trim() && subject.trim() && dueDate;

    const handleSave = () => {
        if (!isValid) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 1500);
        }, 700);
    };

    return (
        <VLModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            title={edit ? "Edit Reminder" : "Create Reminder"}
            footer={
                <>
                    <VLButton variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</VLButton>
                    <VLButton variant="primary" isLoading={isSubmitting} disabled={!isValid} onClick={handleSave}>
                        Save Reminder
                    </VLButton>
                </>
            }
        >
            {success ? (
                <div className="flex flex-col items-center py-10 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="text-live" />
                    </div>
                    <p className="text-vl-lg font-bold text-navy">Reminder Saved!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <InputField label="Contact" required>
                        <div className="relative">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vl-gray-3" />
                            <input
                                type="text"
                                placeholder="Search contact by name or phone..."
                                value={contact}
                                onChange={e => setContact(e.target.value)}
                                className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm pl-9 pr-4 py-2.5 text-vl-sm placeholder:text-vl-gray-3 focus:outline-none focus:border-brand"
                            />
                        </div>
                    </InputField>

                    <InputField label="Subject" required>
                        <input
                            type="text"
                            placeholder="e.g. Follow up on pricing"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm px-3.5 py-2.5 text-vl-sm placeholder:text-vl-gray-3 focus:outline-none focus:border-brand"
                        />
                    </InputField>

                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Due Date" required>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm px-3.5 py-2.5 text-vl-sm text-navy focus:outline-none focus:border-brand cursor-pointer"
                            />
                        </InputField>
                        <InputField label="Due Time" required>
                            <input
                                type="time"
                                value={dueTime}
                                onChange={e => setDueTime(e.target.value)}
                                className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm px-3.5 py-2.5 text-vl-sm text-navy focus:outline-none focus:border-brand cursor-pointer"
                            />
                        </InputField>
                    </div>

                    <InputField label="Priority" required>
                        <div className="flex gap-2">
                            {["High", "Normal", "Low"].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={cn(
                                        "flex-1 py-2 text-vl-xs font-medium rounded-sm border transition-all",
                                        priority === p
                                            ? p === "High" ? "bg-red-50 border-danger text-danger"
                                                : p === "Normal" ? "bg-blue-50 border-info text-info"
                                                    : "bg-vl-gray-1 border-vl-gray-2 text-navy"
                                            : "bg-white border-vl-gray-2 text-vl-gray-3 hover:bg-vl-gray-1"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </InputField>

                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Assign To" required>
                            <Select value={assignTo} onChange={setAssignTo} options={AGENTS} />
                        </InputField>
                        <InputField label="Notify Before">
                            <Select value={notifyBefore} onChange={setNotifyBefore} options={NOTIFY_BEFORE} />
                        </InputField>
                    </div>

                    <InputField label="Notes">
                        <textarea
                            placeholder="Additional context or instructions..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm px-3.5 py-2.5 text-vl-sm placeholder:text-vl-gray-3 focus:outline-none focus:border-brand resize-none"
                        />
                    </InputField>

                    <VLToggle
                        checked={sendEmail}
                        onChange={setSendEmail}
                        label="Send email notification"
                        description="Assignee will receive an email reminder"
                    />
                </div>
            )}
        </VLModal>
    );
}
