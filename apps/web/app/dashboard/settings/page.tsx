"use client";

import React, { useState } from "react";
import {
    User, Bell, Shield, Users, Briefcase, Clock, Phone,
    Voicemail, Mic, Plug, Code, Webhook, CreditCard,
    Activity, FileText, ChevronRight, Download, Plus,
    Save, Trash2, Edit2, Check
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ── Glass card ──────────────────────────────────────────
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-[42px] border border-white/10 rounded-3xl shadow-sm ${className}`}>
        {children}
    </div>
);

// ── Agent status pill (Team page pattern) ───────────────
function AgentStatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        Active: "bg-[#1DB013]",
        Inactive: "bg-[#6B7280]",
    };
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${map[status] ?? "bg-[#6B7280]"}`}>
            {status === "Active" && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-ping" />}
            {status === "Active" && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 -ml-2.5 relative" />}
            {status === "Inactive" && <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0 border border-white" />}
            {status}
        </div>
    );
}

// ── Sidebar nav ─────────────────────────────────────────
const SECTIONS = [
    {
        title: "Account", items: [
            { id: "profile", icon: User, label: "Profile" },
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "security", icon: Shield, label: "Security" },
        ]
    },
    {
        title: "Team", items: [
            { id: "agents", icon: Users, label: "Agents" },
            { id: "roles", icon: Briefcase, label: "Roles" },
            { id: "work-hours", icon: Clock, label: "Work Hours" },
        ]
    },
    {
        title: "Calls", items: [
            { id: "routing", icon: Phone, label: "Routing" },
            { id: "voicemail", icon: Voicemail, label: "Voicemail" },
            { id: "recording", icon: Mic, label: "Recording" },
        ]
    },
    {
        title: "Integrations", items: [
            { id: "crm", icon: Plug, label: "CRM" },
            { id: "api", icon: Code, label: "API" },
            { id: "webhooks", icon: Webhook, label: "Webhooks" },
        ]
    },
    {
        title: "Billing", items: [
            { id: "subscription", icon: CreditCard, label: "Subscription" },
            { id: "usage", icon: Activity, label: "Usage" },
            { id: "invoices", icon: FileText, label: "Invoices" },
        ]
    },
];

// ── Agents sub-page ─────────────────────────────────────
const AGENTS = [
    { name: "Sarah Johnson", email: "sarah.j@company.com", av: "SJ", role: "Inbound & Outbound", status: "Active" },
    { name: "Mike Chen", email: "mike.c@company.com", av: "MC", role: "Inbound Only", status: "Active" },
    { name: "John Doe", email: "john.d@company.com", av: "JD", role: "Inbound & Outbound", status: "Active" },
    { name: "Priya Sharma", email: "priya.s@company.com", av: "PS", role: "Outbound Only", status: "Inactive" },
    { name: "David Park", email: "david.p@company.com", av: "DP", role: "Inbound & Outbound", status: "Active" },
];

