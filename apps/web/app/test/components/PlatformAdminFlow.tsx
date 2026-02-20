"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft, Shield, Building2, Users, Activity, Settings, Search,
    Globe, AlertTriangle, CheckCircle2, Clock, TrendingUp, TrendingDown,
    Minus, BarChart3, Zap, Database, Server, Wifi, HardDrive, ChevronRight,
    Plus, Download, MoreHorizontal, Eye, Edit2, Trash2, Flag, Bell
} from "lucide-react";
import { MOCK_ORGS, MOCK_ACTIVITY, MOCK_COMPONENTS } from "./mockData";

type Screen = "dashboard" | "orgs" | "orgDetail" | "createOrg" | "userSearch" | "health" | "settings";

const NAV_ITEMS: { id: Screen; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "orgs", label: "Organizations", icon: Building2 },
    { id: "userSearch", label: "User Search", icon: Search },
    { id: "health", label: "System Health", icon: Activity },
    { id: "settings", label: "Platform Settings", icon: Settings },
];

function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
    const cls: Record<string, string> = {
        green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
        amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
        orange: "bg-orange-100 text-orange-800",
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
}

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

// ── SCREEN: Platform Dashboard ──────────────────────────────
function PlatformDashboard() {
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

// ── SCREEN: Organizations ──────────────────────────────────
function OrganizationsScreen({ onViewOrg }: { onViewOrg: () => void }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const planColor = (plan: string): "gray" | "blue" | "purple" | "orange" => {
        if (plan === "Starter") return "gray";
        if (plan === "Professional") return "blue";
        if (plan === "Enterprise") return "purple";
        return "orange";
    };
    const statusColor = (s: string): "green" | "blue" | "red" | "gray" => {
        if (s === "Active") return "green";
        if (s === "Trial") return "blue";
        if (s === "Suspended") return "red";
        return "gray";
    };

    const columns: TableColumn<(typeof MOCK_ORGS)[0]>[] = [
        { key: "id", label: "Org ID", width: "w-[110px]", render: (o) => <span className="font-mono text-xs text-gray-500">{o.id}</span> },
        {
            key: "name", label: "Organization", sortable: true, width: "w-[200px]",
            render: (o) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FE641F]/20 to-[#0C335C]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#0C335C]">{o.name[0]}</span>
                    </div>
                    <div>
                        <p className="font-medium text-[#0C335C] text-sm">{o.name}</p>
                        <p className="text-xs text-gray-400">{o.domain}</p>
                    </div>
                </div>
            )
        },
        { key: "plan", label: "Plan", sortable: true, width: "w-[120px]", render: (o) => <Badge text={o.plan} color={planColor(o.plan)} /> },
        { key: "status", label: "Status", sortable: true, width: "w-[100px]", render: (o) => <Badge text={o.status} color={statusColor(o.status)} /> },
        { key: "users", label: "Users", width: "w-[90px]", render: (o) => <span className="text-sm text-gray-600">{o.users}</span> },
        { key: "calls30d", label: "Calls (30d)", sortable: true, width: "w-[100px]", render: (o) => <span className="text-sm text-gray-700 font-medium">{o.calls30d.toLocaleString()}</span> },
        {
            key: "usage", label: "Usage", width: "w-[120px]",
            render: (o) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${o.usage > 85 ? "bg-red-500" : o.usage > 60 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${o.usage}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{o.usage}%</span>
                </div>
            )
        },
        { key: "created", label: "Created", width: "w-[110px]", render: (o) => <span className="text-xs text-gray-500">{o.created}</span> },
        { key: "admin", label: "Admin", width: "w-[170px]", render: (o) => <span className="text-xs text-gray-600 truncate">{o.admin}</span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true,
            render: (o) => (
                <div className="flex items-center gap-1 justify-center">
                    <button onClick={onViewOrg} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0C335C]"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0C335C]"><MoreHorizontal size={14} /></button>
                </div>
            )
        },
    ];

    const filtered = MOCK_ORGS.filter(o => {
        const s = search.toLowerCase();
        const matchSearch = !search || o.name.toLowerCase().includes(s) || o.domain.includes(s) || o.id.includes(s);
        const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter;
        const matchPlan = planFilter === "all" || o.plan.toLowerCase() === planFilter;
        return matchSearch && matchStatus && matchPlan;
    });

    return (
        <TableCard
            title="All Organizations"
            breadcrumbs={[{ label: "Platform Admin" }, { label: "Organizations" }]}
            primaryAction={
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]">
                    <Plus size={16} /> Create Organization
                </button>
            }
            secondaryAction={
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50">
                    <Download size={16} /> Export List
                </button>
            }
            searchPlaceholder="Search by name, domain, or ID..."
            searchValue={search}
            onSearchChange={setSearch}
            onClearFilters={search || statusFilter !== "all" || planFilter !== "all" ? () => { setSearch(""); setStatusFilter("all"); setPlanFilter("all"); } : undefined}
            filters={[
                { key: "status", label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Trial", value: "trial" }, { label: "Suspended", value: "suspended" }, { label: "Expired", value: "expired" }] },
                { key: "plan", label: "Plan", value: planFilter, onChange: setPlanFilter, options: [{ label: "Starter", value: "starter" }, { label: "Professional", value: "professional" }, { label: "Enterprise", value: "enterprise" }, { label: "Custom", value: "custom" }] },
            ]}
            stats={[
                { label: "Active Orgs", value: "42", valueColorClass: "text-green-600" },
                { label: "Trial Orgs", value: "3", valueColorClass: "text-blue-600" },
                { label: "Suspended", value: "2", valueColorClass: "text-red-600" },
                { label: "MRR", value: "$47,500", valueColorClass: "text-[#FE641F]" },
            ]}
            columns={columns}
            data={filtered.slice((currentPage - 1) * 10, currentPage * 10)}
            keyExtractor={(o) => o.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onRowClick={onViewOrg}
            pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
        />
    );
}

