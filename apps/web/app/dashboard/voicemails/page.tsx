"use client";

import React, { useState, useMemo } from "react";
import {
    Search, Download, Play, UserPlus, MoreHorizontal,
    ChevronDown, Phone, Clock, CheckCircle, AlertTriangle,
    LayoutGrid, List, Filter, X, Volume2
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { VoicemailPlayerModal } from "@/components/voicemails/VoicemailPlayerModal";
import { AssignVoicemailModal } from "@/components/voicemails/AssignVoicemailModal";

// ── Status pill: exactly the Team page pattern ─────────
function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        Unheard: "bg-[#B01313]",
        Heard: "bg-[#F59E0B]",
        Assigned: "bg-[#1B4B8A]",
        Resolved: "bg-[#1DB013]",
    };
    const bg = map[status] ?? "bg-[#6B7280]";
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${bg}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            {status}
        </div>
    );
}

function PriorityPill({ priority }: { priority: string }) {
    const map: Record<string, string> = {
        High: "bg-[#B01313]",
        Normal: "bg-[#1B4B8A]",
        Low: "bg-[#6B7280]",
    };
    const bg = map[priority] ?? "bg-[#6B7280]";
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${bg}`}>
            {priority}
        </div>
    );
}

// ── Glass wrapper ──────────────────────────────────────
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-[42px] border border-white/10 rounded-3xl shadow-sm ${className}`}>
        {children}
    </div>
);

// ── Mock data ──────────────────────────────────────────
const VOICEMAILS = [
    { id: "v1", caller: "John Smith", phone: "+1-555-0123", duration: 154, transcript: "Hi, this is about my order renewal. I had a question about the pricing plan...", received: "10 min ago", assignedTo: "Sarah J.", status: "Unheard", priority: "High" },
    { id: "v2", caller: "+1-555-0456", phone: "+1-555-0456", duration: 87, transcript: "Calling to follow up on the demo we scheduled last Tuesday...", received: "32 min ago", assignedTo: "—", status: "Heard", priority: "Normal" },
    { id: "v3", caller: "Priya Sharma", phone: "+91-98765", duration: 213, transcript: "I need help with the integration, the API is returning a 503 error...", received: "1 hour ago", assignedTo: "—", status: "Unheard", priority: "High" },
    { id: "v4", caller: "Carlos Ruiz", phone: "+52-55-1234", duration: 45, transcript: "Just wanted to let you know I accepted the proposal...", received: "2 hours ago", assignedTo: "Mike C.", status: "Resolved", priority: "Low" },
    { id: "v5", caller: "+44-20-7946", phone: "+44-20-7946", duration: 178, transcript: "We're interested in upgrading to the enterprise tier for our team of 50...", received: "3 hours ago", assignedTo: "—", status: "Assigned", priority: "High" },
    { id: "v6", caller: "Thomas Baker", phone: "+1-555-0789", duration: 62, transcript: "Quick question about billing — I think there's a duplicate charge...", received: "4 hours ago", assignedTo: "—", status: "Unheard", priority: "Normal" },
];

function formatDuration(secs: number) {
    return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;
}

