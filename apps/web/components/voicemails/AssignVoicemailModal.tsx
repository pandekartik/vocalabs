"use client";

import React, { useState } from "react";
import { Search, Clock, CheckCircle } from "lucide-react";
import { VLModal, VLButton, VLToggle } from "@/components/ui/vl";
import { cn } from "@repo/ui/lib/utils";

interface Voicemail {
    callerName: string | null;
    callerPhone: string;
    durationSecs: number;
}

interface AssignVoicemailModalProps {
    isOpen: boolean;
    onClose: () => void;
    voicemail: Voicemail;
}

const AGENTS = [
    { id: "a1", name: "Sarah Johnson", avatar: "SJ", role: "Inbound & Outbound", load: 8, lastActive: "2 min ago", available: true },
    { id: "a2", name: "Mike Chen", avatar: "MC", role: "Inbound Only", load: 5, lastActive: "5 min ago", available: true },
    { id: "a3", name: "John Doe", avatar: "JD", role: "Inbound & Outbound", load: 12, lastActive: "12 min ago", available: false },
    { id: "a4", name: "Priya Sharma", avatar: "PS", role: "Outbound Only", load: 3, lastActive: "1 min ago", available: true },
    { id: "a5", name: "David Park", avatar: "DP", role: "Inbound & Outbound", load: 7, lastActive: "Just now", available: true },
];

function formatDuration(secs: number) {
    return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;
}

export function AssignVoicemailModal({ isOpen, onClose, voicemail }: AssignVoicemailModalProps) {
    const [search, setSearch] = useState("");
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [priority, setPriority] = useState("Normal");
    const [notes, setNotes] = useState("");
    const [notify, setNotify] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [success, setSuccess] = useState(false);

    const filtered = AGENTS.filter(a =>
        !search || a.name.toLowerCase().includes(search.toLowerCase())
    );

    const selected = AGENTS.find(a => a.id === selectedAgent);

    const handleAssign = () => {
        if (!selectedAgent) return;
        setIsAssigning(true);
        setTimeout(() => { setIsAssigning(false); setSuccess(true); setTimeout(() => { setSuccess(false); onClose(); }, 1500); }, 800);
    };

    return (
        <VLModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            title="Assign Voicemail"
            subtitle={`From: ${voicemail.callerName || voicemail.callerPhone} (${formatDuration(voicemail.durationSecs)})`}
            footer={
                <>
                    <VLButton variant="ghost" onClick={onClose} disabled={isAssigning}>Cancel</VLButton>
                    <VLButton
                        variant="primary"
                        isLoading={isAssigning}
                        disabled={!selectedAgent}
                        onClick={handleAssign}
                    >
                        {selected ? `Assign to ${selected.name}` : "Select an agent"}
                    </VLButton>
                </>
            }
        >
            {success ? (
                <div className="flex flex-col items-center py-10 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="text-live" />
                    </div>
                    <p className="text-vl-lg font-bold text-navy">Voicemail Assigned!</p>
                    <p className="text-vl-sm text-vl-gray-3 mt-1">
                        {selected?.name} has been notified.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {/* Agent search */}
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vl-gray-3" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm pl-9 pr-4 py-2 text-vl-sm placeholder:text-vl-gray-3 focus:outline-none focus:border-brand"
                        />
                    </div>

                    {/* Agent list */}
                    <div className="flex flex-col gap-2 max-h-52 overflow-y-auto -mx-1 px-1">
                        {filtered.map(agent => (
                            <label
                                key={agent.id}
                                className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-md border cursor-pointer transition-all",
                                    !agent.available && "opacity-50 cursor-not-allowed",
                                    selectedAgent === agent.id
                                        ? "border-brand bg-brand/5"
                                        : "border-vl-gray-4 bg-white hover:border-vl-gray-2 hover:bg-vl-gray-1"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="agent"
                                    value={agent.id}
                                    checked={selectedAgent === agent.id}
                                    onChange={() => agent.available && setSelectedAgent(agent.id)}
                                    className="accent-brand"
                                    disabled={!agent.available}
                                />
                                <div className="w-9 h-9 bg-navy text-white rounded-full flex items-center justify-center text-vl-xs font-bold shrink-0">
                                    {agent.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-vl-sm font-medium text-navy">{agent.name}</p>
                                        {!agent.available && (
                                            <span className="text-vl-caps text-danger font-medium">BUSY</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-vl-xs text-vl-gray-3">{agent.load} active tasks</span>
                                        <span className="text-vl-xs text-vl-gray-3 flex items-center gap-1"><Clock size={10} /> {agent.lastActive}</span>
                                    </div>
                                </div>
                                {/* Load indicator */}
                                <div className="w-16 h-1.5 bg-vl-gray-2 rounded-full shrink-0">
                                    <div
                                        className={cn("h-full rounded-full", agent.load > 10 ? "bg-danger" : agent.load > 6 ? "bg-warning" : "bg-live")}
                                        style={{ width: `${(agent.load / 15) * 100}%` }}
                                    />
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="h-px bg-vl-gray-4" />

                    {/* Priority */}
                    <div>
                        <p className="text-vl-sm font-medium text-navy mb-2">Priority</p>
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
                                                    : "bg-vl-gray-1 border-vl-gray-2 text-vl-gray-3"
                                            : "bg-white border-vl-gray-2 text-vl-gray-3 hover:bg-vl-gray-1"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <p className="text-vl-sm font-medium text-navy mb-2">Instructions for agent</p>
                        <textarea
                            placeholder="Add context or specific instructions..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            className="w-full bg-vl-gray-1 border border-vl-gray-2 rounded-sm px-3.5 py-2.5 text-vl-sm placeholder:text-vl-gray-3 focus:outline-none focus:border-brand resize-none"
                        />
                    </div>

                    {/* Notify toggle */}
                    <VLToggle
                        checked={notify}
                        onChange={setNotify}
                        label="Send email notification"
                        description="Agent will receive an email about this assignment"
                    />
                </div>
            )}
        </VLModal>
    );
}