// ── SCREEN: Org Detail ──────────────────────────────────────
function OrgDetailScreen({ onBack }: { onBack: () => void }) {
    const [tab, setTab] = useState("overview");
    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "users", label: "Users", icon: "👥", badge: "12" },
        { id: "calls", label: "Calls", icon: "📞", badge: "8,432" },
        { id: "billing", label: "Billing", icon: "💳" },
        { id: "settings", label: "Settings", icon: "⚙️" },
        { id: "audit", label: "Audit Log", icon: "📋" },
    ];
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-[#0C335C] text-sm transition-colors">
                        <ArrowLeft size={16} /> All Organizations
                    </button>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center font-bold text-[#0C335C]">A</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-[#0C335C]">Acme Corporation</h2>
                            <Badge text="Active" color="green" />
                        </div>
                        <p className="text-sm text-gray-500">acme.example.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#0C335C] hover:bg-gray-50 flex items-center gap-1"><Edit2 size={14} /> Edit</button>
                    <button className="px-3 py-2 rounded-lg bg-[#FE641F] text-white text-sm font-medium hover:bg-[#e55a1b] flex items-center gap-1"><Zap size={14} /> Impersonate</button>
                    <button className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 flex items-center gap-1"><MoreHorizontal size={14} /> More</button>
                </div>
            </div>
            {/* Info Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4"><p className="text-xs text-gray-500">Plan</p><p className="font-bold text-[#0C335C] mt-1">Professional</p><p className="text-xs text-gray-400">Renews Jan 15, 2025</p><button className="text-xs text-[#FE641F] mt-1 font-medium">Upgrade →</button></Card>
                <Card className="p-4"><p className="text-xs text-gray-500">MRR</p><p className="font-bold text-[#0C335C] mt-1">$149/month</p><p className="text-xs text-gray-400">Annual billing</p><button className="text-xs text-[#FE641F] mt-1 font-medium">View invoices →</button></Card>
                <Card className="p-4"><p className="text-xs text-gray-500">Users</p><p className="font-bold text-[#0C335C] mt-1">12 / 50</p><p className="text-xs text-gray-400">24% used</p><button className="text-xs text-[#FE641F] mt-1 font-medium">Manage users →</button></Card>
                <Card className="p-4"><p className="text-xs text-gray-500">Usage</p><p className="font-bold text-amber-600 mt-1">8,432 / 10,000</p><div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: "84%" }} /></div><p className="text-xs text-gray-400 mt-1">84% of limit</p></Card>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 border-b-2 -mb-px ${tab === t.id ? "border-[#FE641F] text-[#FE641F]" : "border-transparent text-gray-500 hover:text-[#0C335C]"}`}>
                        {t.icon} {t.label}
                        {t.badge && <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px]">{t.badge}</span>}
                    </button>
                ))}
            </div>
            {/* Tab Content */}
            {tab === "overview" && (
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-3">Health Scores</h4>
                        {[{ label: "System Health", score: 98, color: "bg-green-500" }, { label: "Call Quality", score: 96, color: "bg-green-500" }, { label: "User Activity", score: 87, color: "bg-green-500" }, { label: "Feature Adoption", score: 72, color: "bg-amber-500" }].map(h => (
                            <div key={h.label} className="flex items-center gap-3 mb-3 last:mb-0">
                                <span className="text-sm text-gray-600 w-36 shrink-0">{h.label}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${h.color}`} style={{ width: `${h.score}%` }} /></div>
                                <span className="text-sm font-bold text-[#0C335C] w-12 text-right">{h.score}/100</span>
                            </div>
                        ))}
                    </Card>
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><Bell size={14} /> Active Alerts</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100"><span className="text-sm">🟡</span><span className="text-sm text-amber-800">Approaching call limit (84%)</span><span className="text-xs text-gray-400 ml-auto">2h ago</span></div>
                            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100"><span className="text-sm">🔵</span><span className="text-sm text-blue-800">New feature available: Advanced tags</span><span className="text-xs text-gray-400 ml-auto">1d ago</span></div>
                        </div>
                        <h4 className="font-semibold text-[#0C335C] mt-4 mb-3">Recent Activity</h4>
                        {[{ time: "2:34 PM", user: "john@acme.com", action: "Made call", detail: "+1-555-0456, 4m 32s" }, { time: "2:15 PM", user: "sarah@acme.com", action: "Added agent", detail: "mike@acme.com" }, { time: "1:48 PM", user: "system", action: "Daily report", detail: "Sent to admin" }].map((a, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-1.5 border-b border-gray-50 last:border-none">
                                <span className="text-gray-400 font-mono">{a.time}</span>
                                <span className="text-[#0C335C] font-medium">{a.user}</span>
                                <span>{a.action}</span>
                                <span className="text-gray-400 ml-auto">{a.detail}</span>
                            </div>
                        ))}
                    </Card>
                </div>
            )}
            {tab === "billing" && (
                <div className="flex flex-col gap-4">
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-4">Current Subscription</h4>
                        <div className="grid grid-cols-3 gap-6 text-sm">
                            {[["Plan", "Professional"], ["Status", "Active"], ["Billing Cycle", "Annual"], ["Next Renewal", "Jan 15, 2025"], ["Amount", "$1,788/year"]].map(([k, v]) => (
                                <div key={k}><p className="text-gray-400 text-xs">{k}</p><p className="font-medium text-[#0C335C] mt-0.5">{v}</p></div>
                            ))}
                        </div>
                    </Card>
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-4">Usage This Period</h4>
                        {[{ r: "Calls", used: "8,432", limit: "10,000", pct: 84 }, { r: "Recording storage", used: "450 GB", limit: "500 GB", pct: 90 }, { r: "AI transcription hrs", used: "234", limit: "500", pct: 47 }, { r: "API calls", used: "45,000", limit: "100,000", pct: 45 }].map(r => (
                            <div key={r.r} className="flex items-center gap-4 mb-3 last:mb-0 text-sm">
                                <span className="w-40 text-gray-600 shrink-0">{r.r}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${r.pct > 85 ? "bg-red-500" : r.pct > 70 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${r.pct}%` }} /></div>
                                <span className="text-gray-500 text-xs">{r.used} / {r.limit}</span>
                            </div>
                        ))}
                    </Card>
                </div>
            )}
            {tab === "settings" && (
                <div className="flex flex-col gap-4">
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-4">Organization Settings</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[["Organization Name", "Acme Corporation"], ["Domain", "acme.example.com"], ["Default Timezone", "America/New_York"], ["Language", "English (US)"]].map(([k, v]) => (
                                <div key={k} className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">{k}</label>
                                    <input defaultValue={v} className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-[#0C335C] bg-white" />
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="p-5 border border-red-100">
                        <h4 className="font-semibold text-red-600 mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h4>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50">Suspend Organization</button>
                            <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">Delete Organization</button>
                        </div>
                    </Card>
                </div>
            )}
            {(tab === "users" || tab === "calls" || tab === "audit") && (
                <Card className="p-8 text-center text-gray-400">
                    <p className="text-2xl mb-2">🚧</p>
                    <p className="text-sm">This tab content is shown in the expanded detail view.</p>
                    <p className="text-xs mt-1">Switch to Overview, Billing, or Settings to see content.</p>
                </Card>
            )}
        </div>
    );
}

