"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, Loader2 } from "lucide-react";
import axios from "axios";

interface CallLog {
    id: string;
    direction: string;
    status: string;
    agent_name: string | null;
    agent_id_str: string | null;
    duration: number | null;
}

export default function AgentsMetricsScreen() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchAgent, setSearchAgent] = useState("");
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
    }).sort((a, b) => b.calls - a.calls);

    const filteredAgents = byAgentRaw.filter(a => !searchAgent || a.agent.toLowerCase().includes(searchAgent.toLowerCase()));

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

    const cols: TableColumn<typeof byAgentRaw[0]>[] = [
        { key: "agent", label: "Agent Name", sortable: true, width: "w-[200px]", render: (a) => <span className="font-medium text-[#0C335C]">{a.agent}</span> },
        { key: "calls", label: "Total Calls", sortable: true, width: "w-[120px]" },
        { key: "duration", label: "Total Duration", sortable: true, width: "w-[150px]", render: (a) => <span className="font-mono text-gray-700">{a.duration}</span> },
        { key: "avg", label: "Average Duration", sortable: true, width: "w-[150px]", render: (a) => <span className="font-mono text-gray-700">{a.avg}</span> },
        { key: "rate", label: "Completion Rate", sortable: true, width: "w-[150px]", render: (a) => <Badge text={a.rate} color={a.rateNum > 80 ? "green" : a.rateNum > 50 ? "amber" : "red"} /> },
    ];

    const handleExportCSV = () => {
        let csv = "Agent,Total Calls,Total Duration,Avg Duration,Completion Rate\n";
        filteredAgents.forEach(a => {
            csv += `"${a.agent}","${a.calls}","${a.duration}","${a.avg}","${a.rate}"\n`;
        });
        const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
        const link = document.createElement("a");
        link.setAttribute("href", encoded);
        link.setAttribute("download", "agent_metrics_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-6">
            <TableCard
                title="Agent Metrics"
                breadcrumbs={[{ label: "Org Admin", href: "/admin/org" }, { label: "Calls Overview", href: "/admin/org/calls" }, { label: "Agent Metrics" }]}
                columns={cols}
                data={loading ? [] : filteredAgents.slice((currentPage - 1) * 10, currentPage * 10)}
                searchPlaceholder="Search agents by name..."
                searchValue={searchAgent}
                onSearchChange={setSearchAgent}
                keyExtractor={(a) => a.agent}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                secondaryAction={<button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Export CSV</button>}
                pagination={{ currentPage, itemsPerPage: 10, totalItems: filteredAgents.length, totalPages: Math.ceil(filteredAgents.length / 10) || 1, onPageChange: setCurrentPage }}
            />
        </div>
    );
}
