"use client";

import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, PlayCircle, MessageSquare, Tag } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

import { MobileCallCard } from "./components/MobileCallCard";
import { CallDetailModal } from "./components/CallDetailModal";
import { CallDirection, CallOutcome, RecordingStatus, CallRecord } from "./types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";

export default function CallHistoryPage() {
    const router = useRouter();
    const [data, setData] = useState<CallRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [directionFilter, setDirectionFilter] = useState("all");
    const [outcomeFilter, setOutcomeFilter] = useState("all");

    React.useEffect(() => {
        const fetchCalls = async () => {
            try {
                // Read token from localStorage if available, or just rely on secure cookies if that's how it's handled.
                // Assuming bearer token needs to be passed, using a placeholder or common retrieval method
                // For this example, relying on the browser to send cookies, or extracting from local storage
                const token = localStorage.getItem('token') || '';

                const response = await fetch('https://api.vocalabstech.com/calls/my-calls', {
                    headers: {
                        'accept': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    console.error("Failed to fetch calls", response.statusText);
                    setData([]);
                }
            } catch (error) {
                console.error("Error fetching calls:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCalls();
    }, []);

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [activeCall, setActiveCall] = useState<CallRecord | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    // Stats calculation
    const totalCalls = data.length;
    const totalDurationSeconds = data.reduce((acc, c) => acc + c.duration, 0);

    const formatDurationCompact = (sec: number) => {
        if (!sec) return "—";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        if (m === 0) return `${s}s`;
        return `${m}m ${s}s`;
    };

    const formatHrsMins = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const columns: TableColumn<CallRecord>[] = [
        {
            key: "id",
            label: "Call ID",
            sortable: true,
            width: "w-[120px]",
            render: (call) => (
                <span className="font-sans text-sm text-[#0C335C] font-semibold">
                    {call.id}
                </span>
            )
        },
        {
            key: "phoneNumber",
            label: "Number",
            sortable: true,
            width: "w-[140px]",
            render: (call) => {
                const num = call.direction === "inbound" ? call.from_number : call.to_number;
                return <span className="font-sans text-sm text-[#0C335C] font-medium">{num}</span>;
            }
        },
        {
            key: "timestamp",
            label: "Timestamp",
            sortable: true,
            width: "w-[160px]",
            render: (call) => {
                const d = new Date(call.started_at);
                return <span className="font-sans text-sm text-[#111] font-normal opacity-70">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>;
            }
        },
        {
            key: "durationSeconds",
            label: "Duration",
            sortable: true,
            width: "w-[100px]",
            render: (call) => <span className="font-sans text-sm text-[#111] font-normal opacity-70">{formatDurationCompact(call.duration)}</span>
        },
        {
            key: "direction",
            label: "Direction",
            sortable: true,
            width: "w-[100px]",
            render: (call) => (
                <span className="flex items-center text-sm font-sans text-[#111] opacity-80 capitalize">
                    {call.direction}
                </span>
            )
        },
        {
            key: "tags",
            label: "Tagging IDs",
            width: "w-[160px]",
            render: (call) => {
                let parsedTags: any[] = [];
                try {
                    parsedTags = JSON.parse(call.tags || "[]");
                } catch (e) { }

                return (
                    <div className="flex items-center gap-1 overflow-hidden" title={parsedTags.map(t => t.id || t.name).join(', ')}>
                        {parsedTags.slice(0, 2).map((tag: any, i: number) => (
                            <span key={i} className="font-sans text-[10px] bg-black/5 text-[#0C335C] px-2 py-1 rounded truncate max-w-[70px]">
                                {tag.id || tag.name}
                            </span>
                        ))}
                        {parsedTags.length > 2 && <span className="font-sans text-[10px] text-gray-400 bg-black/5 px-2 py-1 rounded">+{parsedTags.length - 2}</span>}
                        {parsedTags.length === 0 && <span className="font-sans text-[12px] text-gray-400">—</span>}
                    </div>
                );
            }
        },
        {
            key: "notes",
            label: "Notes",
            width: "flex-1 min-w-[150px]", // Use generic flex for notes since it can be long
            render: (call) => (
                <div className="flex items-center gap-2 overflow-hidden w-full" title={call.agent_notes}>
                    {call.agent_notes ? (
                        <React.Fragment>
                            <span className="truncate font-sans text-xs text-[#111] font-normal opacity-70">{call.agent_notes}</span>
                        </React.Fragment>
                    ) : <span className="font-sans text-xs text-gray-400">—</span>}
                </div>
            )
        },
        {
            key: "disconnect_reason",
            label: "Disconnected By",
            width: "w-[120px]",
            render: (call) => {
                const reason = call.disconnect_reason;
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
            label: "Actions",
            width: "w-[90px]",
            fixedRight: true,
            render: (call) => {
                const hasRecording = !!call.recording_url;
                const isProcessing = call.status === "completed" && !hasRecording;

                return (
                    <div className="flex items-center gap-2">
                        {hasRecording && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveCall(call); }}
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
        }
    ];

    // Apply filters
    const filteredData = data.filter(call => {
        const num = call.direction === "inbound" ? call.from_number : call.to_number;
        if (search && !num?.includes(search) && !call.id.toLowerCase().includes(search.toLowerCase()) && !call.agent_notes?.toLowerCase().includes(search.toLowerCase())) return false;
        if (directionFilter !== "all" && call.direction.toLowerCase() !== directionFilter.toLowerCase()) return false;
        if (outcomeFilter !== "all" && call.status.toLowerCase() !== outcomeFilter.toLowerCase()) return false;
        return true;
    });

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const handleClearFilters = () => {
        setSearch("");
        setDirectionFilter("all");
        setOutcomeFilter("all");
        setCurrentPage(1);
    };

    const hasActiveFilters = search || directionFilter !== "all" || outcomeFilter !== "all";

    const exportToCSV = () => {
        if (!data || data.length === 0) return;

        // Define CSV headers
        const headers = ["Call ID", "From Number", "To Number", "Direction", "Status", "Duration (sec)", "Started At", "Agent Notes", "Tags", "Recording URL"];

        // Convert data to CSV rows
        const csvRows = [
            headers.join(','),
            ...data.map(call => {
                let tagsStr = "";
                try {
                    const tagsArr = JSON.parse(call.tags || "[]");
                    tagsStr = tagsArr.map((t: any) => t.id || t.name).join(' | ');
                } catch (e) { }

                return [
                    `"${call.id}"`,
                    `"${call.from_number}"`,
                    `"${call.to_number}"`,
                    `"${call.direction}"`,
                    `"${call.status}"`,
                    `${call.duration}`,
                    `"${new Date(call.started_at).toISOString()}"`,
                    `"${call.agent_notes ? call.agent_notes.replace(/"/g, '""') : ''}"`,
                    `"${tagsStr}"`,
                    `"${call.recording_url || ''}"`
                ].join(',');
            })
        ];

        // Create Blob and download
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `call_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-84px)] w-full flex flex-col p-6 overflow-hidden" style={{ background: "var(--background)" }}>

                {/* Top Banner specific to this page if any, or it could all be in TableCard. 
          The requirement asks for Quick Stats Bar, we can pass it into TableCard's stats. */}

                <div className="flex-1 overflow-hidden">
                    {/* Desktop View */}
                    <div className="hidden md:block h-full relative">
                        {isLoading ? (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl border border-black/5 shadow-sm">
                                <span className="text-4xl animate-spin">⏳</span>
                                <p className="mt-4 text-navy font-semibold">Loading calls...</p>
                            </div>
                        ) : null}
                        <TableCard
                            title="Call History"
                            breadcrumbs={[
                                { label: "Home", href: "/" },
                                { label: "Call History" }
                            ]}
                            primaryAction={
                                <button
                                    onClick={() => router.push('/')}
                                    className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white text-center font-sans text-sm font-bold leading-[20px] transition-colors hover:bg-[#e55a1b]"
                                >
                                    <PlayCircle size={20} /> New Call
                                </button>
                            }
                            secondaryAction={
                                <button
                                    onClick={exportToCSV}
                                    className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.3)] text-[#111] text-center font-sans text-sm font-bold leading-[20px] transition-colors hover:bg-black/5 bg-transparent"
                                >
                                    <Download size={20} /> Export
                                </button>
                            }
                            searchPlaceholder="Search phone, ID..."
                            searchValue={search}
                            onSearchChange={setSearch}
                            onClearFilters={hasActiveFilters ? () => {
                                handleClearFilters();
                                setSelectedKeys(new Set());
                            } : undefined}
                            filters={[
                                {
                                    key: "direction",
                                    label: "Direction",
                                    value: directionFilter,
                                    options: [{ label: "Inbound", value: "inbound" }, { label: "Outbound", value: "outbound" }],
                                    onChange: setDirectionFilter
                                },
                                {
                                    key: "outcome",
                                    label: "Outcome",
                                    value: outcomeFilter,
                                    options: [
                                        { label: "Completed", value: "completed" },
                                        { label: "Missed", value: "missed" },
                                        { label: "Voicemail", value: "voicemail" },
                                        { label: "Failed", value: "failed" }
                                    ],
                                    onChange: setOutcomeFilter
                                }
                                // Date picker omitted for simplicity, but could be added easily
                            ]}
                            stats={[
                                { label: "Total Calls", value: totalCalls.toString(), valueColorClass: "text-[#0C335C]" },
                                { label: "Total Duration", value: formatHrsMins(totalDurationSeconds), valueColorClass: "text-[#FE641F]" },
                            ]}
                            columns={columns}
                            data={paginatedData}
                            keyExtractor={(call) => call.id}
                            selectable
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            onRowClick={(call) => setActiveCall(call)}
                            onInfoClick={(call) => setActiveCall(call)}
                            pagination={{
                                currentPage: currentPage,
                                totalPages: totalPages,
                                totalItems: filteredData.length,
                                itemsPerPage: ITEMS_PER_PAGE,
                                onPageChange: setCurrentPage
                            }}
                        />
                    </div>

                    <div className="md:hidden h-full flex flex-col overflow-y-auto gap-4 pb-20">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-navy">Call History</h1>
                        </div>

                        <div className="flex flex-col gap-2">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <span className="text-2xl animate-spin">⏳</span>
                                    <p className="mt-4 text-navy font-medium">Loading calls...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredData.map(call => (
                                        <MobileCallCard
                                            key={call.id}
                                            call={call}
                                            onClick={() => setActiveCall(call)}
                                            selectable
                                            isSelected={selectedKeys.has(call.id)}
                                            onSelect={(checked) => {
                                                const newKeys = new Set(selectedKeys);
                                                if (checked) newKeys.add(call.id);
                                                else newKeys.delete(call.id);
                                                setSelectedKeys(newKeys);
                                            }}
                                        />
                                    ))}
                                    {filteredData.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            <span className="text-4xl">🔍</span>
                                            <p className="mt-4 text-navy font-medium">No calls match your criteria</p>
                                            <button
                                                onClick={() => {
                                                    setSearch("");
                                                    setDirectionFilter("all");
                                                    setOutcomeFilter("all");
                                                }}
                                                className="mt-2 text-brand text-sm hover:underline"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <CallDetailModal
                    isOpen={!!activeCall}
                    call={activeCall}
                    onClose={() => setActiveCall(null)}
                />
            </div>
        </DashboardLayout>
    );
}
