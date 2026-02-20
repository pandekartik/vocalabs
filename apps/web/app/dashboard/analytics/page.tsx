"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Phone, Clock, Target, Star, Users, TrendingUp, TrendingDown,
    Minus, Download, ChevronDown, Activity
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ── Status pill (Team page pattern) ────────────────────
function TrendBadge({ change, up }: { change: string; up: boolean | null }) {
    const bg = up === null ? "bg-[#6B7280]" : up ? "bg-[#1DB013]" : "bg-[#B01313]";
    return (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${bg}`}>
            {up === null ? <Minus size={10} /> : up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {change}
        </div>
    );
}

// ── Glass card ──────────────────────────────────────────
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-[42px] border border-white/10 rounded-3xl shadow-sm ${className}`}>
        {children}
    </div>
);

// ── Sparkline ───────────────────────────────────────────
function Sparkline({ data, up }: { data: number[]; up: boolean | null }) {
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 26 - ((v - min) / (max - min || 1)) * 22;
        return `${x},${y}`;
    }).join(" ");
    const color = up === null ? "#9CA3AF" : up ? "#1DB013" : "#B01313";
    return (
        <svg viewBox="0 0 100 30" className="w-16 h-7" preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </svg>
    );
}

// ── Mini bar chart ──────────────────────────────────────
function MiniBarChart({ data }: { data: number[] }) {
    const max = Math.max(...data);
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
        <div className="flex items-end gap-1.5 h-40 mt-2">
            {data.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                    <div className="relative w-full">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0C335C] text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {v} calls
                        </div>
                        <div className="w-full bg-[#FE641F] rounded-t-lg transition-all hover:bg-[#e5581a]" style={{ height: `${(v / max) * 130}px` }} />
                    </div>
                    <span className="text-[9px] text-gray-500">{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

// ── Heatmap ─────────────────────────────────────────────
const HOURS = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HEAT = HOURS.map(() => DAYS.map(() => Math.floor(10 + Math.random() * 80)));

function Heatmap() {
    return (
        <div className="overflow-x-auto mt-2">
            <table className="w-full text-[10px]">
                <thead>
                    <tr>
                        <th className="text-left pr-3 py-1 text-gray-400 font-normal w-12">Hour</th>
                        {DAYS.map(d => <th key={d} className="text-center py-1 text-gray-400 font-normal">{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {HOURS.map((h, hi) => (
                        <tr key={h}>
                            <td className="pr-3 py-0.5 text-gray-400 whitespace-nowrap">{h}</td>
                            {DAYS.map((d, di) => {
                                const val = HEAT[hi]?.[di] ?? 0;
                                return (
                                    <td key={d} className="py-0.5 px-0.5">
                                        <div
                                            className="h-7 rounded-lg transition-all cursor-default group relative"
                                            style={{ background: `rgba(254,100,31,${0.05 + (val / 90) * 0.8})` }}
                                        >
                                            <div className="absolute hidden group-hover:block bg-[#0C335C] text-white text-[9px] px-1.5 py-0.5 rounded -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                                                {val} calls
                                            </div>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── KPIs ────────────────────────────────────────────────
const KPIS = [
    { label: "Total Calls", value: "1,247", change: "+12%", up: true as const, icon: Phone, spark: [40, 55, 48, 62, 58, 70, 65, 78, 72, 85] },
    { label: "Total Talk Time", value: "127h 45m", change: "+8%", up: true as const, icon: Clock, spark: [50, 45, 58, 52, 65, 60, 70, 68, 75, 72] },
    { label: "Avg Handle Time", value: "6m 12s", change: "-5%", up: false as const, icon: Activity, spark: [80, 75, 72, 70, 68, 65, 63, 62, 60, 58] },
    { label: "First Call Res.", value: "68%", change: "+3%", up: true as const, icon: Target, spark: [55, 57, 60, 62, 63, 65, 67, 67, 68, 68] },
    { label: "CSAT", value: "4.6/5", change: "0%", up: null, icon: Star, spark: [45, 46, 46, 45, 46, 47, 46, 46, 47, 46] },
    { label: "Agent Utilization", value: "84%", change: "+6%", up: true as const, icon: Users, spark: [65, 68, 72, 70, 75, 78, 80, 82, 84, 84] },
];

// ── Agents ──────────────────────────────────────────────
const AGENTS = [
    { rank: "🥇", name: "Sarah Johnson", av: "SJ", calls: 145, talk: "18h 23m", avg: "7m 36s", csat: 4.8, up: true },
    { rank: "🥈", name: "Mike Chen", av: "MC", calls: 132, talk: "16h 45m", avg: "7m 37s", csat: 4.6, up: null },
    { rank: "🥉", name: "John Doe", av: "JD", calls: 128, talk: "15h 12m", avg: "7m 07s", csat: 4.5, up: true },
    { rank: "#4", name: "Priya Sharma", av: "PS", calls: 118, talk: "14h 08m", avg: "7m 10s", csat: 4.3, up: false },
    { rank: "#5", name: "David Park", av: "DP", calls: 110, talk: "13h 30m", avg: "7m 21s", csat: 4.2, up: true },
];

export default function AnalyticsDashboardPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState("Last 7 Days");
    const weeklyData = [145, 132, 167, 148, 190, 62, 35];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-[#0C335C] text-xl font-semibold">Team Analytics</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#CBCBCB] rounded-2xl px-3 py-2 h-[40px] min-w-[150px] bg-white cursor-pointer hover:bg-gray-50">
                            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                                className="bg-transparent text-[#0C335C] text-sm w-full outline-none appearance-none cursor-pointer">
                                {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Custom"].map(o => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown size={14} className="text-[#0C335C] shrink-0" />
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#CBCBCB] bg-white text-[#0C335C] text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Download size={15} /> Export Report
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-4">
                    {KPIS.map(k => {
                        const Icon = k.icon;
                        return (
                            <Glass key={k.label} className="p-5 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center">
                                            <Icon size={16} className="text-[#0C335C]" />
                                        </div>
                                        <span className="text-xs text-gray-500">{k.label}</span>
                                    </div>
                                    <Sparkline data={k.spark} up={k.up} />
                                </div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-[#0C335C]">{k.value}</span>
                                    <TrendBadge change={k.change} up={k.up} />
                                </div>
                            </Glass>
                        );
                    })}
                </div>

                {/* Chart + Breakdowns */}
                <div className="grid grid-cols-3 gap-4">
                    <Glass className="col-span-2 p-6">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-[#0C335C] font-semibold">Calls by Day</h2>
                        </div>
                        <MiniBarChart data={weeklyData} />
                    </Glass>
                    <div className="flex flex-col gap-4">
                        <Glass className="p-5 flex-1">
                            <h3 className="text-sm font-semibold text-[#0C335C] mb-3">By Direction</h3>
                            {[{ l: "Inbound", n: 890, p: 71, c: "#1B4B8A" }, { l: "Outbound", n: 357, p: 29, c: "#FE641F" }].map(d => (
                                <div key={d.l} className="mb-3">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs text-gray-500">{d.l}</span>
                                        <span className="text-xs font-medium text-[#0C335C]">{d.n} ({d.p}%)</span>
                                    </div>
                                    <div className="h-2 bg-black/10 rounded-full"><div className="h-full rounded-full" style={{ width: `${d.p}%`, background: d.c }} /></div>
                                </div>
                            ))}
                        </Glass>
                        <Glass className="p-5 flex-1">
                            <h3 className="text-sm font-semibold text-[#0C335C] mb-3">By Outcome</h3>
                            {[
                                { l: "Completed", n: 1100, trend: true },
                                { l: "Missed", n: 87, trend: false },
                                { l: "Voicemail", n: 45, trend: null },
                                { l: "Abandoned", n: 15, trend: false },
                            ].map(o => (
                                <div key={o.l} className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">{o.l}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#0C335C] font-medium">{o.n}</span>
                                        {o.trend === null ? <Minus size={11} className="text-gray-400" /> : o.trend ? <TrendingUp size={11} className="text-[#1DB013]" /> : <TrendingDown size={11} className="text-[#B01313]" />}
                                    </div>
                                </div>
                            ))}
                        </Glass>
                    </div>
                </div>

                {/* Heatmap */}
                <Glass className="p-6">
                    <h2 className="text-[#0C335C] font-semibold">Calls by Hour</h2>
                    <Heatmap />
                </Glass>

                {/* Agent Table */}
                <Glass className="overflow-hidden">
                    <div className="px-6 py-5 flex items-center justify-between">
                        <h2 className="text-[#0C335C] font-semibold">Agent Performance</h2>
                        <button className="text-sm text-[#FE641F] font-medium hover:underline">View All →</button>
                    </div>
                    <div className="px-6 pb-6">
                        <table className="w-full text-sm text-left flex flex-col">
                            <thead className="flex w-full shadow-[0_1px_0_rgba(0,0,0,0.05)] pb-2 shrink-0">
                                <tr className="flex w-full">
                                    {["Rank", "Agent", "Calls", "Talk Time", "Avg Duration", "CSAT", "Trend"].map((h, i) => (
                                        <th key={h} className={`font-normal text-[#0C335C] py-1 px-3 ${i === 1 ? "flex-1" : "w-[110px] shrink-0"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="flex flex-col w-full pt-2">
                                {AGENTS.map((ag, idx) => (
                                    <tr
                                        key={ag.name}
                                        className={`flex w-full items-center ${idx % 2 !== 0 ? "bg-black/5" : ""} hover:bg-orange-50/50 transition-colors rounded-2xl mb-1 cursor-pointer`}
                                        onClick={() => router.push(`/test/analytics/${ag.name.toLowerCase().replace(/ /g, "-")}`)}
                                    >
                                        <td className="py-2 px-3 w-[110px] shrink-0 text-base">{ag.rank}</td>
                                        <td className="py-2 px-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-medium text-[#111]">{ag.av}</span>
                                                </div>
                                                <span className="font-medium text-[#0C335C]">{ag.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 w-[110px] shrink-0 font-medium text-[#0C335C]">{ag.calls}</td>
                                        <td className="py-2 px-3 w-[110px] shrink-0 text-gray-500">{ag.talk}</td>
                                        <td className="py-2 px-3 w-[110px] shrink-0 text-gray-500">{ag.avg}</td>
                                        <td className="py-2 px-3 w-[110px] shrink-0">
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < Math.floor(ag.csat) ? "bg-amber-400" : "bg-black/10"}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 w-[110px] shrink-0">
                                            {ag.up === null ? <Minus size={18} className="text-gray-400" /> : ag.up ? <TrendingUp size={18} className="text-[#1DB013]" /> : <TrendingDown size={18} className="text-[#B01313]" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Glass>
            </div>
        </DashboardLayout>
    );
}
