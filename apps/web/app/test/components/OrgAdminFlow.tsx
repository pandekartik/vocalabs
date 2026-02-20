"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft, Building2, Users, Phone, Settings, BarChart3,
    CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Clock,
    Plus, Download, Eye, MoreHorizontal, Filter, Bell
} from "lucide-react";
import { MOCK_USERS, MOCK_CALLS } from "./mockData";

type Screen = "dashboard" | "users" | "supervisors" | "calls" | "settings" | "audit";

const NAV_ITEMS: { id: Screen; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "supervisors", label: "Supervisors", icon: Users },
    { id: "calls", label: "Calls Overview", icon: Phone },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "audit", label: "Audit Log", icon: Filter },
];

function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "purple" | "amber" | "orange" }) {
    const cls: Record<string, string> = {
        green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
        purple: "bg-purple-100 text-purple-800", amber: "bg-amber-100 text-amber-800",
        orange: "bg-orange-100 text-orange-800",
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
}

// ── SCREEN: Org Admin Dashboard ─────────────────────────────
function OrgDashboard() {
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
        <div className="flex flex-col gap-5">
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

// ── SCREEN: User Management ─────────────────────────────────
function UserManagementScreen() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const roleColor = (r: string): "blue" | "gray" | "purple" => r === "Supervisor" ? "blue" : r === "Org Admin" ? "purple" : "gray";
    const statusColor = (s: string): "green" | "gray" | "amber" => s === "Active" ? "green" : s === "Pending" ? "amber" : "gray";

    const columns: TableColumn<typeof MOCK_USERS[0]>[] = [
        {
            key: "name", label: "User", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-medium text-[#0C335C]">
                        {u.name.split(" ").map(p => p[0]).join("")}
                    </div>
                    <div><p className="font-medium text-[#0C335C] text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div>
            )
        },
        { key: "role", label: "Role", sortable: true, width: "w-[110px]", render: (u) => <Badge text={u.role} color={roleColor(u.role)} /> },
        { key: "team", label: "Team", width: "w-[100px]", render: (u) => <span className="text-sm text-gray-600">{u.team}</span> },
        { key: "status", label: "Status", sortable: true, width: "w-[100px]", render: (u) => <Badge text={u.status} color={statusColor(u.status)} /> },
        { key: "lastActive", label: "Last Active", sortable: true, width: "w-[120px]", render: (u) => <span className="text-sm text-gray-400">{u.lastActive}</span> },
        { key: "calls7d", label: "Calls (7d)", sortable: true, width: "w-[90px]", render: (u) => <span className="text-sm font-medium text-[#0C335C]">{u.calls7d}</span> },
        { key: "created", label: "Created", width: "w-[110px]", render: (u) => <span className="text-xs text-gray-500">{u.created}</span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><MoreHorizontal size={14} /></button>
                </div>
            )
        },
    ];
    const filtered = MOCK_USERS.filter(u => {
        const s = search.toLowerCase();
        return (!search || u.name.toLowerCase().includes(s) || u.email.includes(s)) &&
            (roleFilter === "all" || u.role.toLowerCase().includes(roleFilter)) &&
            (statusFilter === "all" || u.status.toLowerCase() === statusFilter);
    });
    return (
        <TableCard
            title="Users"
            breadcrumbs={[{ label: "Org Admin" }, { label: "Users" }]}
            primaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"><Plus size={16} /> Add User</button>}
            secondaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Bulk Import</button>}
            searchPlaceholder="Search by name or email..."
            searchValue={search}
            onSearchChange={setSearch}
            onClearFilters={search || roleFilter !== "all" || statusFilter !== "all" ? () => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); } : undefined}
            filters={[
                { key: "role", label: "Role", value: roleFilter, onChange: setRoleFilter, options: [{ label: "Supervisor", value: "supervisor" }, { label: "Agent", value: "agent" }] },
                { key: "status", label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }, { label: "Pending", value: "pending" }] },
            ]}
            stats={[
                { label: "Total Users", value: MOCK_USERS.length.toString(), valueColorClass: "text-[#0C335C]" },
                { label: "Supervisors", value: MOCK_USERS.filter(u => u.role === "Supervisor").length.toString(), valueColorClass: "text-blue-600" },
                { label: "Agents", value: MOCK_USERS.filter(u => u.role === "Agent").length.toString(), valueColorClass: "text-gray-600" },
                { label: "Active", value: MOCK_USERS.filter(u => u.status === "Active").length.toString(), valueColorClass: "text-green-600" },
            ]}
            columns={columns}
            data={filtered}
            keyExtractor={(u) => u.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
        />
    );
}

