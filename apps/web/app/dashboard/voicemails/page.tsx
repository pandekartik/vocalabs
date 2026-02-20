"use client";

import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Download, Play, UserPlus, CheckCircle } from "lucide-react";
import { VoicemailPlayerModal } from "@/components/voicemails/VoicemailPlayerModal";
import { AssignVoicemailModal } from "@/components/voicemails/AssignVoicemailModal";

// ── Types ──────────────────────────────────────────────
interface Voicemail {
    id: string;
    caller: string;
    phone: string;
    duration: number;
    transcript: string;
    received: string;
    assignedTo: string;
    status: "Unheard" | "Heard" | "Assigned" | "Resolved";
    priority: "High" | "Normal" | "Low";
}

// ── Mock data ──────────────────────────────────────────
const VOICEMAILS: Voicemail[] = [
    { id: "v1", caller: "John Smith", phone: "+1-555-0123", duration: 154, transcript: "Hi, this is about my order renewal. I had a question about the pricing plan...", received: "10 min ago", assignedTo: "Sarah J.", status: "Unheard", priority: "High" },
    { id: "v2", caller: "+1-555-0456", phone: "+1-555-0456", duration: 87, transcript: "Calling to follow up on the demo we scheduled last Tuesday...", received: "32 min ago", assignedTo: "—", status: "Heard", priority: "Normal" },
    { id: "v3", caller: "Priya Sharma", phone: "+91-98765", duration: 213, transcript: "I need help with the integration, the API is returning a 503 error...", received: "1 hour ago", assignedTo: "—", status: "Unheard", priority: "High" },
    { id: "v4", caller: "Carlos Ruiz", phone: "+52-55-1234", duration: 45, transcript: "Just wanted to let you know I accepted the proposal...", received: "2 hours ago", assignedTo: "Mike C.", status: "Resolved", priority: "Low" },
    { id: "v5", caller: "+44-20-7946", phone: "+44-20-7946", duration: 178, transcript: "We're interested in upgrading to the enterprise tier for our team of 50...", received: "3 hours ago", assignedTo: "—", status: "Assigned", priority: "High" },
    { id: "v6", caller: "Thomas Baker", phone: "+1-555-0789", duration: 62, transcript: "Quick question about billing — I think there's a duplicate charge...", received: "4 hours ago", assignedTo: "—", status: "Unheard", priority: "Normal" },
];

function formatDuration(secs: number) {
    return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;
}

function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        Unheard: "bg-[#B01313]",
        Heard: "bg-[#F59E0B]",
        Assigned: "bg-[#1B4B8A]",
        Resolved: "bg-[#1DB013]",
    };
    const bg = map[status] ?? "bg-[#6B7280]";
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${bg}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            {status}
        </div>
    );
}

