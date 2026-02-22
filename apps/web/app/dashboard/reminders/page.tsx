"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Bell, Plus, CheckCircle, AlertCircle, Clock, Search, ChevronDown,
    Edit2, Trash2, X, Phone, Loader2
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreateReminderModal } from "@/components/reminders/CreateReminderModal";
import { INTELICONVOAPI } from "@/lib/axios";

interface Reminder {
    id: string;
    agent_id: string;
    title: string;
    description: string | null;
    contact_name: string | null;
    contact_phone: string | null;
    due_at: string;
    priority: string;
    status: string;
    created_at: string;
}

// ── Status pill ─────────────────────
function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "bg-[#F59E0B]",
        overdue: "bg-[#B01313]",
        completed: "bg-[#1DB013]",
        snoozed: "bg-[#6B7280]",
    };
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${map[status] ?? "bg-[#6B7280]"}`}>
            {status !== "snoozed" && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
            {label}
        </div>
    );
}

function PriorityPill({ priority }: { priority: string }) {
    const map: Record<string, string> = { high: "bg-[#B01313]", medium: "bg-[#1B4B8A]", low: "bg-[#6B7280]" };
    const label = priority.charAt(0).toUpperCase() + priority.slice(1);
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-white text-[10px] uppercase font-medium ${map[priority] ?? "bg-[#6B7280]"}`}>
            {label}
        </div>
    );
}

