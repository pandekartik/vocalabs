"use client";

import React, { useState, useMemo } from "react";
import {
    Bell, Plus, CheckCircle, AlertCircle, Clock, Search, ChevronDown,
    Edit2, Trash2, X, Phone
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreateReminderModal } from "@/components/reminders/CreateReminderModal";

type ReminderStatus = "Pending" | "Overdue" | "Completed" | "Snoozed";
type ReminderPriority = "High" | "Normal" | "Low";

interface Reminder {
    id: string; contact: string; phone: string; subject: string;
    due: string; assignedTo: string; status: ReminderStatus; priority: ReminderPriority;
}

// ── Status pill: Team page pattern ─────────────────────
function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        Pending: "bg-[#F59E0B]",
        Overdue: "bg-[#B01313]",
        Completed: "bg-[#1DB013]",
        Snoozed: "bg-[#6B7280]",
    };
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${map[status] ?? "bg-[#6B7280]"}`}>
            {status !== "Snoozed" && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
            {status}
        </div>
    );
}

function PriorityPill({ priority }: { priority: string }) {
    const map: Record<string, string> = { High: "bg-[#B01313]", Normal: "bg-[#1B4B8A]", Low: "bg-[#6B7280]" };
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-white text-[10px] uppercase font-medium ${map[priority] ?? "bg-[#6B7280]"}`}>
            {priority}
        </div>
    );
}

const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-[42px] border border-white/10 rounded-3xl shadow-sm ${className}`}>
        {children}
    </div>
);

const MOCK: Reminder[] = [
    { id: "r1", contact: "Sarah Williams", phone: "+1 (555) 123-4567", subject: "Follow up on pricing", due: "Today, 3:00 PM", assignedTo: "Me", status: "Pending", priority: "High" },
    { id: "r2", contact: "Raj Patel", phone: "+91 98765 43210", subject: "Discuss technical integration", due: "Today, 4:30 PM", assignedTo: "Mike Chen", status: "Pending", priority: "Normal" },
    { id: "r3", contact: "Emma Johnson", phone: "+44 20 7946 0958", subject: "Contract renewal call", due: "Oct 14, 2:00 PM", assignedTo: "Me", status: "Overdue", priority: "High" },
    { id: "r4", contact: "Carlos Ruiz", phone: "+52 55 1234 5678", subject: "Enterprise plan demo", due: "Oct 15, 10:00 AM", assignedTo: "Sarah Johnson", status: "Completed", priority: "Normal" },
    { id: "r5", contact: "Thomas Baker", phone: "+1 (555) 222-3333", subject: "Check on onboarding progress", due: "Oct 16, 11:00 AM", assignedTo: "Me", status: "Pending", priority: "Low" },
    { id: "r6", contact: "Priya Sharma", phone: "+91 77777 88888", subject: "Account upgrade discussion", due: "Oct 17, 9:30 AM", assignedTo: "John Doe", status: "Snoozed", priority: "Normal" },
];

const TABS = ["All", "Upcoming", "Overdue", "Completed", "Snoozed"] as const;

export default function RemindersPage() {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>("All");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const filtered = useMemo(() => MOCK.filter(r => {
        const matchTab = activeTab === "All"
            || (activeTab === "Upcoming" && r.status === "Pending")
            || r.status === activeTab;
        const matchSearch = !search || r.contact.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    }), [activeTab, search]);

    const stats = [
        { icon: Clock, val: "8", label: "Due Today", pillBg: "bg-[#F59E0B]" },
        { icon: AlertCircle, val: "3", label: "Overdue", pillBg: "bg-[#B01313]" },
        { icon: CheckCircle, val: "12", label: "Completed This Week", pillBg: "bg-[#1DB013]" },
        { icon: Bell, val: "2", label: "Snoozed", pillBg: "bg-[#6B7280]" },
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
                        <table className="w-full text-left text-sm flex flex-col h-full overflow-hidden">
                            <thead className="flex shrink-0 w-full shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2">
                                <tr className="flex w-full items-center">
                                    <th className="py-1 px-3 w-[40px] shrink-0 justify-center flex">
                                        <input type="checkbox" className="h-4 w-4 rounded accent-[#FE641F] cursor-pointer" />
                                    </th>
                                    {["Priority", "Contact", "Subject", "Due", "Assigned", "Status", "Actions"].map((h, i) => (
                                        <th key={h} className={`font-normal text-[#0C335C] py-1 px-3 ${i === 2 ? "flex-1" : "w-[130px] shrink-0"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="flex-1 overflow-y-auto flex flex-col w-full pt-2">
                                {filtered.length === 0 ? (
                                    <tr className="flex flex-1 items-center justify-center">
                                        <td className="text-gray-400 text-sm py-12">No reminders found.</td>
                                    </tr>
                                ) : filtered.map((r, idx) => (
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
                                                <p className="text-[#0C335C] font-medium text-xs truncate">{r.contact}</p>
                                                <p className="text-gray-400 text-[10px] truncate">{r.phone}</p>
                                            </td>
                                            <td className="py-2 px-3 flex-1 text-[#0C335C] truncate text-sm">{r.subject}</td>
                                            <td className={`py-2 px-3 w-[130px] shrink-0 text-xs ${r.status === "Overdue" ? "text-[#B01313] font-medium" : "text-gray-400"}`}>{r.due}</td>
                                            <td className="py-2 px-3 w-[130px] shrink-0 text-xs text-gray-500">{r.assignedTo}</td>
                                            <td className="py-2 px-3 w-[130px] shrink-0"><StatusPill status={r.status} /></td>
                                            <td className="py-2 px-3 w-[130px] shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                <button className="p-1.5 rounded-xl hover:bg-[#1DB013]/10 text-gray-400 hover:text-[#1DB013] transition-colors"><CheckCircle size={14} /></button>
                                                <button className="p-1.5 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#0C335C] transition-colors"><Edit2 size={14} /></button>
                                                <button className="p-1.5 rounded-xl hover:bg-[#B01313]/10 text-gray-400 hover:text-[#B01313] transition-colors"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                        {expanded === r.id && (
                                            <tr className="shrink-0 mb-1">
                                                <td className="block">
                                                    <div className="mx-2 mb-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-top-2 duration-200">
                                                        <div className={`w-1 rounded-full shrink-0 ${r.priority === "High" ? "bg-[#B01313]" : r.priority === "Normal" ? "bg-[#1B4B8A]" : "bg-[#6B7280]"}`} />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-[#0C335C] mb-2">{r.subject}</p>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Phone size={12} className="text-gray-400" />
                                                                <span className="text-xs text-gray-400">{r.phone}</span>
                                                                <button className="text-xs text-[#FE641F] hover:underline ml-1">Quick Call →</button>
                                                            </div>
                                                            <p className="text-xs text-gray-400">Customer interested in enterprise plan. Discuss pricing and onboarding timeline.</p>
                                                            <div className="flex gap-4 mt-2">
                                                                <span className="text-[10px] text-gray-400">Created Oct 10 by You</span>
                                                                <span className="text-[10px] text-gray-400">Snoozed once (Oct 12)</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <button className="px-3 py-1.5 rounded-2xl bg-[#FE641F] text-white text-xs font-medium hover:bg-[#e5581a] transition-colors">Complete</button>
                                                            <button className="px-3 py-1.5 rounded-2xl border border-[#CBCBCB] bg-white text-[#0C335C] text-xs font-medium hover:bg-gray-50 transition-colors">Snooze</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Glass>
            </div>
            <CreateReminderModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
        </DashboardLayout>
    );
}
