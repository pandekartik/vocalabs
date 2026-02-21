import { Card } from "@/components/ui/card";
import { Activity, Server, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MOCK_ACTIVITY, MOCK_COMPONENTS } from "@/app/test/components/mockData";

function MetricCard({ label, value, sub, trend, color = "text-[#0C335C]" }: {
    label: string; value: string | number; sub?: string; trend?: "up" | "down" | "stable"; color?: string;
}) {
    return (
        <Card className="flex flex-col gap-1 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {sub && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                    {trend === "up" && <TrendingUp size={12} className="text-green-500" />}
                    {trend === "down" && <TrendingDown size={12} className="text-red-500" />}
                    {trend === "stable" && <Minus size={12} className="text-gray-400" />}
                    {sub}
                </p>
            )}
        </Card>
    );
}

export default function PlatformDashboard() {
    const alerts = [
        { sev: "error", icon: "🔴", msg: "3 organizations experiencing call failures", action: "View Incidents" },
        { sev: "warning", icon: "🟡", msg: "Database replication lag > 5s", action: "Investigate" },
        { sev: "info", icon: "🔵", msg: "Scheduled maintenance in 24 hours", action: "Dismiss" },
    ];
    const healthMetrics = [
        { label: "Active Organizations", value: "47", sub: "↑ 3 this week", trend: "up" as const },
        { label: "Total Users", value: "1,247", sub: "↑ 12%", trend: "up" as const },
        { label: "Concurrent Calls", value: "2,847 / 10,000", sub: "↑ 15%", trend: "up" as const },
        { label: "WebSocket Connections", value: "3,102", sub: "Stable", trend: "stable" as const },
        { label: "API Response Time", value: "45ms", sub: "↓ 8ms faster", trend: "down" as const, color: "text-green-600" },
        { label: "Error Rate", value: "0.02%", sub: "No change", trend: "stable" as const, color: "text-green-600" },
    ];
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Platform Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of system health and platform activity.</p>
            </div>
            {/* Alerts banner */}
            <div className="flex flex-col gap-2">
                {alerts.map((a, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm
                        ${a.sev === "error" ? "bg-red-50 border-red-200 text-red-800" : a.sev === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
                        <span>{a.icon} {a.msg}</span>
                        <button className="font-medium underline text-xs">{a.action}</button>
                    </div>
                ))}
            </div>
            {/* Health metrics */}
            <div className="grid grid-cols-3 gap-4">
                {healthMetrics.map((m) => <MetricCard key={m.label} {...m} />)}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* Activity Stream */}
                <Card className="p-5">
                    <h3 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Activity size={16} /> Real-Time Activity</h3>
                    <div className="flex flex-col gap-2">
                        {MOCK_ACTIVITY.map((a, i) => (
                            <div key={i} className="flex items-start justify-between gap-2 text-sm py-2 border-b border-gray-50 last:border-none">
                                <span className="text-gray-400 text-xs font-mono shrink-0">{a.time}</span>
                                <span className="flex-1 text-gray-700">{a.event}</span>
                                <span className="text-xs text-gray-400 shrink-0">{a.org}</span>
                                <span>{a.severity === "error" ? "🔴" : a.severity === "warning" ? "🟡" : "🔵"}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                {/* Component Status */}
                <Card className="p-5">
                    <h3 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Server size={16} /> System Components</h3>
                    <div className="flex flex-col gap-2">
                        {MOCK_COMPONENTS.map((c) => (
                            <div key={c.name} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-none">
                                <div className="flex items-center gap-2">
                                    {c.status === "Healthy" ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                                    <span className="text-gray-700">{c.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div className={`h-full rounded-full ${c.load > 80 ? "bg-red-500" : c.load > 60 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${c.load}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-400">{c.load}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