function PriorityPill({ priority }: { priority: string }) {
    const map: Record<string, string> = {
        High: "bg-red-100 text-red-700 border border-red-200",
        Normal: "bg-blue-100 text-blue-700 border border-blue-200",
        Low: "bg-gray-100 text-gray-600 border border-gray-200",
    };
    const cls = map[priority] ?? "bg-gray-100 text-gray-600";
    return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold ${cls}`}>
            {priority}
        </div>
    );
}

export default function VoicemailQueuePage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [playerVM, setPlayerVM] = useState<Voicemail | null>(null);
    const [assignVM, setAssignVM] = useState<Voicemail | null>(null);

    const ITEMS_PER_PAGE = 10;

    const columns: TableColumn<Voicemail>[] = [
        {
            key: "caller",
            label: "Caller",
            sortable: true,
            width: "w-[160px]",
            render: (vm) => (
                <div className="flex flex-col">
                    <span className="font-medium text-[#0C335C]">{vm.caller}</span>
                    <span className="text-xs text-gray-400 font-mono">{vm.phone}</span>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "w-[110px]",
            render: (vm) => <StatusPill status={vm.status} />,
        },
        {
            key: "priority",
            label: "Priority",
            sortable: true,
            width: "w-[100px]",
            render: (vm) => <PriorityPill priority={vm.priority} />,
        },
        {
            key: "duration",
            label: "Duration",
            sortable: true,
            width: "w-[90px]",
            render: (vm) => <span className="text-gray-600 font-mono text-sm">{formatDuration(vm.duration)}</span>,
        },
        {
            key: "transcript",
            label: "Transcript",
            width: "flex-1 min-w-[180px]",
            render: (vm) => (
                <span className="text-xs text-gray-500 truncate block max-w-[340px]" title={vm.transcript}>
                    {vm.transcript}
                </span>
            ),
        },
        {
            key: "received",
            label: "Received",
            sortable: true,
            width: "w-[120px]",
            render: (vm) => <span className="text-sm text-gray-400">{vm.received}</span>,
        },
        {
            key: "assignedTo",
            label: "Assigned To",
            sortable: true,
            width: "w-[120px]",
            render: (vm) => (
                <span className={`text-sm ${vm.assignedTo === "—" ? "text-gray-300 italic" : "text-gray-600 font-medium"}`}>
                    {vm.assignedTo}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            width: "w-[110px]",
            fixedRight: true,
            render: (vm) => (
                <div className="flex items-center gap-1 justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); setPlayerVM(vm); }}
                        className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#FE641F] transition-colors"
                        title="Play Recording"
                    >
                        <Play size={15} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setAssignVM(vm); }}
                        className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#0C335C] transition-colors"
                        title="Assign"
                    >
                        <UserPlus size={15} />
                    </button>
                </div>
            ),
        },
    ];

    const filteredData = React.useMemo(() => {
        let result = VOICEMAILS;
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(
                (v) =>
                    v.caller.toLowerCase().includes(s) ||
                    v.phone.includes(s) ||
                    v.transcript.toLowerCase().includes(s)
            );
        }
        if (statusFilter !== "all") {
            result = result.filter((v) => v.status.toLowerCase() === statusFilter.toLowerCase());
        }
        if (priorityFilter !== "all") {
            result = result.filter((v) => v.priority.toLowerCase() === priorityFilter.toLowerCase());
        }
        return result;
    }, [search, statusFilter, priorityFilter]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const hasActiveFilters =
        search !== "" ||
        (statusFilter !== "" && statusFilter !== "all") ||
        (priorityFilter !== "" && priorityFilter !== "all");

    const unheardCount = VOICEMAILS.filter((v) => v.status === "Unheard").length;
    const assignedCount = VOICEMAILS.filter((v) => v.assignedTo !== "—").length;
    const resolvedCount = VOICEMAILS.filter((v) => v.status === "Resolved").length;

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setCurrentPage(1);
    };

    return (
        <DashboardLayout>
            <div
                className="h-[calc(100vh-84px)] w-full flex flex-col p-6 overflow-hidden"
                style={{ background: "var(--background)" }}
            >
                <div className="flex-1 overflow-hidden">
                    <TableCard<Voicemail>
                        title="Voicemail Queue"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Voicemails" },
                        ]}
                        primaryAction={
                            <button
                                disabled={selectedKeys.size === 0}
                                className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm transition-colors hover:bg-[#e55a1b] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <UserPlus size={18} /> Assign Selected
                            </button>
                        }
                        secondaryAction={
                            <button className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.3)] text-[#111] font-bold text-sm transition-colors hover:bg-black/5 bg-transparent">
                                <Download size={18} /> Export
                            </button>
                        }
                        searchPlaceholder="Search caller, number or transcript..."
                        searchValue={search}
                        onSearchChange={setSearch}
                        onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
                        filters={[
                            {
                                key: "status",
                                label: "Status",
                                value: statusFilter,
                                onChange: setStatusFilter,
                                options: [
                                    { label: "Unheard", value: "unheard" },
                                    { label: "Heard", value: "heard" },
                                    { label: "Assigned", value: "assigned" },
                                    { label: "Resolved", value: "resolved" },
                                ],
                            },
                            {
                                key: "priority",
                                label: "Priority",
                                value: priorityFilter,
                                onChange: setPriorityFilter,
                                options: [
                                    { label: "High", value: "high" },
                                    { label: "Normal", value: "normal" },
                                    { label: "Low", value: "low" },
                                ],
                            },
                        ]}
                        stats={[
                            { label: "Total", value: VOICEMAILS.length.toString(), valueColorClass: "text-[#0C335C]" },
                            { label: "Unheard", value: unheardCount.toString(), valueColorClass: "text-red-600" },
                            { label: "Assigned", value: assignedCount.toString(), valueColorClass: "text-blue-600" },
                            { label: "Resolved", value: resolvedCount.toString(), valueColorClass: "text-green-600" },
                        ]}
                        columns={columns}
                        data={paginatedData}
                        keyExtractor={(vm) => vm.id}
                        selectable
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        onRowClick={(vm) => setPlayerVM(vm)}
                        pagination={{
                            currentPage,
                            itemsPerPage: ITEMS_PER_PAGE,
                            totalItems: filteredData.length,
                            totalPages,
                            onPageChange: setCurrentPage,
                        }}
                    />
                </div>
            </div>

            {playerVM && (
                <VoicemailPlayerModal
                    isOpen={true}
                    onClose={() => setPlayerVM(null)}
                    voicemail={{
                        id: playerVM.id,
                        callerName: playerVM.caller,
                        callerPhone: playerVM.phone,
                        durationSecs: playerVM.duration,
                        transcript: playerVM.transcript,
                        receivedAt: playerVM.received,
                        status: playerVM.status,
                        priority: playerVM.priority,
                    }}
                    onAssign={() => { setAssignVM(playerVM); setPlayerVM(null); }}
                />
            )}
            {assignVM && (
                <AssignVoicemailModal
                    isOpen={true}
                    onClose={() => setAssignVM(null)}
                    voicemail={{
                        callerName: assignVM.caller,
                        callerPhone: assignVM.phone,
                        durationSecs: assignVM.duration,
                    }}
                />
            )}
        </DashboardLayout>
    );
}
