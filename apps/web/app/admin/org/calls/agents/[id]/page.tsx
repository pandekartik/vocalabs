"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, PlayCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { CallDetailModal } from "@/app/call-history/components/CallDetailModal";
import { cn } from "@repo/ui/lib/utils";

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

export default function AgentSpecificCallsScreen({ params }: { params: { id: string } }) {
    const rawId = decodeURIComponent(params.id);
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchCall, setSearchCall] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [activeCall, setActiveCall] = useState<CallLog | null>(null);

    useEffect(() => {
        const fetchCalls = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token") || "";
                const response = await axios.get("https://api.vocalabstech.com/calls", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 1000 }
                });

                // Filter down to just this specific agent based on the URL parameter string matching
                const filtered = response.data.filter((c: CallLog) => {
                    const agentLabel = c.agent_name || c.agent_id_str || 'unknown';
                    return agentLabel === rawId;
                });

                setCalls(filtered);
            } catch (error) {
                console.error("Failed to fetch calls for org", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalls();
    }, [rawId]);

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "0s";
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const cols: TableColumn<CallLog>[] = [
        { key: "id", label: "Call ID", width: "w-[130px]", render: (c) => <span className="font-mono text-xs text-gray-500">{c.id.substring(0, 8)}...</span> },
        { key: "timestamp", label: "Time", sortable: true, width: "w-[160px]", render: (c) => <span className="text-sm text-gray-600">{new Date(c.created_at).toLocaleString()}</span> },
        {
            key: "phone", label: "Phone", width: "w-[140px]", render: (c) => {
                const num = c.direction === 'inbound' ? c.from_number : c.to_number;
                return <div className="text-sm font-mono text-gray-600 cursor-pointer hover:underline hover:text-[#FE641F]" onClick={(e) => { e.stopPropagation(); setActiveCall(c); }}>{num}</div>;
            }
        },
        { key: "duration", label: "Duration", sortable: true, width: "w-[90px]", render: (c) => <span className="text-sm text-gray-700">{formatDuration(c.duration)}</span> },
        { key: "outcome", label: "Outcome", sortable: true, width: "w-[110px]", render: (c) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === "completed" ? "bg-green-100 text-green-800" : c.status.match(/missed|failed|busy|no-answer|canceled/i) ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{c.status}</span> },
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

    const searchCallLower = searchCall.toLowerCase();
    const filteredCalls = calls.filter(c => {
        if (!searchCall) return true;
        const cid = (c.id || "").toLowerCase();
        const phone = (c.from_number || c.to_number || "").toLowerCase();
        return cid.includes(searchCallLower) || phone.includes(searchCallLower);
    });

    const handleExportCSV = () => {
        let csv = "ID,Agent,Direction,Status,Format Duration,Created At\n";
        filteredCalls.forEach(c => {
            csv += `"${c.id}","${c.agent_name || ''}","${c.direction}","${c.status}","${formatDuration(c.duration)}","${new Date(c.created_at).toISOString()}"\n`;
        });
        const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
        const link = document.createElement("a");
        link.setAttribute("href", encoded);
        link.setAttribute("download", `org_calls_agent_${rawId}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-6">
            <TableCard
                title={`Calls by ${rawId === 'unknown' ? 'Unknown' : rawId}`}
                breadcrumbs={[
                    { label: "Org Admin", href: "/admin/org" },
                    { label: "Calls Overview", href: "/admin/org/calls" },
                    { label: "Agent Metrics", href: "/admin/org/calls/agents" },
                    { label: rawId }
                ]}
                columns={cols}
                data={loading ? [] : filteredCalls.slice((currentPage - 1) * 10, currentPage * 10)}
                searchPlaceholder="Search by ID or Phone..."
                searchValue={searchCall}
                onSearchChange={setSearchCall}
                keyExtractor={(c) => c.id}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onRowClick={(c) => setActiveCall(c)}
                secondaryAction={<button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Export CSV</button>}
                pagination={{ currentPage, itemsPerPage: 10, totalItems: filteredCalls.length, totalPages: Math.ceil(filteredCalls.length / 10) || 1, onPageChange: setCurrentPage }}
            />

            <CallDetailModal
                isOpen={!!activeCall}
                call={activeCall as any}
                onClose={() => setActiveCall(null)}
            />
        </div>
    );
}
