"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Bell } from "lucide-react";
import axios from "axios";

export default function OrgDashboard() {
    const [stats, setStats] = useState([
        { label: "Total Users", value: "-", change: "", action: "Manage", color: "text-[#0C335C]" },
        { label: "Supervisors", value: "-", change: "", action: "View", color: "text-blue-600" },
        { label: "Agents", value: "-", change: "", action: "View", color: "text-gray-700" },
        { label: "Active Calls", value: "-", change: "", action: "Monitor", color: "text-[#FE641F]" },
        { label: "Today's Calls", value: "-", change: "", action: "View details", color: "text-[#0C335C]" },
        { label: "Avg Handle Time", value: "-", change: "", action: "Analyze", color: "text-green-600" },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem("user");
                const token = localStorage.getItem("token");
                if (!userStr || !token) return;

                const user = JSON.parse(userStr);
                if (!user.organization_id) return;

                const headers = { Authorization: `Bearer ${token}` };

                const [orgRes, liveRes, statsRes] = await Promise.all([
                    axios.get(`https://api.vocalabstech.com/admin/organizations/${user.organization_id}`, { headers }),
                    axios.get(`https://api.vocalabstech.com/supervisor/live-calls`, { headers }),
                    axios.get(`https://api.vocalabstech.com/calls/my-calls/stats`, { headers })
                ]);

                const orgData = orgRes.data;
                const liveData = liveRes.data;
                const callsStats = statsRes.data;

                // Format duration safely
                const formatDuration = (seconds: number) => {
                    if (!seconds || seconds <= 0) return "0m 0s";
                    const m = Math.floor(seconds / 60);
                    const s = Math.floor(seconds % 60);
                    return `${m}m ${s}s`;
                };

                const users = orgData.users || [];
                const supervisorsCount = users.filter((u: any) => u.role?.toLowerCase() === 'supervisor').length;
                const agentsCount = users.filter((u: any) => u.role?.toLowerCase() === 'agent').length;

                setStats([
                    { label: "Total Users", value: users.length.toString(), change: "", action: "Manage", color: "text-[#0C335C]" },
                    { label: "Supervisors", value: supervisorsCount.toString(), change: "", action: "View", color: "text-blue-600" },
                    { label: "Agents", value: agentsCount.toString(), change: "", action: "View", color: "text-gray-700" },
                    { label: "Active Calls", value: Array.isArray(liveData) ? liveData.length.toString() : "0", change: "Live now", action: "Monitor", color: "text-[#FE641F]" },
                    { label: "Today's Calls", value: (callsStats.today_calls || 0).toString(), change: "", action: "View details", color: "text-[#0C335C]" },
                    { label: "Avg Handle Time", value: formatDuration(callsStats.avg_duration || 0), change: "", action: "Analyze", color: "text-green-600" },
                ]);

            } catch (error) {
                console.error("Failed to fetch dashboard metrics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Set up an interval to refresh live calls occasionally
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Additional state for Recent Calls widget that hooks into our newly created schemas
    const [recentCalls, setRecentCalls] = useState<any[]>([]);
    const [searchCall, setSearchCall] = useState("");
    const [activeCall, setActiveCall] = useState<any | null>(null);
    const [loadingCalls, setLoadingCalls] = useState(true);

    useEffect(() => {
        const fetchRecentCalls = async () => {
            setLoadingCalls(true);
            try {
                const token = localStorage.getItem("token") || "";
                const response = await axios.get("https://api.vocalabstech.com/calls", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 10 }
                });
                setRecentCalls(response.data);
            } catch (error) {
                console.error("Failed to fetch recent calls for dashboard", error);
            } finally {
                setLoadingCalls(false);
            }
        };
        fetchRecentCalls();
    }, []);

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "0s";
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

    const { TableCard } = require("@/components/TableCard/TableCard");
    const { PlayCircle, Search } = require("lucide-react");
    const Link = require("next/link").default;
    const { cn } = require("@repo/ui/lib/utils");
    const { CallDetailModal } = require("@/app/call-history/components/CallDetailModal");

    const colsRecent = [
        { key: "id", label: "Call ID", width: "w-[130px]", render: (c: any) => <span className="font-mono text-xs text-gray-500">{c.id.substring(0, 8)}...</span> },
        { key: "timestamp", label: "Time", sortable: true, width: "w-[160px]", render: (c: any) => <span className="text-sm text-gray-600">{new Date(c.created_at).toLocaleString()}</span> },
        {
            key: "agent",
            label: "Agent",
            sortable: true,
            width: "w-[130px]",
            render: (c: any) => {
                const identifier = c.agent_name || c.agent_id_str || 'unknown';
                return (
                    <Link href={`/admin/org/calls/agents/${encodeURIComponent(identifier)}`} className="text-sm font-medium text-[#0C335C] hover:underline" onClick={(e: any) => e.stopPropagation()}>
                        {identifier === 'unknown' ? 'Unknown' : (c.agent_name || c.agent_id_str)}
                    </Link>
                );
            }
        },
        {
            key: "phone", label: "Phone", width: "w-[140px]", render: (c: any) => {
                const num = c.direction === 'inbound' ? c.from_number : c.to_number;
                return <div className="text-sm font-mono text-gray-600 cursor-pointer hover:underline hover:text-[#FE641F]" onClick={(e: any) => { e.stopPropagation(); setActiveCall(c); }}>{num}</div>;
            }
        },
        { key: "duration", label: "Duration", sortable: true, width: "w-[90px]", render: (c: any) => <span className="text-sm text-gray-700">{formatDuration(c.duration)}</span> },
        { key: "outcome", label: "Outcome", sortable: true, width: "w-[110px]", render: (c: any) => <Badge text={c.status} color={c.status === "completed" ? "green" : c.status.match(/missed|failed|busy|no-answer|canceled/i) ? "red" : "gray"} /> },
        {
            key: "disconnect_reason",
            label: "Disconnected By",
            width: "w-[130px]",
            render: (c: any) => {
                const reason = c.disconnect_reason;
                if (!reason) return <span className="font-sans text-xs text-gray-400">—</span>;
                const label = reason.charAt(0).toUpperCase() + reason.slice(1);
                const colorClass = reason === "agent" ? "bg-blue-50 text-blue-700" :
                    reason === "customer" ? "bg-orange-50 text-orange-700" :
                        reason === "system" ? "bg-gray-100 text-gray-700" :
                            "bg-gray-50 text-gray-600";
                return (
                    <span className={cn("font-sans text-[11px] font-medium px-2 py-1 rounded-md", colorClass)}>
                        {label}
                    </span>
                );
            }
        },
        {
            key: "actions",
            label: "Recording",
            width: "w-[110px]",
            render: (c: any) => {
                const hasRecording = !!(c.recording_url || c.recording_gcs_url);
                const isProcessing = c.status === "completed" && !hasRecording;

                return (
                    <div className="flex items-center gap-2">
                        {hasRecording && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveCall(c); }}
                                className="flex items-center justify-center gap-1 text-[#FE641F] hover:bg-[#FE641F]/10 px-2 py-1 rounded transition-colors text-xs font-medium"
                            >
                                <PlayCircle size={16} /> Play
                            </button>
                        )}
                        {isProcessing && (
                            <span className="text-amber-500 text-xs flex items-center gap-1"><span className="animate-spin text-xs">⏳</span> Proc.</span>
                        )}
                        {!hasRecording && !isProcessing && (
                            <span className="text-gray-400 text-xs">—</span>
                        )}
                    </div>
                );
            }
        },
    ];

    const searchCallLower = searchCall.toLowerCase();
    const filteredCalls = recentCalls.filter(c => {
        if (!searchCall) return true;
        const agentName = (c.agent_name || c.agent_id_str || "unknown").toLowerCase();
        const cid = (c.id || "").toLowerCase();
        const phone = (c.from_number || c.to_number || "").toLowerCase();
        const transcript = (c.transcript || "").toLowerCase();
        return agentName.includes(searchCallLower) || cid.includes(searchCallLower) || phone.includes(searchCallLower) || transcript.includes(searchCallLower);
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Organization Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your organization's activity and status.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <Card key={s.label} className="p-4 relative hover:shadow-md transition-shadow cursor-pointer">
                        {loading && <div className="absolute inset-0 bg-white/50 animate-pulse rounded-xl" />}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.color} transition-all`}>{s.value}</p>
                                <p className="text-xs text-gray-400 mt-1 min-h-[16px]">{s.change}</p>
                            </div>
                            <button className="text-xs text-[#FE641F] font-medium hover:underline">{s.action}</button>
                        </div>
                    </Card>
                ))}
            </div>

            <TableCard
                title="Recent Calls"
                columns={colsRecent}
                data={loadingCalls ? [] : filteredCalls.slice(0, 5)}
                keyExtractor={(c: any) => c.id}
                searchPlaceholder="Search Agent, Phone, ID..."
                searchValue={searchCall}
                onSearchChange={setSearchCall}
                onRowClick={(c: any) => setActiveCall(c)}
                primaryAction={<Link href="/admin/org/calls" className="text-xs text-[#FE641F] font-semibold hover:underline bg-[#FE641F]/10 px-3 py-1.5 rounded-lg flex items-center gap-1">Calls Overview <div className="text-lg leading-none mb-0.5">→</div></Link>}
            />

            <CallDetailModal
                isOpen={!!activeCall}
                call={activeCall as any}
                onClose={() => setActiveCall(null)}
            />

            {/* Temporarily hidden sections */}
            <div className="hidden">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> System Health</h4>
                    </Card>
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><Bell size={14} /> Action Items</h4>
                    </Card>
                </div>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-3">Recent Activity</h4>
                </Card>
            </div>
        </div>
    );
}