// ── SCREEN: System Health ────────────────────────────────────
function SystemHealthScreen() {
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

// ── SCREEN: Platform Settings ──────────────────────────────
function PlatformSettingsScreen() {
    const flags = [
        { name: "New AI Model", status: "enabled", rollout: 100, orgs: "All" },
        { name: "Advanced Analytics", status: "beta", rollout: 25, orgs: "12 orgs" },
        { name: "Custom Integrations", status: "disabled", rollout: 0, orgs: "—" },
        { name: "Mobile App Access", status: "enabled", rollout: 100, orgs: "All" },
    ];
    const flagColor = (s: string) => s === "enabled" ? "text-green-700 bg-green-100" : s === "beta" ? "text-amber-700 bg-amber-100" : "text-red-700 bg-red-100";
    const flagDot = (s: string) => s === "enabled" ? "🟢" : s === "beta" ? "🟡" : "🔴";
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Feature Flags</h4>
                    <table className="w-full text-sm">
                        <thead><tr className="text-xs text-gray-400 text-left border-b border-gray-100">{["Feature", "Status", "Rollout %", "Organizations"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
                        <tbody>
                            {flags.map(f => (
                                <tr key={f.name} className="border-b border-gray-50 last:border-none">
                                    <td className="py-2 pr-4 font-medium text-gray-800">{f.name}</td>
                                    <td className="py-2 pr-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flagColor(f.status)}`}>{flagDot(f.status)} {f.status}</span></td>
                                    <td className="py-2 pr-4 text-gray-600">{f.rollout}%</td>
                                    <td className="py-2 text-gray-500">{f.orgs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">General Settings</h4>
                    <div className="flex flex-col gap-3 text-sm">
                        {[["Platform Name", "Voca Labs"], ["Support Email", "support@vocalabs.com"]].map(([k, v]) => (
                            <div key={k}><label className="text-xs text-gray-400">{k}</label><input defaultValue={v} className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg mt-0.5 text-sm" /></div>
                        ))}
                        <div className="flex items-center justify-between"><span className="text-gray-600">Maintenance Mode</span><div className="w-10 h-5 rounded-full bg-gray-200 relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" /></div></div>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Shield size={14} /> Security Settings</h4>
                    {[["Require 2FA for Platform Admins", "✅ Yes"], ["Password Min Length", "12 characters"], ["Max Login Attempts", "5"], ["Lockout Duration", "30 minutes"], ["Session Lifetime", "8 hours"], ["Require HTTPS", "✅ Yes"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none"><span className="text-gray-600">{k}</span><span className="font-medium text-[#0C335C]">{v}</span></div>
                    ))}
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Zap size={14} /> API Configuration</h4>
                    {[["Rate Limit (per org)", "10,000/hour"], ["Max Webhook Retries", "5"], ["Webhook Timeout", "30 seconds"], ["API Version", "v2.1"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none"><span className="text-gray-600">{k}</span><span className="font-mono font-medium text-[#0C335C]">{v}</span></div>
                    ))}
                </Card>
            </div>
        </div>
    );
}

// ── SCREEN: User Search ─────────────────────────────────────
function GlobalUserSearch() {
    const [search, setSearch] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const users = [
        { id: "1", name: "John Doe", email: "john@acme.com", org: "Acme Corporation", role: "Agent", status: "Active", lastActive: "2 min ago" },
        { id: "2", name: "Sarah Johnson", email: "sarah@acme.com", org: "Acme Corporation", role: "Supervisor", status: "Active", lastActive: "5 min ago" },
        { id: "3", name: "Maria López", email: "maria@techstart.io", org: "TechStart Inc", role: "Agent", status: "Active", lastActive: "1 hour ago" },
        { id: "4", name: "Chen Wei", email: "chen@globalservices.com", org: "Global Services", role: "Supervisor", status: "Inactive", lastActive: "2 days ago" },
    ];
    const roleColor = (r: string) => r === "Supervisor" ? "blue" : "gray";
    const cols: TableColumn<typeof users[0]>[] = [
        {
            key: "name", label: "User", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-medium">{u.name.split(" ").map(p => p[0]).join("")}</div>
                    <div><p className="font-medium text-[#0C335C] text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div>
            )
        },
        { key: "org", label: "Organization", sortable: true, width: "w-[180px]", render: (u) => <span className="text-sm text-[#FE641F] font-medium hover:underline cursor-pointer">{u.org}</span> },
        { key: "role", label: "Role", width: "w-[100px]", render: (u) => <Badge text={u.role} color={roleColor(u.role) as "blue" | "gray"} /> },
        { key: "status", label: "Status", width: "w-[90px]", render: (u) => <Badge text={u.status} color={u.status === "Active" ? "green" : "gray"} /> },
        { key: "lastActive", label: "Last Active", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-400">{u.lastActive}</span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><MoreHorizontal size={14} /></button>
                </div>
            )
        },
    ];
    const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search) || u.org.toLowerCase().includes(search.toLowerCase()));
    return (
        <TableCard
            title="Global User Search"
            breadcrumbs={[{ label: "Platform Admin" }, { label: "User Search" }]}
            searchPlaceholder="Search across all organizations..."
            searchValue={search}
            onSearchChange={setSearch}
            stats={[{ label: "Results", value: filtered.length.toString(), valueColorClass: "text-[#0C335C]" }, { label: "Organizations", value: "4", valueColorClass: "text-[#FE641F]" }]}
            columns={cols}
            data={filtered}
            keyExtractor={(u) => u.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: filtered.length, totalPages: 1, onPageChange: () => { } }}
        />
    );
}

// ── ROOT: Platform Admin Flow ───────────────────────────────
export default function PlatformAdminFlow({ onBack }: { onBack: () => void }) {
    const [screen, setScreen] = useState<Screen>("dashboard");
    const isOrgDetail = screen === "orgDetail";

    const titles: Record<Screen, string> = {
        dashboard: "Platform Dashboard", orgs: "All Organizations", orgDetail: "Organization Detail",
        createOrg: "Create Organization", userSearch: "Global User Search", health: "System Health", settings: "Platform Settings",
    };

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fdf0e8 100%)" }}>
            {/* Sidebar */}
            <aside className="w-56 shrink-0 flex flex-col border-r border-white/60 bg-white/60 backdrop-blur-md px-3 py-6 gap-1">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#0C335C] text-xs mb-4 transition-colors px-3">
                    <ArrowLeft size={14} /> Back to Roles
                </button>
                <div className="flex items-center gap-2 px-3 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center"><Shield size={14} className="text-purple-600" /></div>
                    <span className="text-xs font-semibold text-purple-700">Platform Admin</span>
                </div>
                {NAV_ITEMS.map(item => (
                    <button key={item.id} onClick={() => setScreen(item.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${screen === item.id || (screen === "orgDetail" && item.id === "orgs") ? "bg-[#FE641F] text-white font-bold shadow-[0_4px_14px_0_rgba(254,100,31,0.3)]" : "text-gray-500 hover:bg-white/70 hover:text-[#0C335C]"}`}>
                        <item.icon size={15} /> {item.label}
                    </button>
                ))}
            </aside>
            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/60 bg-white/50 backdrop-blur-sm shrink-0">
                    <div>
                        <h1 className="text-lg font-bold text-[#0C335C]">{titles[screen]}</h1>
                        <p className="text-xs text-gray-400">Platform Administration • Production</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                            <CheckCircle2 size={12} /> All Systems Operational
                        </div>
                        <div className="text-xs text-gray-400">Updated 2 min ago</div>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {screen === "dashboard" && <PlatformDashboard />}
                    {screen === "orgs" && <OrganizationsScreen onViewOrg={() => setScreen("orgDetail")} />}
                    {screen === "orgDetail" && <OrgDetailScreen onBack={() => setScreen("orgs")} />}
                    {screen === "userSearch" && <GlobalUserSearch />}
                    {screen === "health" && <SystemHealthScreen />}
                    {screen === "settings" && <PlatformSettingsScreen />}
                </div>
            </div>
        </div>
    );
}
