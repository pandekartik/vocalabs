import React, { useState, useRef, useEffect } from "react";
import { CallRecord } from "../types";
import { X, Phone, Download, Play, Pause, Volume2, CheckCircle2, XCircle, AlertTriangle, FileText, Clock, ArrowDownToLine, ArrowUpToLine, Search, Loader2, Check, Pencil } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface CallDetailModalProps {
    call: CallRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Full Drawer/Modal for Call Detail View
 */
export function CallDetailModal({ call, isOpen, onClose }: CallDetailModalProps) {
    // Audio player state
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    // Editable notes
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesValue, setNotesValue] = useState("");
    const [notesSaving, setNotesSaving] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);

    useEffect(() => {
        if (call) {
            setNotesValue(call.agent_notes || "");
            setIsEditingNotes(false);
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, [call]);

    if (!isOpen || !call) return null;

    const formatDuration = (seconds: number) => {
        if (!seconds) return "—";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} minute${m !== 1 ? 's' : ''} ${s} second${s !== 1 ? 's' : ''}`;
    };

    const formatTime = (sec: number) => {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const startedAt = new Date(call.started_at);
    const endedAt = new Date(call.ended_at);

    const getOutcomeDetails = () => {
        switch (call.status) {
            case "completed": return { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 size={16} className="mr-1" />, label: "Completed" };
            case "missed": return { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={16} className="mr-1" />, label: "Missed" };
            case "voicemail": return { bg: "bg-amber-100", text: "text-amber-800", icon: <FileText size={16} className="mr-1" />, label: "Voicemail" };
            case "failed": return { bg: "bg-gray-100", text: "text-gray-800", icon: <AlertTriangle size={16} className="mr-1" />, label: "Failed" };
            case "initiated": return { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock size={16} className="mr-1" />, label: "Initiated" };
            default: return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: call.status };
        }
    };
    const outcomeDetails = getOutcomeDetails();

    let parsedTags: any[] = [];
    try { parsedTags = JSON.parse(call.tags || "[]"); } catch (e) { }

    const recordingUrl = call.recording_gcs_url || call.recording_url || null;
    const disconnectedBy = call.disconnect_reason
        ? call.disconnect_reason.charAt(0).toUpperCase() + call.disconnect_reason.slice(1)
        : "—";

    // Audio controls
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setAudioDuration(audioRef.current.duration);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    // Notes save
    const handleSaveNotes = async () => {
        setNotesSaving(true);
        try {
            const token = localStorage.getItem("token");
            await fetch(`https://api.vocalabstech.com/calls/${call.id}/notes`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ notes: notesValue }),
            });
            setIsEditingNotes(false);
            setNotesSaved(true);
            setTimeout(() => setNotesSaved(false), 2000);
        } catch (e) {
            console.error("Failed to save notes:", e);
        } finally {
            setNotesSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-[600px] h-full bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-black/5 shrink-0">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-navy">Call Details</h2>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-black/5">
                                {call.id.slice(0, 8)}...
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="px-6 py-4 bg-gray-50 border-b border-black/5 flex items-center gap-3 shrink-0 overflow-x-auto">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FE641F] text-white rounded-xl text-sm font-medium hover:bg-[#e55a1b] transition-colors shadow-sm shrink-0">
                        <Phone size={16} /> Call Back
                    </button>
                    {recordingUrl && (
                        <a
                            href={recordingUrl}
                            download
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/10 text-navy rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm shrink-0"
                        >
                            <Download size={16} /> Download
                        </a>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

                    {/* Metadata */}
                    <section className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">From / To Number</span>
                                <span className="font-medium text-navy flex flex-col gap-0.5">
                                    <div>From: {call.from_number}</div>
                                    <div>To: {call.to_number}</div>
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Direction</span>
                                <span className="font-medium text-navy flex items-center gap-1.5 capitalize">
                                    {call.direction === "inbound" ? <ArrowDownToLine size={16} className="text-blue-500" /> : <ArrowUpToLine size={16} className="text-orange-500" />}
                                    {call.direction}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Status</span>
                                <div>
                                    <span className={cn("inline-flex items-center px-2 py-1 rounded-md font-medium text-xs", outcomeDetails.bg, outcomeDetails.text)}>
                                        {outcomeDetails.icon} {outcomeDetails.label}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Disconnected By</span>
                                <span className={cn(
                                    "font-medium text-sm inline-flex items-center gap-1.5 px-2 py-1 rounded-md w-fit",
                                    disconnectedBy === "Agent" ? "bg-blue-50 text-blue-700" :
                                        disconnectedBy === "Customer" ? "bg-orange-50 text-orange-700" :
                                            disconnectedBy === "System" ? "bg-gray-100 text-gray-700" :
                                                "text-navy"
                                )}>
                                    {disconnectedBy}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Started At</span>
                                <span className="font-medium text-navy">{startedAt.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Ended At</span>
                                <span className="font-medium text-navy">{endedAt.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Duration</span>
                                <span className="font-medium text-navy">{formatDuration(call.duration)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Tags */}
                    <section className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
                            Tags <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-normal">{parsedTags.length}</span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                            {parsedTags.map((tag: any, i: number) => (
                                <div key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
                                    {typeof tag === 'string' ? tag : (tag.id || tag.name)}
                                </div>
                            ))}
                            {parsedTags.length === 0 && <span className="text-gray-400 text-sm italic">No tags</span>}
                        </div>
                    </section>

                    {/* Notes */}
                    <section className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-navy">Notes</h3>
                            <div className="flex items-center gap-2">
                                {notesSaved && <span className="text-green-600 text-xs flex items-center gap-1"><Check size={12} /> Saved</span>}
                                {isEditingNotes ? (
                                    <button
                                        onClick={handleSaveNotes}
                                        disabled={notesSaving}
                                        className="text-xs font-medium text-white bg-[#FE641F] px-3 py-1 rounded-lg hover:bg-[#e55a1b] disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {notesSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditingNotes(true)}
                                        className="text-xs font-medium text-[#FE641F] hover:underline flex items-center gap-1"
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            {isEditingNotes ? (
                                <textarea
                                    className="w-full min-h-[120px] p-4 bg-gray-50 border border-[#FE641F]/30 rounded-xl text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FE641F]/50 transition-all resize-y"
                                    placeholder="Add notes here..."
                                    value={notesValue}
                                    onChange={(e) => setNotesValue(e.target.value)}
                                />
                            ) : (
                                <div className="w-full min-h-[60px] p-4 bg-gray-50 border border-black/10 rounded-xl text-sm text-navy whitespace-pre-wrap">
                                    {notesValue || <span className="text-gray-400 italic">No notes</span>}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* AI Summary */}
                    {(call.ai_summary || call.overall_sentiment) && (
                        <section className="flex flex-col gap-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                            <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                                ✨ AI Summary
                            </h3>
                            <p className="text-sm text-indigo-900/80 leading-relaxed whitespace-pre-line">
                                {call.ai_summary}
                            </p>
                            {call.overall_sentiment && (
                                <div className="mt-2 pt-3 border-t border-indigo-100/50 flex flex-col gap-2">
                                    <p className="text-xs text-indigo-900/60 font-medium">Sentiment</p>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-md text-sm font-medium border w-fit",
                                        call.overall_sentiment === "Positive" ? "bg-green-50 text-green-700 border-green-200" :
                                            call.overall_sentiment === "Negative" ? "bg-red-50 text-red-700 border-red-200" :
                                                "bg-gray-50 text-gray-700 border-gray-200"
                                    )}>
                                        {call.overall_sentiment === "Positive" ? "😊 Positive" :
                                            call.overall_sentiment === "Negative" ? "😞 Negative" :
                                                "😐 Neutral"}
                                    </span>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Transcript */}
                    <section className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-navy">Transcript</h3>
                        <div className="flex flex-col gap-4 p-4 border border-black/10 rounded-xl bg-white">
                            {call.transcript_segments?.length ? (
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                                    {[...call.transcript_segments]
                                        .sort((a, b) => a.time - b.time)
                                        .map((seg, i) => (
                                            <div key={i} className="flex gap-2 text-sm">
                                                <span className={cn(
                                                    "font-semibold shrink-0 w-[70px] text-right",
                                                    seg.speaker === "Agent" ? "text-blue-700" : "text-orange-700"
                                                )}>
                                                    {seg.speaker}:
                                                </span>
                                                <span className="text-navy">{seg.text}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : call.transcript ? (
                                <p className="whitespace-pre-line text-navy text-sm">{call.transcript}</p>
                            ) : (
                                <span className="text-gray-400 italic text-sm">No transcript available.</span>
                            )}
                        </div>
                    </section>
                </div>

                {/* Recording Player (Fixed Bottom) */}
                {recordingUrl && (
                    <div className="p-4 border-t border-black/10 bg-white/80 backdrop-blur-md shrink-0 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={togglePlay}
                            className="h-10 w-10 shrink-0 bg-[#FE641F] text-white rounded-full flex items-center justify-center hover:bg-[#e55a1b] transition-transform hover:scale-105 shadow-sm"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                        </button>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <input
                                type="range"
                                min={0}
                                max={audioDuration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #FE641F ${(currentTime / (audioDuration || 1)) * 100}%, #e5e7eb ${(currentTime / (audioDuration || 1)) * 100}%)`
                                }}
                            />
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(audioDuration)}</span>
                            </div>
                        </div>
                        <Volume2 size={16} className="text-gray-400 shrink-0" />
                        <audio
                            ref={audioRef}
                            src={recordingUrl}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={handleAudioEnded}
                            preload="metadata"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