// ── SCREEN: Supervisors ──────────────────────────────────────
function SupervisorsScreen() {
    const supervisors = MOCK_USERS.filter(u => u.role === "Supervisor");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const cols: TableColumn<typeof supervisors[0]>[] = [
        {
            key: "name", label: "Supervisor", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">{u.name.split(" ").map(p => p[0]).join("")}</div>
                    <div><p className="font-medium text-[#0C335C] text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div>
            )
        },
        { key: "team", label: "Team", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-600">{u.team}</span> },
        { key: "calls7d", label: "Active Calls", width: "w-[100px]", render: () => <span className="text-sm font-medium text-[#FE641F]">2 on calls</span> },
        { key: "lastActive", label: "Last Active", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-400">{u.lastActive}</span> },
        {
            key: "actions", label: "Actions", width: "w-[120px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">View</button>
                    <button className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Reassign</button>
                </div>
            )
        },
    ];
    return (
        <TableCard
            title="Supervisors"
            breadcrumbs={[{ label: "Org Admin" }, { label: "Supervisors" }]}
            primaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"><Plus size={16} /> Add Supervisor</button>}
            stats={[
                { label: "Total Supervisors", value: supervisors.length.toString(), valueColorClass: "text-blue-600" },
                { label: "Active Now", value: supervisors.filter(s => s.status === "Active").length.toString(), valueColorClass: "text-green-600" },
            ]}
            columns={cols}
            data={supervisors}
            keyExtractor={(u) => u.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: supervisors.length, totalPages: 1, onPageChange: () => { } }}
        />
    );
}

// ── SCREEN: Calls Overview ──────────────────────────────────
function CallsOverviewScreen() {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const callStats = [
        { label: "Total Calls", value: "1,247", sub: "Last 30 days", color: "text-[#0C335C]" },
        { label: "Inbound", value: "890 (71%)", sub: "—", color: "text-blue-600" },
        { label: "Outbound", value: "357 (29%)", sub: "—", color: "text-[#FE641F]" },
        { label: "Completed", value: "1,100 (88%)", sub: "—", color: "text-green-600" },
        { label: "Missed", value: "87 (7%)", sub: "—", color: "text-red-600" },
        { label: "Avg Duration", value: "5m 42s", sub: "—", color: "text-[#0C335C]" },
    ];
    const byAgent = [
        { agent: "Sarah J.", calls: 145, duration: "18h 23m", avg: "7m 36s", rate: "94%" },
        { agent: "Mike C.", calls: 132, duration: "16h 45m", avg: "7m 37s", rate: "91%" },
        { agent: "John D.", calls: 118, duration: "14h 20m", avg: "7m 17s", rate: "89%" },
    ];
    const cols: TableColumn<typeof MOCK_CALLS[0]>[] = [
        { key: "id", label: "Call ID", width: "w-[100px]", render: (c) => <span className="font-mono text-xs text-gray-500">{c.id}</span> },
        { key: "timestamp", label: "Time", sortable: true, width: "w-[160px]", render: (c) => <span className="text-sm text-gray-600">{c.timestamp}</span> },
        { key: "agent", label: "Agent", sortable: true, width: "w-[130px]", render: (c) => <span className="text-sm font-medium text-[#0C335C]">{c.agent}</span> },
        { key: "phone", label: "Phone", width: "w-[140px]", render: (c) => <span className="text-sm font-mono text-gray-600">{c.phone}</span> },
        { key: "duration", label: "Duration", sortable: true, width: "w-[90px]", render: (c) => <span className="text-sm text-gray-700">{c.duration}</span> },
        { key: "outcome", label: "Outcome", sortable: true, width: "w-[110px]", render: (c) => <Badge text={c.outcome} color={c.outcome === "Completed" ? "green" : c.outcome === "Missed" ? "red" : "gray"} /> },
        { key: "recording", label: "Recording", width: "w-[100px]", render: (c) => <Badge text={c.recording} color={c.recording === "Available" ? "blue" : "gray"} /> },
    ];
    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-3">
                {callStats.map(s => (
                    <Card key={s.label} className="p-4"><p className="text-xs text-gray-500">{s.label}</p><p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p></Card>
                ))}
            </div>
            <Card className="p-5">
                <h4 className="font-semibold text-[#0C335C] mb-4">Calls by Agent (30 days)</h4>
                <table className="w-full text-sm">
                    <thead><tr className="text-xs text-gray-400 text-left border-b border-gray-100">{["Agent", "Calls", "Total Duration", "Avg Duration", "Outcome Rate"].map(h => <th key={h} className="pb-2 pr-6">{h}</th>)}</tr></thead>
                    <tbody>
                        {byAgent.map(a => (
                            <tr key={a.agent} className="border-b border-gray-50 last:border-none">
                                <td className="py-2.5 pr-6 font-medium text-[#0C335C]">{a.agent}</td>
                                <td className="py-2.5 pr-6">{a.calls}</td>
                                <td className="py-2.5 pr-6 font-mono">{a.duration}</td>
                                <td className="py-2.5 pr-6 font-mono">{a.avg}</td>
                                <td className="py-2.5"><Badge text={a.rate} color="green" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <TableCard
                title="Recent Calls"
                breadcrumbs={[]}
                columns={cols}
                data={MOCK_CALLS}
                keyExtractor={(c) => c.id}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                secondaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Export CSV</button>}
                pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: MOCK_CALLS.length, totalPages: 1, onPageChange: () => { } }}
            />
        </div>
    );
}