export default function VoicemailQueuePage() {
    const [view, setView] = useState<"table" | "card">("table");
    const [search, setSearch] = useState("");
    const [statusF, setStatusF] = useState("All");
    const [assignedF, setAssignedF] = useState("All");
    const [priorityF, setPriorityF] = useState("All");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [playerVM, setPlayerVM] = useState<typeof VOICEMAILS[0] | null>(null);
    const [assignVM, setAssignVM] = useState<typeof VOICEMAILS[0] | null>(null);

    const filtered = useMemo(() => VOICEMAILS.filter(v => {
        const matchSearch = !search || v.caller.toLowerCase().includes(search.toLowerCase()) || v.phone.includes(search);
        const matchStatus = statusF === "All" || v.status === statusF;
        const matchAssigned = assignedF === "All" || (assignedF === "Unassigned" ? v.assignedTo === "—" : v.assignedTo !== "—");
        const matchPriority = priorityF === "All" || v.priority === priorityF;
        return matchSearch && matchStatus && matchAssigned && matchPriority;
    }), [search, statusF, assignedF, priorityF]);

    const toggleSelect = (id: string) => {
        const n = new Set(selected);
        n.has(id) ? n.delete(id) : n.add(id);
        setSelected(n);
    };
    const allSelected = filtered.length > 0 && filtered.every(v => selected.has(v.id));
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(v => v.id)));

    const stats = [
        { icon: "🔴", val: VOICEMAILS.filter(v => v.status === "Unheard").length, label: "Unheard", color: "text-red-600" },
        { icon: "👤", val: VOICEMAILS.filter(v => v.assignedTo !== "—").length, label: "Assigned to Me", color: "text-blue-700" },
        { icon: "⚠️", val: VOICEMAILS.filter(v => v.assignedTo === "—").length, label: "Unassigned", color: "text-amber-600" },
        { icon: "✅", val: VOICEMAILS.filter(v => v.status === "Resolved").length, label: "Resolved Today", color: "text-green-700" },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-5 h-full">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[#0C335C] text-xl font-semibold">Voicemail Queue</h1>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium bg-[#B01313]">
                            <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" />
                            12 New
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#CBCBCB] bg-white text-[#0C335C] text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Download size={15} /> Export
                        </button>
                        <button
                            disabled={selected.size === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#CBCBCB] text-[#0C335C] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Mark as Resolved
                        </button>
                        <button
                            disabled={selected.size === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FE641F] text-white text-sm font-medium hover:bg-[#e5581a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(254,100,31,0.4)]"
                        >
                            <UserPlus size={15} /> Assign Selected
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-4 gap-4">
                    {stats.map(s => (
                        <Glass key={s.label} className="p-5 flex items-center gap-4">
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                                <p className="text-xs text-gray-500">{s.label}</p>
                            </div>
                        </Glass>
                    ))}
                </div>

                {/* ── Main Table Card ── */}
                <Glass className="flex flex-col flex-1 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 pb-0 flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-black/5 border border-black/5 rounded-2xl px-4 py-3">
                            <Search size={16} className="text-gray-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by caller, number, or transcript..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-[#111] placeholder:text-gray-500"
                            />
                            {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-400" /></button>}
                        </div>
                        {[
                            { label: "Status", val: statusF, set: setStatusF, opts: ["All", "Unheard", "Heard", "Assigned", "Resolved"] },
                            { label: "Assigned", val: assignedF, set: setAssignedF, opts: ["All", "Me", "Unassigned"] },
                            { label: "Priority", val: priorityF, set: setPriorityF, opts: ["All", "High", "Normal", "Low"] },
                        ].map(f => (
                            <div key={f.label} className="flex items-center border border-[#CBCBCB] rounded-2xl px-3 py-2 h-[44px] min-w-[130px] bg-white cursor-pointer hover:bg-gray-50">
                                <select
                                    value={f.val}
                                    onChange={e => f.set(e.target.value)}
                                    className="bg-transparent text-[#0C335C] text-sm w-full outline-none appearance-none cursor-pointer"
                                >
                                    {f.opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                                <ChevronDown size={14} className="text-[#0C335C] shrink-0" />
                            </div>
                        ))}
                        {/* View toggle */}
                        <div className="flex items-center gap-1 bg-black/5 rounded-2xl p-1">
                            <button onClick={() => setView("table")} className={`p-2 rounded-xl transition-all ${view === "table" ? "bg-white shadow-sm text-[#FE641F]" : "text-gray-500"}`}><List size={16} /></button>
                            <button onClick={() => setView("card")} className={`p-2 rounded-xl transition-all ${view === "card" ? "bg-white shadow-sm text-[#FE641F]" : "text-gray-500"}`}><LayoutGrid size={16} /></button>
                        </div>
                    </div>

                    {/* Bulk action bar */}
                    {selected.size > 0 && (
                        <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-[#FE641F]/10 border border-[#FE641F]/20 rounded-2xl">
                            <span className="text-sm font-medium text-[#FE641F]">{selected.size} selected</span>
                            <div className="w-px h-4 bg-[#FE641F]/30" />
                            {["Assign to Agent", "Mark as Heard", "Mark as Resolved"].map(a => (
                                <button key={a} className="text-sm text-[#0C335C] font-medium hover:text-[#FE641F] transition-colors">{a}</button>
                            ))}
                            <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"><X size={12} /> Clear</button>
                        </div>
                    )}

                    {view === "table" ? (
                        /* ── Table ── */
                        <div className="flex-1 overflow-hidden flex flex-col mt-6 px-6 pb-4">
                            <table className="w-full text-left text-sm flex flex-col h-full overflow-hidden">
                                <thead className="flex shrink-0 w-full shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2">
                                    <tr className="flex w-full items-center">
                                        <th className="py-1 px-3 w-[40px] shrink-0 flex justify-center">
                                            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded accent-[#FE641F] cursor-pointer" />
                                        </th>
                                        {["Status", "Caller", "Phone", "Duration", "Transcript", "Received", "Assigned To", "Priority", "Actions"].map((h, i) => (
                                            <th key={h} className={`font-normal text-[#0C335C] py-1 px-3 ${i === 4 ? "flex-1" : i >= 5 ? "w-[130px] shrink-0" : "w-[110px] shrink-0"}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="flex-1 overflow-y-auto flex flex-col w-full pt-2">
                                    {filtered.length === 0 ? (
                                        <tr className="flex flex-1 items-center justify-center">
                                            <td className="text-gray-400 text-sm py-12">No voicemails match your filters.</td>
                                        </tr>
                                    ) : filtered.map((vm, idx) => {
                                        const isSelected = selected.has(vm.id);
                                        const rowBg = isSelected ? "bg-orange-50" : idx % 2 === 0 ? "bg-transparent" : "bg-black/5";
                                        return (
                                            <tr key={vm.id} className={`flex w-full items-center ${rowBg} hover:bg-orange-50/50 transition-colors group rounded-2xl mb-1 shrink-0`}>
                                                <td className="py-2 px-3 w-[40px] shrink-0 flex justify-center">
                                                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(vm.id)} className="h-4 w-4 rounded accent-[#FE641F] cursor-pointer" />
                                                </td>
                                                <td className="py-2 px-3 w-[110px] shrink-0"><StatusPill status={vm.status} /></td>
                                                <td className="py-2 px-3 w-[110px] shrink-0 text-[#0C335C] font-medium truncate">{vm.caller}</td>
                                                <td className="py-2 px-3 w-[110px] shrink-0 text-gray-500 text-xs">{vm.phone}</td>
                                                <td className="py-2 px-3 w-[110px] shrink-0 text-gray-500">{formatDuration(vm.duration)}</td>
                                                <td className="py-2 px-3 flex-1 text-gray-500 text-xs truncate">{vm.transcript}</td>
                                                <td className="py-2 px-3 w-[130px] shrink-0 text-gray-400 text-xs">{vm.received}</td>
                                                <td className="py-2 px-3 w-[130px] shrink-0 text-gray-500 text-xs">{vm.assignedTo}</td>
                                                <td className="py-2 px-3 w-[130px] shrink-0"><PriorityPill priority={vm.priority} /></td>
                                                <td className="py-2 px-3 w-[130px] shrink-0 flex items-center gap-1">
                                                    <button onClick={() => setPlayerVM(vm)} className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#FE641F] transition-colors"><Play size={14} /></button>
                                                    <button onClick={() => setAssignVM(vm)} className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#0C335C] transition-colors"><UserPlus size={14} /></button>
                                                    <button className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#0C335C] transition-colors"><MoreHorizontal size={14} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* ── Card View ── */
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
                            {filtered.map(vm => (
                                <div key={vm.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <StatusPill status={vm.status} />
                                            <p className="text-[#0C335C] font-semibold mt-2">{vm.caller}</p>
                                            <p className="text-xs text-gray-400">{vm.received}</p>
                                        </div>
                                        <PriorityPill priority={vm.priority} />
                                    </div>
                                    {/* Waveform visualizer */}
                                    <div className="flex items-center gap-0.5 h-8">
                                        {Array.from({ length: 40 }, (_, i) => (
                                            <div key={i} className="w-1 bg-gray-200 rounded-full" style={{ height: `${8 + Math.sin(i * 0.8) * 10 + Math.random() * 10}px` }} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2">{vm.transcript}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{formatDuration(vm.duration)} • {vm.phone}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => setPlayerVM(vm)} className="p-1.5 rounded-xl bg-[#FE641F]/10 text-[#FE641F] hover:bg-[#FE641F] hover:text-white transition-colors"><Play size={13} /></button>
                                            <button onClick={() => setAssignVM(vm)} className="p-1.5 rounded-xl bg-black/5 text-gray-500 hover:bg-[#0C335C] hover:text-white transition-colors"><UserPlus size={13} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Glass>
            </div>

            {playerVM && (
                <VoicemailPlayerModal
                    isOpen={true}
                    onClose={() => setPlayerVM(null)}
                    voicemail={{ id: playerVM.id, callerName: playerVM.caller, callerPhone: playerVM.phone, durationSecs: playerVM.duration, transcript: playerVM.transcript, receivedAt: playerVM.received, status: playerVM.status, priority: playerVM.priority }}
                    onAssign={() => { setAssignVM(playerVM); setPlayerVM(null); }}
                />
            )}
            {assignVM && (
                <AssignVoicemailModal
                    isOpen={true}
                    onClose={() => setAssignVM(null)}
                    voicemail={{ callerName: assignVM.caller, callerPhone: assignVM.phone, durationSecs: assignVM.duration }}
                />
            )}
        </DashboardLayout>
    );
}
