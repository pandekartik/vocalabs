"use client";

import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, PlayCircle, MessageSquare, Tag } from "lucide-react";
import { CALL_HISTORY_MOCK_DATA } from "./mock-data";
import { MobileCallCard } from "./components/MobileCallCard";
import { CallDetailModal } from "./components/CallDetailModal";
import { CallDirection, CallOutcome, RecordingStatus, CallRecord } from "./types";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CallHistoryPage() {
    const [data] = useState<CallRecord[]>(CALL_HISTORY_MOCK_DATA);
    const [search, setSearch] = useState("");
    const [directionFilter, setDirectionFilter] = useState("all");
    const [outcomeFilter, setOutcomeFilter] = useState("all");
    const [recordingFilter, setRecordingFilter] = useState("all");
    const [notesFilter, setNotesFilter] = useState("all");

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [activeCall, setActiveCall] = useState<CallRecord | null>(null);

    // Stats calculation
    const totalCalls = data.length;
    const totalDurationSeconds = data.reduce((acc, c) => acc + c.durationSeconds, 0);
    const avgDuration = totalCalls ? totalDurationSeconds / totalCalls : 0;
    const withNotes = data.filter(c => !!c.notes).length;
    const withTags = data.filter(c => c.tags.length > 0).length;

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
                <span className="font-mono text-xs bg-black/5 px-2 py-1 rounded text-gray-600">
                    {call.id}
                </span>
            )
        },
        {
            key: "timestamp",
            label: "Timestamp",
            sortable: true,
            width: "w-[150px]",
            render: (call) => {
                const d = new Date(call.timestamp);
                // Simplified formatting for mock purposes
                return <span>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>;
            }
        },
        {
            key: "direction",
            label: "Dir",
            sortable: true,
            width: "w-[80px]",
            render: (call) => (
                <span className="flex items-center justify-center w-full">
                    {call.direction === "Inbound" ? "📥" : "📤"}
                </span>
            )
        },
        {
            key: "phoneNumber",
            label: "Phone Number",
            sortable: true,
            width: "w-[150px]",
            render: (call) => (
                <span className="font-medium text-navy">{call.phoneNumber}</span>
            )
        },
        {
            key: "durationSeconds",
            label: "Duration",
            sortable: true,
            width: "w-[100px]",
            render: (call) => <span>{formatDurationCompact(call.durationSeconds)}</span>
        },
        {
            key: "outcome",
            label: "Outcome",
            sortable: true,
            width: "w-[120px]",
            render: (call) => {
                const bg = call.outcome === "Completed" ? "bg-green-100 text-green-800"
                    : call.outcome === "Missed" ? "bg-red-100 text-red-800"
                        : call.outcome === "Voicemail" ? "bg-amber-100 text-amber-800"
                            : call.outcome === "Failed" ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"; // In Progress

                return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${bg}`}>{call.outcome}</span>
            }
        },
        {
            key: "recordingStatus",
            label: "Rec.",
            width: "w-[80px]",
            render: (call) => {
                if (call.recordingStatus === "Available") return <span className="flex items-center text-xs text-red-600"><span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1" /> {formatDurationCompact(call.durationSeconds)}</span>;
                if (call.recordingStatus === "Processing") return <span className="text-xs text-amber-600">⏳ Proc...</span>;
                if (call.recordingStatus === "Failed") return <span className="text-xs text-red-500">⚠️ Fail</span>;
                return <span className="text-gray-400">—</span>;
            }
        },
        {
            key: "tags",
            label: "Tags",
            width: "w-[180px]",
            render: (call) => (
                <div className="flex items-center gap-1 overflow-hidden" title={call.tags.map((t: any) => t.name).join(', ')}>
                    {call.tags.slice(0, 2).map((tag: any, i: number) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded truncate max-w-[70px]">
                            {tag.name}
                        </span>
                    ))}
                    {call.tags.length > 2 && <span className="text-[10px] text-gray-400">+{call.tags.length - 2}</span>}
                    {call.tags.length === 0 && <span className="text-gray-400">—</span>}
                </div>
            )
        },
        {
            key: "notes",
            label: "Notes",
            width: "w-[200px]",
            render: (call) => (
                <div className="flex items-center gap-2 overflow-hidden w-full">
                    {call.notes ? (
                        <React.Fragment>
                            <MessageSquare size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate text-xs text-gray-600">{call.notes}</span>
                        </React.Fragment>
                    ) : <span className="text-gray-400 text-center w-full">—</span>}
                </div>
            )
        }
    ];

    // Apply filters
    const filteredData = data.filter(call => {
        if (search && !call.phoneNumber.includes(search) && !call.id.toLowerCase().includes(search.toLowerCase()) && !call.notes.toLowerCase().includes(search.toLowerCase())) return false;
        if (directionFilter !== "all" && call.direction.toLowerCase() !== directionFilter.toLowerCase()) return false;
        if (outcomeFilter !== "all" && call.outcome.toLowerCase() !== outcomeFilter.toLowerCase()) return false;
        if (recordingFilter === "with" && call.recordingStatus !== "Available") return false;
        if (recordingFilter === "without" && call.recordingStatus === "Available") return false;
        if (notesFilter === "with" && !call.notes) return false;
        if (notesFilter === "without" && call.notes) return false;
        return true;
    });

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-84px)] w-full flex flex-col p-6 overflow-hidden bg-[#FAFAFA]">

                {/* Top Banner specific to this page if any, or it could all be in TableCard. 
          The requirement asks for Quick Stats Bar, we can pass it into TableCard's stats. */}

                <div className="flex-1 overflow-hidden">
                    {/* Desktop View */}
                    <div className="hidden md:block h-full">
                        <TableCard
                            title="Call History"
                            primaryAction={
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                    <Download size={16} /> Export
                                </button>
                            }
                            searchPlaceholder="Search by phone, call ID, or note..."
                            searchValue={search}
                            onSearchChange={setSearch}
                            onClearFilters={() => {
                                setSearch("");
                                setDirectionFilter("all");
                                setOutcomeFilter("all");
                                setRecordingFilter("all");
                                setNotesFilter("all");
                                setSelectedKeys(new Set());
                            }}
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
                                },
                                {
                                    key: "recording",
                                    label: "Recording",
                                    value: recordingFilter,
                                    options: [{ label: "With Recording", value: "with" }, { label: "Without Recording", value: "without" }],
                                    onChange: setRecordingFilter
                                },
                                {
                                    key: "notes",
                                    label: "Notes",
                                    value: notesFilter,
                                    options: [{ label: "With Notes", value: "with" }, { label: "Without Notes", value: "without" }],
                                    onChange: setNotesFilter
                                }
                                // Date picker omitted for simplicity, but could be added easily
                            ]}
                            stats={[
                                { label: "Total Calls", value: <span className="flex items-center gap-1">📞 {totalCalls}</span>, valueColorClass: "text-blue-600" },
                                { label: "Total Duration", value: <span className="flex items-center gap-1">⏱️ {formatHrsMins(totalDurationSeconds)}</span>, valueColorClass: "text-purple-600" },
                                { label: "Avg Duration", value: <span className="flex items-center gap-1">📊 {formatDurationCompact(avgDuration)}</span>, valueColorClass: "text-green-600" },
                                { label: "With Notes", value: <span className="flex items-center gap-1">📝 {withNotes}</span>, valueColorClass: "text-orange-600" },
                                { label: "With Tags", value: <span className="flex items-center gap-1">🏷️ {withTags}</span>, valueColorClass: "text-teal-600" },
                            ]}
                            columns={columns}
                            data={filteredData}
                            keyExtractor={(call) => call.id}
                            selectable
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            onRowClick={(call) => setActiveCall(call)}
                            pagination={{
                                currentPage: 1,
                                totalPages: Math.ceil(filteredData.length / 20),
                                totalItems: filteredData.length,
                                itemsPerPage: 20,
                                onPageChange: () => { }
                            }}
                        />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden h-full flex flex-col overflow-y-auto gap-4 pb-20">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-navy">Call History</h1>
                        </div>

                        <div className="flex flex-col gap-2">
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
                                            setRecordingFilter("all");
                                            setNotesFilter("all");
                                        }}
                                        className="mt-2 text-brand text-sm hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
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
