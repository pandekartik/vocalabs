"use client";

import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Download, Play, CheckCircle, Clock } from "lucide-react";

// ── API Schema ─────────────────────────────────────────
interface Voicemail {
    id: string;
    call_id: string;
    recording_url: string;
    duration: number;
    transcript: string;
    from_number: string;
    status: string; // "pending" | "listened" | etc.
    created_at: string;
}

function formatDuration(secs: number) {
    if (!secs) return "0:00";
    return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;
}

function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "bg-[#B01313] text-white",
        listened: "bg-[#1DB013] text-white",
        assigned: "bg-[#1B4B8A] text-white",
    };
    const cls = map[status] ?? "bg-gray-200 text-gray-600";
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-medium ${cls}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
            {status}
        </div>
    );
}

export default function VoicemailQueuePage() {
    const [voicemails, setVoicemails] = useState<Voicemail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [markingId, setMarkingId] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 10;

    const fetchVoicemails = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("https://api.vocalabstech.com/supervisor/voicemails", {
                headers: {
                    accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setVoicemails(data);
            } else {
                console.error("Failed to fetch voicemails:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching voicemails:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVoicemails();
    }, []);

    const markListened = async (voicemailId: string) => {
        setMarkingId(voicemailId);
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch(
                `https://api.vocalabstech.com/supervisor/voicemails/${voicemailId}/mark-listened`,
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            if (response.ok) {
                // Optimistically update local state
                setVoicemails((prev) =>
                    prev.map((v) =>
                        v.id === voicemailId ? { ...v, status: "listened" } : v
                    )
                );
            } else {
                console.error("Failed to mark voicemail as listened:", response.statusText);
            }
        } catch (error) {
            console.error("Error marking voicemail:", error);
        } finally {
            setMarkingId(null);
        }
    };

    const formatDate = (isoStr: string) => {
        const d = new Date(isoStr);
        return d.toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const columns: TableColumn<Voicemail>[] = [
        {
            key: "from_number",
            label: "From",
            sortable: true,
            width: "w-[150px]",
            render: (vm) => (
                <span className="font-mono font-medium text-[#0C335C] text-sm">{vm.from_number || "—"}</span>
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
            key: "duration",
            label: "Duration",
            sortable: true,
            width: "w-[90px]",
            render: (vm) => (
                <span className="text-gray-600 font-mono text-sm">{formatDuration(vm.duration)}</span>
            ),
        },
        {
            key: "transcript",
            label: "Transcript",
            width: "flex-1 min-w-[180px]",
            render: (vm) => (
                <span className="text-xs text-gray-500 truncate block max-w-[360px]" title={vm.transcript}>
                    {vm.transcript || <span className="italic text-gray-300">No transcript</span>}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Received",
            sortable: true,
            width: "w-[150px]",
            render: (vm) => <span className="text-sm text-gray-400">{formatDate(vm.created_at)}</span>,
        },
        {
            key: "actions",
            label: "Actions",
            width: "w-[110px]",
            fixedRight: true,
            render: (vm) => (
                <div className="flex items-center gap-1 justify-center">
                    {vm.recording_url && (
                        <a
                            href={vm.recording_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-[#FE641F] transition-colors"
                            title="Play Recording"
                        >
                            <Play size={15} />
                        </a>
                    )}
                    {vm.status !== "listened" && (
                        <button
                            onClick={(e) => { e.stopPropagation(); markListened(vm.id); }}
                            disabled={markingId === vm.id}
                            className="p-2 rounded-xl hover:bg-black/10 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                            title="Mark as Listened"
                        >
                            {markingId === vm.id ? (
                                <Clock size={15} className="animate-spin" />
                            ) : (
                                <CheckCircle size={15} />
                            )}
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const filteredData = React.useMemo(() => {
        let result = voicemails;
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(
                (v) =>
                    (v.from_number ?? "").toLowerCase().includes(s) ||
                    (v.transcript ?? "").toLowerCase().includes(s)
            );
        }
        if (statusFilter !== "all") {
            result = result.filter((v) => v.status === statusFilter);
        }
        return result;
    }, [voicemails, search, statusFilter]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const hasActiveFilters = search !== "" || (statusFilter !== "" && statusFilter !== "all");
    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    const pendingCount = voicemails.filter((v) => v.status === "pending").length;
    const listenedCount = voicemails.filter((v) => v.status === "listened").length;

    return (
        <DashboardLayout>
            <div
                className="h-[calc(100vh-84px)] w-full flex flex-col p-6 overflow-hidden"
                style={{ background: "var(--background)" }}
            >
                <div className="flex-1 overflow-hidden relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                            <span className="text-4xl animate-spin">⏳</span>
                            <p className="mt-4 text-navy font-semibold">Loading voicemails...</p>
                        </div>
                    )}
                    <TableCard<Voicemail>
                        title="Voicemail Queue"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Voicemails" },
                        ]}
                        secondaryAction={
                            <button className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.3)] text-[#111] font-bold text-sm transition-colors hover:bg-black/5 bg-transparent">
                                <Download size={18} /> Export
                            </button>
                        }
                        searchPlaceholder="Search number or transcript..."
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
                                    { label: "Pending", value: "pending" },
                                    { label: "Listened", value: "listened" },
                                    { label: "Assigned", value: "assigned" },
                                ],
                            },
                        ]}
                        stats={[
                            { label: "Total", value: voicemails.length.toString(), valueColorClass: "text-[#0C335C]" },
                            { label: "Pending", value: pendingCount.toString(), valueColorClass: "text-red-600" },
                            { label: "Listened", value: listenedCount.toString(), valueColorClass: "text-green-600" },
                        ]}
                        columns={columns}
                        data={paginatedData}
                        keyExtractor={(vm) => vm.id}
                        selectable
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
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
        </DashboardLayout>
    );
}