const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-[42px] border border-white/10 rounded-3xl shadow-sm ${className}`}>
        {children}
    </div>
);

const TABS = ["All", "Upcoming", "Overdue", "Completed", "Snoozed"] as const;

export default function RemindersPage() {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>("All");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReminders = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await INTELICONVOAPI.get("/reminders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReminders(res.data);
        } catch (e) {
            console.error("Failed to fetch reminders:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    // Refresh on modal close
    const handleModalClose = () => {
        setCreateOpen(false);
        fetchReminders();
    };

    const handleComplete = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await INTELICONVOAPI.patch(`/reminders/${id}`, { status: "completed" }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReminders();
        } catch (e) {
            console.error("Failed to complete reminder:", e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await INTELICONVOAPI.delete(`/reminders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReminders();
        } catch (e) {
            console.error("Failed to delete reminder:", e);
        }
    };

    const handleSnooze = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await INTELICONVOAPI.patch(`/reminders/${id}`, { status: "snoozed" }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReminders();
        } catch (e) {
            console.error("Failed to snooze reminder:", e);
        }
    };

    const formatDueDate = (iso: string) => {
        const d = new Date(iso);
        const today = new Date();
        const isToday = d.toDateString() === today.toDateString();
        if (isToday) return `Today, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };

    // Check if overdue
    const isOverdue = (r: Reminder) => r.status === "pending" && new Date(r.due_at) < new Date();

    const filtered = useMemo(() => reminders.filter(r => {
        const effectiveStatus = isOverdue(r) ? "overdue" : r.status;
        const matchTab = activeTab === "All"
            || (activeTab === "Upcoming" && effectiveStatus === "pending")
            || effectiveStatus === activeTab.toLowerCase();
        const matchSearch = !search || (r.contact_name || "").toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    }), [activeTab, search, reminders]);

    // Stats
    const dueToday = reminders.filter(r => {
        const d = new Date(r.due_at);
        return d.toDateString() === new Date().toDateString() && r.status === "pending";
    }).length;
    const overdueCount = reminders.filter(r => isOverdue(r)).length;
    const completedCount = reminders.filter(r => r.status === "completed").length;
    const snoozedCount = reminders.filter(r => r.status === "snoozed").length;

    const stats = [
        { icon: Clock, val: String(dueToday), label: "Due Today", pillBg: "bg-[#F59E0B]" },
        { icon: AlertCircle, val: String(overdueCount), label: "Overdue", pillBg: "bg-[#B01313]" },
        { icon: CheckCircle, val: String(completedCount), label: "Completed", pillBg: "bg-[#1DB013]" },
        { icon: Bell, val: String(snoozedCount), label: "Snoozed", pillBg: "bg-[#6B7280]" },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-5 h-full">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-[#0C335C] text-xl font-semibold">Reminders</h1>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FE641F] text-white text-sm font-medium hover:bg-[#e5581a] transition-colors shadow-[0_2px_8px_rgba(254,100,31,0.4)]"
                    >
                        <Plus size={16} /> Create Reminder
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {stats.map(s => {
                        const Icon = s.icon;
                        return (
                            <Glass key={s.label} className="p-5 flex items-center gap-4">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-xl font-bold ${s.pillBg}`}>
                                    {s.val}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{s.label}</p>
                                </div>
                            </Glass>
                        );
                    })}
                </div>

                {/* Table Card */}
                <Glass className="flex flex-col flex-1 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 pb-0 flex items-center gap-3">
                        <div className="flex items-center border-b border-black/10">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === tab
                                        ? "border-[#FE641F] text-[#FE641F]"
                                        : "border-transparent text-gray-400 hover:text-[#0C335C]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="ml-auto flex items-center gap-2 bg-black/5 border border-black/5 rounded-2xl px-4 py-2 min-w-[240px]">
                            <Search size={15} className="text-gray-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search reminders..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-[#111] placeholder:text-gray-500"
                            />
                            {search && <button onClick={() => setSearch("")}><X size={13} className="text-gray-400" /></button>}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-hidden flex flex-col mt-6 px-6 pb-4">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 size={28} className="animate-spin text-[#FE641F]" />
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm flex flex-col h-full overflow-hidden">
                                <thead className="flex shrink-0 w-full shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2">
                                    <tr className="flex w-full items-center">
                                        <th className="py-1 px-3 w-[40px] shrink-0 justify-center flex">
                                            <input type="checkbox" className="h-4 w-4 rounded accent-[#FE641F] cursor-pointer" />
                                        </th>
                                        {["Priority", "Contact", "Subject", "Due", "Status", "Actions"].map((h, i) => (
                                            <th key={h} className={`font-normal text-[#0C335C] py-1 px-3 ${i === 2 ? "flex-1" : "w-[130px] shrink-0"}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="flex-1 overflow-y-auto flex flex-col w-full pt-2">
                                    {filtered.length === 0 ? (
                                        <tr className="flex flex-1 items-center justify-center">
                                            <td className="text-gray-400 text-sm py-12">No reminders found.</td>
                                        </tr>
                                    ) : filtered.map((r, idx) => {
                                        const effectiveStatus = isOverdue(r) ? "overdue" : r.status;
                                        return (
                                            <React.Fragment key={r.id}>
                                                <tr
                                                    className={`flex w-full items-center ${idx % 2 !== 0 ? "bg-black/5" : ""} hover:bg-orange-50/50 transition-colors group rounded-2xl mb-1 shrink-0 cursor-pointer`}
                                                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                                                >
                                                    <td className="py-2 px-3 w-[40px] shrink-0 flex justify-center" onClick={e => e.stopPropagation()}>
                                                        <input type="checkbox" className="h-4 w-4 rounded accent-[#FE641F] cursor-pointer" />
                                                    </td>
                                                    <td className="py-2 px-3 w-[130px] shrink-0"><PriorityPill priority={r.priority} /></td>
                                                    <td className="py-2 px-3 w-[130px] shrink-0">
                                                        <p className="text-[#0C335C] font-medium text-xs truncate">{r.contact_name || "—"}</p>
                                                        <p className="text-gray-400 text-[10px] truncate">{r.contact_phone || ""}</p>
                                                    </td>
                                                    <td className="py-2 px-3 flex-1 text-[#0C335C] truncate text-sm">{r.title}</td>
                                                    <td className={`py-2 px-3 w-[130px] shrink-0 text-xs ${effectiveStatus === "overdue" ? "text-[#B01313] font-medium" : "text-gray-400"}`}>{formatDueDate(r.due_at)}</td>
                                                    <td className="py-2 px-3 w-[130px] shrink-0"><StatusPill status={effectiveStatus} /></td>
                                                    <td className="py-2 px-3 w-[130px] shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                        <button onClick={() => handleComplete(r.id)} className="p-1.5 rounded-xl hover:bg-[#1DB013]/10 text-gray-400 hover:text-[#1DB013] transition-colors" title="Complete"><CheckCircle size={14} /></button>
                                                        <button className="p-1.5 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#0C335C] transition-colors" title="Edit"><Edit2 size={14} /></button>
                                                        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-xl hover:bg-[#B01313]/10 text-gray-400 hover:text-[#B01313] transition-colors" title="Delete"><Trash2 size={14} /></button>
                                                    </td>
                                                </tr>
                                                {expanded === r.id && (
                                                    <tr className="shrink-0 mb-1">
                                                        <td className="block">
                                                            <div className="mx-2 mb-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-top-2 duration-200">
                                                                <div className={`w-1 rounded-full shrink-0 ${r.priority === "high" ? "bg-[#B01313]" : r.priority === "medium" ? "bg-[#1B4B8A]" : "bg-[#6B7280]"}`} />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-semibold text-[#0C335C] mb-2">{r.title}</p>
                                                                    {r.description && <p className="text-xs text-gray-400 mb-2">{r.description}</p>}
                                                                    {r.contact_phone && (
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Phone size={12} className="text-gray-400" />
                                                                            <span className="text-xs text-gray-400">{r.contact_phone}</span>
                                                                        </div>
                                                                    )}
                                                                    <span className="text-[10px] text-gray-400">Created {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <button onClick={() => handleComplete(r.id)} className="px-3 py-1.5 rounded-2xl bg-[#FE641F] text-white text-xs font-medium hover:bg-[#e5581a] transition-colors">Complete</button>
                                                                    <button onClick={() => handleSnooze(r.id)} className="px-3 py-1.5 rounded-2xl border border-[#CBCBCB] bg-white text-[#0C335C] text-xs font-medium hover:bg-gray-50 transition-colors">Snooze</button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Glass>
            </div>
            <CreateReminderModal isOpen={createOpen} onClose={handleModalClose} />
        </DashboardLayout>
    );
}
