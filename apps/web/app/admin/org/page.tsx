"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Bell } from "lucide-react";

export default function OrgDashboard() {
    const stats = [
        { label: "Total Users", value: "12", change: "+2 this week", action: "Manage", color: "text-[#0C335C]" },
        { label: "Supervisors", value: "3", change: "No change", action: "View", color: "text-blue-600" },
        { label: "Agents", value: "8", change: "+2 this week", action: "View", color: "text-gray-700" },
        { label: "Active Calls", value: "5", change: "Live now", action: "Monitor", color: "text-[#FE641F]" },
        { label: "Today's Calls", value: "47", change: "↑ 12%", action: "View details", color: "text-[#0C335C]" },
        { label: "Avg Handle Time", value: "5m 23s", change: "↓ 8%", action: "Analyze", color: "text-green-600" },
    ];
    const health = [
        { name: "Call Connectivity", status: "Operational", ok: true },
        { name: "AI Transcription", status: "Operational", ok: true },
        { name: "Recording Storage", status: "87% full", ok: false },
        { name: "User Authentication", status: "Operational", ok: true },
    ];
    const activity = [
        { time: "2:34 PM", user: "Sarah Johnson (Supervisor)", action: "Added agent: Mike Chen" },
        { time: "2:15 PM", user: "John Doe (Agent)", action: "Completed call: +1-555-0456" },
        { time: "1:48 PM", user: "System", action: "Daily usage report generated" },
        { time: "1:20 PM", user: "Priya Sharma (Agent)", action: "Logged in" },
    ];
    const actionItems = [
        { priority: "High", icon: "🔴", item: "Recording storage at 87%", action: "Upgrade storage" },
        { priority: "Medium", icon: "🟡", item: "2 agents haven't logged in this week", action: "Send reminder" },
        { priority: "Low", icon: "🟢", item: "New feature: Advanced tags available", action: "Learn more" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Organization Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your organization's activity and status.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <Card key={s.label} className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{s.change}</p>
                            </div>
                            <button className="text-xs text-[#FE641F] font-medium hover:underline">{s.action}</button>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> System Health</h4>
                    <div className="flex flex-col gap-2">
                        {health.map(h => (
                            <div key={h.name} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-none">
                                <span className="text-gray-600">{h.name}</span>
                                <div className="flex items-center gap-2">
                                    {h.ok ? <CheckCircle2 size={13} className="text-green-500" /> : <AlertTriangle size={13} className="text-amber-500" />}
                                    <span className={h.ok ? "text-green-700" : "text-amber-700"}>{h.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><Bell size={14} /> Action Items</h4>
                    <div className="flex flex-col gap-2">
                        {actionItems.map(a => (
                            <div key={a.item} className="flex items-center justify-between gap-2 text-sm p-2.5 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span>{a.icon}</span>
                                    <span className="text-gray-700">{a.item}</span>
                                </div>
                                <button className="text-xs text-[#FE641F] font-medium whitespace-nowrap hover:underline">{a.action}</button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <Card className="p-5">
                <h4 className="font-semibold text-[#0C335C] mb-3">Recent Activity</h4>
                <div className="flex flex-col divide-y divide-gray-50">
                    {activity.map((a, i) => (
                        <div key={i} className="flex items-center gap-4 py-2.5 text-sm">
                            <span className="text-gray-400 font-mono w-16 shrink-0">{a.time}</span>
                            <span className="text-[#0C335C] font-medium w-52 shrink-0">{a.user}</span>
                            <span className="text-gray-600">{a.action}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