// ── SCREEN: Org Settings ────────────────────────────────────
function OrgSettingsScreen() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const integrations = [
        { name: "Salesforce", status: "connected" }, { name: "HubSpot", status: "disconnected" },
        { name: "Slack", status: "connected" }, { name: "Zapier", status: "needs-auth" },
    ];
    const intColor = (s: string) => s === "connected" ? "green" : s === "needs-auth" ? "amber" : "gray";
    const intLabel = (s: string) => s === "connected" ? "✅ Connected" : s === "needs-auth" ? "⚠️ Needs re-auth" : "❌ Not connected";
    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Organization Profile</h4>
                    <div className="flex flex-col gap-3">
                        {[["Organization Name", "Acme Corporation"], ["Website", "www.acme.com"], ["Industry", "Technology"], ["Timezone", "America/New_York"]].map(([k, v]) => (
                            <div key={k}><label className="text-xs text-gray-400">{k}</label><input defaultValue={v} className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg mt-0.5 text-sm bg-white" /></div>
                        ))}
                    </div>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Business Hours</h4>
                    <div className="flex flex-col gap-1.5 text-sm">
                        {days.map((d, i) => (
                            <div key={d} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-none">
                                <span className="text-gray-600 w-24">{d}</span>
                                {i < 5 ? (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>9:00 AM</span><span>—</span><span>6:00 PM</span>
                                        <Badge text="Open" color="green" />
                                    </div>
                                ) : <Badge text="Closed" color="gray" />}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Integrations</h4>
                    <div className="flex flex-col gap-2">
                        {integrations.map(i => (
                            <div key={i.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">{i.name[0]}</div>
                                    <div><p className="text-sm font-medium text-[#0C335C]">{i.name}</p><p className={`text-xs ${i.status === "connected" ? "text-green-600" : i.status === "needs-auth" ? "text-amber-600" : "text-gray-400"}`}>{intLabel(i.status)}</p></div>
                                </div>
                                <button className={`text-xs px-3 py-1 rounded-lg border font-medium ${i.status === "connected" ? "border-gray-200 text-gray-600 hover:bg-gray-100" : i.status === "needs-auth" ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-[#FE641F] text-[#FE641F] hover:bg-orange-50"}`}>
                                    {i.status === "connected" ? "Configure" : i.status === "needs-auth" ? "Reconnect" : "Connect"}
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Recording & Compliance</h4>
                    {[["Call Recording", "✅ Enabled for all calls"], ["Recording Retention", "90 days"], ["AI Transcription", "✅ Enabled"], ["GDPR Retention", "365 days"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none">
                            <span className="text-gray-600">{k}</span><span className="font-medium text-[#0C335C]">{v}</span>
                        </div>
                    ))}
                    <h4 className="font-semibold text-[#0C335C] mb-3 mt-4">Billing & Plan</h4>
                    {[["Current Plan", "Professional"], ["Monthly Cost", "$149/month"], ["Next Invoice", "Feb 15, 2025"], ["Payment Method", "Visa •••• 4242"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none">
                            <span className="text-gray-600">{k}</span><span className="font-medium text-[#0C335C]">{v}</span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}

// ── SCREEN: Audit Log ────────────────────────────────────────
function AuditLogScreen() {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const logs = [
        { id: "a1", ts: "2024-01-15 14:32", user: "sarah@acme.com", action: "CREATE", resource: "Agent", details: "Created: mike@acme.com", ip: "192.168.1.5" },
        { id: "a2", ts: "2024-01-15 14:15", user: "john@acme.com", action: "UPDATE", resource: "Call", details: "Added tag: hot-lead", ip: "192.168.1.12" },
        { id: "a3", ts: "2024-01-15 13:48", user: "admin@acme.com", action: "LOGIN", resource: "System", details: "Successful", ip: "192.168.1.1" },
        { id: "a4", ts: "2024-01-15 13:20", user: "priya@acme.com", action: "EXPORT", resource: "Calls", details: "Exported 450 records", ip: "192.168.1.8" },
        { id: "a5", ts: "2024-01-15 12:44", user: "admin@acme.com", action: "UPDATE", resource: "Setting", details: "Changed recording retention: 60d → 90d", ip: "192.168.1.1" },
    ];
    const actionColor = (a: string): "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" =>
        a === "CREATE" ? "green" : a === "UPDATE" ? "blue" : a === "DELETE" ? "red" : a === "LOGIN" ? "gray" : "amber";
    const cols: TableColumn<typeof logs[0]>[] = [
        { key: "ts", label: "Timestamp", sortable: true, width: "w-[160px]", render: (l) => <span className="text-xs font-mono text-gray-600">{l.ts}</span> },
        {
            key: "user", label: "User", width: "w-[180px]", render: (l) => (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[10px] font-medium">{l.user[0].toUpperCase()}</div>
                    <span className="text-xs text-gray-700">{l.user}</span>
                </div>
            )
        },
        { key: "action", label: "Action", width: "w-[90px]", render: (l) => <Badge text={l.action} color={actionColor(l.action)} /> },
        { key: "resource", label: "Resource", width: "w-[100px]", render: (l) => <span className="text-sm text-gray-700">{l.resource}</span> },
        { key: "details", label: "Details", width: "flex-1 min-w-[180px]", render: (l) => <span className="text-xs text-gray-500">{l.details}</span> },
        { key: "ip", label: "IP Address", width: "w-[130px]", render: (l) => <span className="text-xs font-mono text-gray-400">{l.ip}</span> },
    ];
    return (
        <TableCard
            title="Audit Log"
            breadcrumbs={[{ label: "Org Admin" }, { label: "Audit Log" }]}
            searchPlaceholder="Search by user, action, or resource..."
            secondaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Export</button>}
            filters={[
                { key: "action", label: "Action", value: "all", onChange: () => { }, options: [{ label: "Create", value: "create" }, { label: "Update", value: "update" }, { label: "Delete", value: "delete" }, { label: "Login", value: "login" }] },
                { key: "resource", label: "Resource", value: "all", onChange: () => { }, options: [{ label: "User", value: "user" }, { label: "Call", value: "call" }, { label: "Setting", value: "setting" }] },
            ]}
            columns={cols}
            data={logs}
            keyExtractor={(l) => l.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: logs.length, totalPages: 1, onPageChange: () => { } }}
        />
    );
}

// ── ROOT: Org Admin Flow ─────────────────────────────────────
export default function OrgAdminFlow({ onBack }: { onBack: () => void }) {
    const [screen, setScreen] = useState<Screen>("dashboard");
    const titles: Record<Screen, string> = {
        dashboard: "Organization Dashboard", users: "User Management", supervisors: "Supervisor Management",
        calls: "Calls Overview", settings: "Organization Settings", audit: "Audit Log",
    };
    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fdf0e8 100%)" }}>
            {/* Sidebar */}
            <aside className="w-56 shrink-0 flex flex-col border-r border-white/60 bg-white/60 backdrop-blur-md px-3 py-6 gap-1">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#0C335C] text-xs mb-4 transition-colors px-3">
                    <ArrowLeft size={14} /> Back to Roles
                </button>
                <div className="flex items-center gap-2 px-3 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center"><Building2 size={14} className="text-blue-600" /></div>
                    <span className="text-xs font-semibold text-blue-700">Org Admin</span>
                    <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">Admin</span>
                </div>
                {NAV_ITEMS.map(item => (
                    <button key={item.id} onClick={() => setScreen(item.id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${screen === item.id ? "bg-[#FE641F] text-white font-bold shadow-[0_4px_14px_0_rgba(254,100,31,0.3)]" : "text-gray-500 hover:bg-white/70 hover:text-[#0C335C]"}`}>
                        <item.icon size={15} /> {item.label}
                    </button>
                ))}
            </aside>
            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/60 bg-white/50 backdrop-blur-sm shrink-0">
                    <div>
                        <h1 className="text-lg font-bold text-[#0C335C]">{titles[screen]}</h1>
                        <p className="text-xs text-gray-400">Acme Corporation • Organization Admin</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Wednesday, January 15, 2025</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {screen === "dashboard" && <OrgDashboard />}
                    {screen === "users" && <UserManagementScreen />}
                    {screen === "supervisors" && <SupervisorsScreen />}
                    {screen === "calls" && <CallsOverviewScreen />}
                    {screen === "settings" && <OrgSettingsScreen />}
                    {screen === "audit" && <AuditLogScreen />}
                </div>
            </div>
        </div>
    );
}
