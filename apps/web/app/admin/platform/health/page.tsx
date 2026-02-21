"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Database, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MOCK_COMPONENTS } from "@/app/test/components/mockData";

export default function SystemHealthScreen() {
    const metrics = [
        { label: "CPU Usage", value: "45%", pct: 45 }, { label: "Memory", value: "12.4 GB / 32 GB", pct: 39 },
        { label: "Disk I/O", value: "234 MB/s", pct: 60 }, { label: "Network In", value: "1.2 Gbps", pct: 60 }, { label: "Network Out", value: "890 Mbps", pct: 44 },
    ];
    const errors = [
        { type: "WebSocket timeout", count: 23, trend: "down", last: "5 min ago" },
        { type: "AI transcription fail", count: 7, trend: "stable", last: "12 min ago" },
        { type: "Database deadlock", count: 1, trend: "down", last: "2 hours ago" },
        { type: "API rate limit", count: 45, trend: "up", last: "1 min ago" },
    ];
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">System Health</h1>
                <p className="text-sm text-gray-500">Real-time status of platform infrastructure.</p>
            </div>
            <div className="grid grid-cols-5 gap-4">
                {metrics.map(m => (
                    <Card key={m.label} className="p-4 flex flex-col gap-2">
                        <p className="text-xs text-gray-500">{m.label}</p>
                        <p className="font-bold text-[#0C335C]">{m.value}</p>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${m.pct > 80 ? "bg-red-500" : m.pct > 60 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${m.pct}%` }} /></div>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Database size={14} /> Database Metrics</h4>
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100 pb-2"><th className="pb-2">Metric</th><th className="pb-2">Primary</th><th className="pb-2">Replica 1</th><th className="pb-2">Replica 2</th></tr></thead>
                        <tbody className="text-gray-700">
                            {[["Connections", "234/500", "198/500", "201/500"], ["Query Time (avg)", "12ms", "15ms", "14ms"], ["Replication Lag", "—", "0ms", "0ms"], ["Slow Queries", "2/min", "3/min", "1/min"]].map(row => (
                                <tr key={row[0]} className="border-b border-gray-50 last:border-none">
                                    {row.map((cell, i) => <td key={i} className="py-2 pr-4">{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><AlertTriangle size={14} /> Error Tracking</h4>
                    <div className="flex flex-col gap-2">
                        {errors.map(e => (
                            <div key={e.type} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-none">
                                <span className="text-gray-700">{e.type}</span>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${e.count > 20 ? "text-red-600" : e.count > 5 ? "text-amber-600" : "text-gray-700"}`}>{e.count}</span>
                                    <span>{e.trend === "up" ? "↑" : e.trend === "down" ? "↓" : "→"}</span>
                                    <span className="text-xs text-gray-400">{e.last}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <Card className="p-5">
                <h4 className="font-semibold text-[#0C335C] mb-4">Component Status</h4>
                <div className="grid grid-cols-4 gap-3">
                    {MOCK_COMPONENTS.map(c => (
                        <div key={c.name} className={`rounded-xl p-3 border ${c.status === "Healthy" ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {c.status === "Healthy" ? <CheckCircle2 size={14} className="text-green-600" /> : <AlertTriangle size={14} className="text-amber-600" />}
                                <span className="text-xs font-medium text-gray-700">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-white/60 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.load > 80 ? "bg-red-500" : c.load > 60 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${c.load}%` }} /></div>
                                <span className="text-[10px] text-gray-500">{c.load}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
