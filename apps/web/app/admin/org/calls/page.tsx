"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Card } from "@/components/ui/card";
import { PlayCircle, Download, FileText, XCircle, AlertTriangle, CheckCircle2, Clock, Phone, Loader2, Search } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { CallDetailModal } from "@/app/call-history/components/CallDetailModal";

interface CallLog {
    id: string;
    call_sid: string | null;
    stream_sid: string | null;
    direction: string;
    status: string;
    from_number: string | null;
    to_number: string | null;
    agent_number: string | null;
    agent_name: string | null;
    agent_id_str: string | null;
    duration: number | null;
    duration_formatted: string | null;
    recording_url: string | null;
    recording_gcs_url: string | null;
    created_at: string;
    disconnect_reason: string | null;
    agent_notes: string;
    tags: string;
    started_at: string;
    ended_at: string;
    ai_summary: string;
    overall_sentiment: string;
    transcript: string;
}

export default function CallsOverviewScreen() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [activeCall, setActiveCall] = useState<CallLog | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Search states
    const [searchAgent, setSearchAgent] = useState("");
    const [searchCall, setSearchCall] = useState("");

    useEffect(() => {
        const fetchCalls = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token") || "";
                const response = await axios.get("https://api.vocalabstech.com/calls", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 1000 } // Fetching a larger batch for accurate org-wide aggregation
                });
                setCalls(response.data);
            } catch (error) {
                console.error("Failed to fetch calls for org", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalls();
    }, []);

    // Helper to format raw seconds to MM:SS
    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "0s";
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    // Calculate Top-Level Stats
    const totalCalls = calls.length;
    const inboundCalls = calls.filter(c => c.direction === "inbound").length;
    const outboundCalls = calls.filter(c => c.direction === "outbound").length;
    const completedCalls = calls.filter(c => c.status === "completed").length;
    const missedCalls = calls.filter(c => ["missed", "failed", "no-answer", "canceled", "busy"].includes(c.status.toLowerCase())).length;

    const validDurations = calls.filter(c => c.duration !== null).map(c => c.duration as number);
    const totalDurationSeconds = validDurations.reduce((a, b) => a + b, 0);
    const avgDurationSeconds = totalCalls > 0 ? Math.round(totalDurationSeconds / totalCalls) : 0;

    const callStats = [
        { label: "Total Calls", value: loading ? "-" : totalCalls.toString(), sub: "Last 30 days", color: "text-[#0C335C]" },
        { label: "Inbound", value: loading ? "-" : `${inboundCalls} (${totalCalls ? Math.round((inboundCalls / totalCalls) * 100) : 0}%)`, sub: "—", color: "text-blue-600" },
        { label: "Outbound", value: loading ? "-" : `${outboundCalls} (${totalCalls ? Math.round((outboundCalls / totalCalls) * 100) : 0}%)`, sub: "—", color: "text-[#FE641F]" },
        { label: "Completed", value: loading ? "-" : `${completedCalls} (${totalCalls ? Math.round((completedCalls / totalCalls) * 100) : 0}%)`, sub: "—", color: "text-green-600" },
        { label: "Missed/Failed", value: loading ? "-" : `${missedCalls} (${totalCalls ? Math.round((missedCalls / totalCalls) * 100) : 0}%)`, sub: "—", color: "text-red-600" },
        { label: "Avg Duration", value: loading ? "-" : formatDuration(avgDurationSeconds), sub: "—", color: "text-[#0C335C]" },
    ];

    // Aggregate calls by Agent
    const agentMap: Record<string, { calls: number, duration: number, completed: number }> = {};
    calls.forEach(c => {
        const agent = c.agent_name || c.agent_id_str || "System/Unknown";
        if (!agentMap[agent]) agentMap[agent] = { calls: 0, duration: 0, completed: 0 };
        agentMap[agent].calls += 1;
        if (c.duration) agentMap[agent].duration += c.duration;
        if (c.status === "completed") agentMap[agent].completed += 1;
    });

    const byAgentRaw = Object.keys(agentMap).map(agent => {
        const data = agentMap[agent] || { calls: 0, duration: 0, completed: 0 };
        const avg = data.calls > 0 ? Math.round(data.duration / data.calls) : 0;
        const rateCalc = data.calls > 0 ? Math.round((data.completed / data.calls) * 100) : 0;

        let hrs = Math.floor(data.duration / 3600);
        let mins = Math.floor((data.duration % 3600) / 60);
        const durationStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m ${data.duration % 60}s`;

        return { agent, calls: data.calls, duration: durationStr, avg: formatDuration(avg), rate: `${rateCalc}%`, rateNum: rateCalc };
    }).sort((a, b) => b.calls - a.calls); // Sort by highest calls first

    const byAgent = byAgentRaw.filter(a => !searchAgent || a.agent.toLowerCase().includes(searchAgent.toLowerCase())); // Search Filter

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

    const colsRecent: TableColumn<CallLog>[] = [
        { key: "id", label: "Call ID", width: "w-[130px]", render: (c) => <span className="font-mono text-xs text-gray-500">{c.id.substring(0, 8)}...</span> },
        { key: "timestamp", label: "Time", sortable: true, width: "w-[160px]", render: (c) => <span className="text-sm text-gray-600">{new Date(c.created_at).toLocaleString()}</span> },
        {
            key: "agent",
            label: "Agent",
            sortable: true,
            width: "w-[130px]",
            render: (c) => {
                const identifier = c.agent_name || c.agent_id_str || 'unknown';
                return (
                    <Link href={`/admin/org/calls/agents/${encodeURIComponent(identifier)}`} className="text-sm font-medium text-[#0C335C] hover:underline" onClick={(e) => e.stopPropagation()}>
                        {identifier === 'unknown' ? 'Unknown' : (c.agent_name || c.agent_id_str)}
                    </Link>
                );
            }
        },
        {
            key: "phone", label: "Phone", width: "w-[140px]", render: (c) => {
                const num = c.direction === 'inbound' ? c.from_number : c.to_number;
                return <div className="text-sm font-mono text-gray-600 cursor-pointer hover:underline hover:text-[#FE641F]" onClick={(e) => { e.stopPropagation(); setActiveCall(c); }}>{num}</div>;
            }
        },
        { key: "duration", label: "Duration", sortable: true, width: "w-[90px]", render: (c) => <span className="text-sm text-gray-700">{formatDuration(c.duration)}</span> },
        { key: "outcome", label: "Outcome", sortable: true, width: "w-[110px]", render: (c) => <Badge text={c.status} color={c.status === "completed" ? "green" : c.status.match(/missed|failed|busy|no-answer|canceled/i) ? "red" : "gray"} /> },
        {
            key: "disconnect_reason",
            label: "Disconnected By",
            width: "w-[130px]",
            render: (c) => {
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
            render: (c) => {
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

    const handleExportCSV = () => {
        let csv = "ID,Agent,Direction,Status,Format Duration,Created At\n";
        calls.forEach(c => {
            csv += `"${c.id}","${c.agent_name || ''}","${c.direction}","${c.status}","${formatDuration(c.duration)}","${new Date(c.created_at).toISOString()}"\n`;
        });
        const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
        const link = document.createElement("a");
        link.setAttribute("href", encoded);
        link.setAttribute("download", "org_calls_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const searchCallLower = searchCall.toLowerCase();
    const filteredCalls = calls.filter(c => {
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
                <h1 className="text-2xl font-bold text-[#0C335C]">Calls Overview</h1>
                <p className="text-sm text-gray-500">Analytics and history of all organizational calls.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {callStats.map(s => (
                    <Card key={s.label} className="p-4"><p className="text-xs text-gray-500">{s.label}</p><div className={`text-xl font-bold mt-1 ${s.color} flex items-center`}>{s.value}{loading && <Loader2 size={16} className="ml-2 animate-spin text-gray-300" />}</div></Card>
                ))}
            </div>

            <Card className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-[#0C335C]">Calls by Agent</h4>
                    <Link href="/admin/org/calls/agents" className="text-sm font-medium text-[#FE641F] hover:underline">View All {"->"}</Link>
                </div>

                <div className="flex items-center gap-2 mb-4 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 w-full md:w-64">
                    <Search size={16} className="text-gray-400" />
                    <input type="text" placeholder="Search agents..." value={searchAgent} onChange={(e) => setSearchAgent(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full" />
                </div>

                {loading ? (
                    <div className="h-32 flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 text-left border-b border-gray-100">{["Agent", "Calls", "Total Duration", "Avg Duration", "Completion Rate"].map(h => <th key={h} className="pb-2 pr-6">{h}</th>)}</tr></thead>
                            <tbody>
                                {byAgent.length === 0 ? <tr><td colSpan={5} className="py-6 text-center text-gray-500">No agents match your search.</td></tr> : null}
                                {byAgent.map(a => (
                                    <tr key={a.agent} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                        <td className="py-2.5 pr-6 font-medium text-[#0C335C] truncate max-w-[150px]">
                                            <Link href={`/admin/org/calls/agents/${encodeURIComponent(a.agent)}`} className="hover:underline hover:text-[#FE641F] block w-full">
                                                {a.agent}
                                            </Link>
                                        </td>
                                        <td className="py-2.5 pr-6">{a.calls}</td>
                                        <td className="py-2.5 pr-6 font-mono">{a.duration}</td>
                                        <td className="py-2.5 pr-6 font-mono">{a.avg}</td>
                                        <td className="py-2.5"><Badge text={a.rate} color={a.rateNum > 80 ? "green" : a.rateNum > 50 ? "amber" : "red"} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <TableCard
                title="Recent Calls"
                columns={colsRecent}
                data={loading ? [] : filteredCalls.slice(0, 10)}
                keyExtractor={(c) => c.id}
                searchPlaceholder="Search Agent, Phone, ID..."
                searchValue={searchCall}
                onSearchChange={setSearchCall}
                onRowClick={(c) => setActiveCall(c)}
                primaryAction={<Link href="/admin/org/calls/history" className="text-xs text-[#FE641F] font-semibold hover:underline bg-[#FE641F]/10 px-3 py-1.5 rounded-lg flex items-center gap-1">View All History <div className="text-lg leading-none mb-0.5">→</div></Link>}
            />

            <CallDetailModal
                isOpen={!!activeCall}
                call={activeCall as any}
                onClose={() => setActiveCall(null)}
            />
        </div>
    );
}
