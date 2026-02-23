"use client";

import React, { useState, useEffect, useRef } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Download, Play, Pause, CheckCircle, Clock, Volume2, X } from "lucide-react";

// ── API Schema ─────────────────────────────────────────
interface Voicemail {
    id: string;
    call_id: string;
    recording_url: string;
    recording_gcs_url: string | null;
    duration: number;
    transcript: string;
    from_number: string;
    status: string;
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

// ── Inline Audio Player Component ──────────────────────
function InlinePlayer({ src, onClose }: { src: string; onClose: () => void }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        // Auto-play on mount
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (sec: number) => {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-6 py-3 flex items-center gap-4">
            <button
                onClick={togglePlay}
                className="h-10 w-10 shrink-0 bg-[#FE641F] text-white rounded-full flex items-center justify-center hover:bg-[#e55a1b] transition-colors shadow-md"
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div className="flex-1 flex flex-col gap-1">
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #FE641F ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%)`
                    }}
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            <Volume2 size={16} className="text-gray-400 shrink-0" />
            {src && (
                <a href={src} download className="text-gray-400 hover:text-[#FE641F] transition-colors shrink-0" title="Download">
                    <Download size={16} />
                </a>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors shrink-0" title="Close">
                <X size={16} />
            </button>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
                preload="metadata"
            />
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
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);

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
                    method: "PATCH",
                    headers: {
                        accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            if (response.ok) {
                setVoicemails((prev) =>
                    prev.map((v) =>
                        v.id === voicemailId ? { ...v, status: "listened" } : v
                    )
                );
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

    const getRecordingUrl = (vm: Voicemail) => vm.recording_gcs_url || vm.recording_url || null;

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
            render: (vm) => {
                const url = getRecordingUrl(vm);
                return (
                    <div className="flex items-center gap-1 justify-center">
                        {url && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setPlayingUrl(url); }}
                                className={`p-2 rounded-xl hover:bg-black/10 transition-colors ${playingUrl === url ? "text-[#FE641F] bg-orange-50" : "text-gray-400 hover:text-[#FE641F]"}`}
                                title="Play Recording"
                            >
                                {playingUrl === url ? <Pause size={15} /> : <Play size={15} />}
                            </button>
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
                );
            },
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

                {/* Inline Audio Player */}
                {playingUrl && (
                    <InlinePlayer
                        src={playingUrl}
                        onClose={() => setPlayingUrl(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