function AgentsSubpage() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[#0C335C] text-xl font-semibold">Agents</h2>
                    <p className="text-sm text-gray-500">Manage your team members and their access.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#CBCBCB] bg-white text-[#0C335C] text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download size={15} /> Export
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FE641F] text-white text-sm font-medium hover:bg-[#e5581a] transition-colors shadow-[0_2px_8px_rgba(254,100,31,0.4)]">
                        <Plus size={15} /> Add Agent
                    </button>
                </div>
            </div>

            {/* License usage */}
            <Glass className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-semibold text-[#0C335C]">License Usage</p>
                        <p className="text-xs text-gray-500">8 of 10 seats used</p>
                    </div>
                    <button className="text-sm text-[#FE641F] hover:underline font-medium">Add more seats →</button>
                </div>
                <div className="h-2.5 bg-black/10 rounded-full">
                    <div className="h-full bg-[#FE641F] rounded-full w-4/5 transition-all" />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">2 seats remaining</p>
            </Glass>

            {/* Agent table */}
            <Glass className="overflow-hidden">
                <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6 pt-4">
                    <table className="w-full text-left text-sm flex flex-col">
                        <thead className="flex w-full shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2 shrink-0">
                            <tr className="flex w-full">
                                {["Agent", "Email", "Role", "Status", ""].map((h, i) => (
                                    <th key={h + i} className={`font-normal text-[#0C335C] py-1 px-3 ${i === 0 || i === 2 ? "flex-1" : "w-[160px] shrink-0"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="flex flex-col w-full pt-2">
                            {AGENTS.map((a, idx) => (
                                <tr key={a.name} className={`flex w-full items-center ${idx % 2 !== 0 ? "bg-black/5" : ""} hover:bg-orange-50/50 transition-colors group rounded-2xl mb-1`}>
                                    <td className="py-2 px-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-medium text-[#111]">{a.av}</span>
                                            </div>
                                            <span className="font-medium text-[#0C335C]">{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3 w-[160px] shrink-0 text-gray-500 text-xs">{a.email}</td>
                                    <td className="py-2 px-3 flex-1 text-[#0C335C] text-sm">{a.role}</td>
                                    <td className="py-2 px-3 w-[160px] shrink-0">
                                        <AgentStatusPill status={a.status} />
                                    </td>
                                    <td className="py-2 px-3 w-[160px] shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#0C335C] transition-colors"><Edit2 size={14} /></button>
                                        <button className="p-1.5 rounded-xl hover:bg-[#B01313]/10 text-gray-400 hover:text-[#B01313] transition-colors"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Glass>
        </div>
    );
}

// ── Work Hours sub-page ──────────────────────────────────
const INITIAL_DAYS = [
    { day: "Monday", open: true, from: "09:00", to: "18:00" },
    { day: "Tuesday", open: true, from: "09:00", to: "18:00" },
    { day: "Wednesday", open: true, from: "09:00", to: "18:00" },
    { day: "Thursday", open: true, from: "09:00", to: "18:00" },
    { day: "Friday", open: true, from: "09:00", to: "17:00" },
    { day: "Saturday", open: false, from: "", to: "" },
    { day: "Sunday", open: false, from: "", to: "" },
];

function WorkHoursSubpage() {
    const [days, setDays] = useState(INITIAL_DAYS);
    const [afterHours, setAfterHours] = useState("Send to voicemail");
    const [overflowAction, setOverflow] = useState("Offer callback");
    const [maxQueue, setMaxQueue] = useState("10");
    const [maxWait, setMaxWait] = useState("5");
    const [saved, setSaved] = useState(false);

    const toggle = (i: number) => setDays(prev => prev.map((d, idx) => idx === i ? { ...d, open: !d.open } : d));
    const updateTime = (i: number, f: "from" | "to", v: string) =>
        setDays(prev => prev.map((d, idx) => idx === i ? { ...d, [f]: v } : d));

    const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[#0C335C] text-xl font-semibold">Work Hours</h2>
                    <p className="text-sm text-gray-500">Set when your team is available to receive calls.</p>
                </div>
                <button
                    onClick={save}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FE641F] text-white text-sm font-medium hover:bg-[#e5581a] transition-colors shadow-[0_2px_8px_rgba(254,100,31,0.4)]"
                >
                    {saved ? <Check size={15} /> : <Save size={15} />}
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* Business hours */}
            <Glass className="overflow-hidden">
                <div className="px-6 py-4 border-b border-black/5 font-semibold text-[#0C335C]">Business Hours</div>
                <div className="divide-y divide-black/5">
                    {days.map((d, i) => (
                        <div key={d.day} className="flex items-center gap-5 px-6 py-3.5">
                            <span className="w-28 text-sm font-medium text-[#0C335C]">{d.day}</span>
                            {/* Toggle switch */}
                            <button
                                onClick={() => toggle(i)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${d.open ? "bg-[#FE641F]" : "bg-black/20"}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${d.open ? "translate-x-5" : ""}`} />
                            </button>
                            {d.open ? (
                                <div className="flex items-center gap-2">
                                    <input type="time" value={d.from} onChange={e => updateTime(i, "from", e.target.value)}
                                        className="bg-white border border-[#CBCBCB] rounded-2xl px-3 py-1.5 text-sm text-[#0C335C] focus:outline-none focus:border-[#FE641F] cursor-pointer" />
                                    <span className="text-gray-400 text-xs">to</span>
                                    <input type="time" value={d.to} onChange={e => updateTime(i, "to", e.target.value)}
                                        className="bg-white border border-[#CBCBCB] rounded-2xl px-3 py-1.5 text-sm text-[#0C335C] focus:outline-none focus:border-[#FE641F] cursor-pointer" />
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium bg-[#1DB013]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                        Open
                                    </div>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium bg-[#6B7280]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0 border border-white" />
                                    Closed
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Glass>

            {/* After hours + Overflow */}
            <div className="grid grid-cols-2 gap-4">
                <Glass className="p-6">
                    <h3 className="text-sm font-semibold text-[#0C335C] mb-4">After Hours</h3>
                    <div className="flex gap-2">
                        {["Send to voicemail", "Forward to number"].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setAfterHours(opt)}
                                className={`flex-1 py-2.5 text-xs font-medium rounded-2xl border transition-all ${afterHours === opt
                                        ? "border-[#FE641F] bg-[#FE641F]/10 text-[#FE641F]"
                                        : "border-[#CBCBCB] bg-white text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </Glass>
                <Glass className="p-6">
                    <h3 className="text-sm font-semibold text-[#0C335C] mb-4">Queue & Overflow</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1.5">Max Queue</p>
                            <div className="flex items-center gap-1">
                                <input type="number" value={maxQueue} onChange={e => setMaxQueue(e.target.value)}
                                    className="w-16 text-center bg-white border border-[#CBCBCB] rounded-2xl px-2 py-1.5 text-sm text-[#0C335C] focus:outline-none" />
                                <span className="text-xs text-gray-400">calls</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1.5">Max Wait</p>
                            <div className="flex items-center gap-1">
                                <input type="number" value={maxWait} onChange={e => setMaxWait(e.target.value)}
                                    className="w-16 text-center bg-white border border-[#CBCBCB] rounded-2xl px-2 py-1.5 text-sm text-[#0C335C] focus:outline-none" />
                                <span className="text-xs text-gray-400">min</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1.5">Overflow</p>
                            {["Offer callback", "Voicemail"].map(o => (
                                <label key={o} className="flex items-center gap-1.5 cursor-pointer mb-1">
                                    <input type="radio" name="overflow" value={o} checked={overflowAction === o}
                                        onChange={() => setOverflow(o)} className="accent-[#FE641F]" />
                                    <span className="text-xs text-[#0C335C]">{o}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </Glass>
            </div>
        </div>
    );
}

function PlaceholderSubpage({ id }: { id: string }) {
    const label = SECTIONS.flatMap(s => s.items).find(i => i.id === id)?.label || id;
    return (
        <Glass className="p-12 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold text-[#0C335C] mb-2">{label} Settings</p>
            <p className="text-sm text-gray-400">Configure your {label.toLowerCase()} settings here.</p>
        </Glass>
    );
}

export default function SettingsPage() {
    const [active, setActive] = useState("agents");

    return (
        <DashboardLayout>
            <div className="flex gap-6">
                {/* Settings sidebar */}
                <aside className="w-52 shrink-0">
                    <Glass className="p-3 sticky top-0">
                        {SECTIONS.map((section, si) => (
                            <div key={section.title} className={si > 0 ? "mt-1 pt-1 border-t border-black/5" : ""}>
                                <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase px-3 py-2">{section.title}</p>
                                {section.items.map(item => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActive(item.id)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all text-sm font-medium mb-0.5 ${active === item.id
                                                    ? "bg-[#FE641F]/10 text-[#FE641F]"
                                                    : "text-gray-400 hover:bg-black/5 hover:text-[#0C335C]"
                                                }`}
                                        >
                                            <Icon size={14} className={active === item.id ? "text-[#FE641F]" : "opacity-70"} />
                                            {item.label}
                                            {active === item.id && <ChevronRight size={12} className="ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </Glass>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {active === "agents" ? <AgentsSubpage /> :
                        active === "work-hours" ? <WorkHoursSubpage /> :
                            <PlaceholderSubpage id={active} />}
                </div>
            </div>
        </DashboardLayout>
    );
}
