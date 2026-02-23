"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, Loader2 } from "lucide-react";
import axios from "axios";

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
}

export default function CallHistoryScreen() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchCall, setSearchCall] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchCalls = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token") || "";
                const response = await axios.get("https://api.vocalabstech.com/calls", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 1000 }
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

    const cols: TableColumn<CallLog>[] = [
        { key: "id", label: "Call ID", width: "w-[130px]", render: (c) => <span className="font-mono text-xs text-gray-500">{c.id.substring(0, 8)}...</span> },
        { key: "timestamp", label: "Time", sortable: true, width: "w-[160px]", render: (c) => <span className="text-sm text-gray-600">{new Date(c.created_at).toLocaleString()}</span> },
        { key: "agent", label: "Agent", sortable: true, width: "w-[130px]", render: (c) => <span className="text-sm font-medium text-[#0C335C]">{c.agent_name || c.agent_id_str || 'Unknown'}</span> },
        { key: "phone", label: "Phone", width: "w-[140px]", render: (c) => <span className="text-sm font-mono text-gray-600">{c.direction === 'inbound' ? c.from_number : c.to_number}</span> },
        { key: "duration", label: "Duration", sortable: true, width: "w-[90px]", render: (c) => <span className="text-sm text-gray-700">{formatDuration(c.duration)}</span> },
        { key: "outcome", label: "Outcome", sortable: true, width: "w-[110px]", render: (c) => <Badge text={c.status} color={c.status === "completed" ? "green" : c.status.match(/missed|failed|busy|no-answer|canceled/i) ? "red" : "gray"} /> },
        { key: "recording", label: "Recording", width: "w-[120px]", render: (c) => (c.recording_url || c.recording_gcs_url) ? <a href={(c.recording_gcs_url || c.recording_url) as string} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:underline">Available</a> : <span className="text-xs text-gray-400">None</span> },
    ];

    const searchCallLower = searchCall.toLowerCase();
    const filteredCalls = calls.filter(c => {
        if (!searchCall) return true;
        const agentName = (c.agent_name || c.agent_id_str || "unknown").toLowerCase();
        const cid = (c.id || "").toLowerCase();
        const phone = (c.from_number || c.to_number || "").toLowerCase();
        return agentName.includes(searchCallLower) || cid.includes(searchCallLower) || phone.includes(searchCallLower);
    });

    const handleExportCSV = () => {
        let csv = "ID,Agent,Direction,Status,Format Duration,Created At\n";
        filteredCalls.forEach(c => {
            csv += `"${c.id}","${c.agent_name || ''}","${c.direction}","${c.status}","${formatDuration(c.duration)}","${new Date(c.created_at).toISOString()}"\n`;
        });
        const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
        const link = document.createElement("a");
        link.setAttribute("href", encoded);
        link.setAttribute("download", "org_calls_history_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-6">
            <TableCard
                title="Call History"
                breadcrumbs={[{ label: "Org Admin", href: "/admin/org" }, { label: "Calls Overview", href: "/admin/org/calls" }, { label: "Call History" }]}
                columns={cols}
                data={loading ? [] : filteredCalls.slice((currentPage - 1) * 10, currentPage * 10)}
                searchPlaceholder="Search by ID, Agent, Phone..."
                searchValue={searchCall}
                onSearchChange={setSearchCall}
                keyExtractor={(c) => c.id}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                secondaryAction={<button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Export CSV</button>}
                pagination={{ currentPage, itemsPerPage: 10, totalItems: filteredCalls.length, totalPages: Math.ceil(filteredCalls.length / 10) || 1, onPageChange: setCurrentPage }}
            />
        </div>
    );
}
