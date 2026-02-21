"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Card } from "@/components/ui/card";
import { Download, Phone } from "lucide-react";
import { MOCK_CALLS } from "@/app/test/components/mockData";

export default function CallsOverviewScreen() {
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

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

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
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Calls Overview</h1>
                <p className="text-sm text-gray-500">Analytics and history of all organizational calls.</p>
            </div>

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
