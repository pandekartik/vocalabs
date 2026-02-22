"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Clock, Phone, User, Calendar, Bell, Pencil, Check, Loader2, Volume2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/button";
import { INTELICONVOAPI } from "@/lib/axios";
import { CreateReminderModal } from "@/components/reminders/CreateReminderModal";

interface PostCallDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    callId?: string | null;
    callSid?: string | null;
    phoneNumber?: string;
    streamSid?: string | null;
}

interface CallDetail {
    id: string;
    call_sid: string;
    stream_sid: string;
    direction: string;
    status: string;
    from_number: string;
    to_number: string;
    duration: number;
    recording_url: string;
    recording_gcs_url: string | null;
    disconnect_reason: string | null;
    agent_notes: string;
    tags: string;
    started_at: string;
    ended_at: string;
}

export default function PostCallDrawer({ isOpen, onClose, callId, callSid, phoneNumber, streamSid }: PostCallDrawerProps) {
    const [callData, setCallData] = useState<CallDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notes, setNotes] = useState("");
    const [tags, setTags] = useState("");

    // Audio player state
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    // Reminder modal
    const [showReminderModal, setShowReminderModal] = useState(false);

    // Fetch call details when drawer opens
    useEffect(() => {
        if (isOpen && callId) {
            fetchCallDetail();
        }
        if (!isOpen) {
            setCallData(null);
            setIsPlaying(false);
            setCurrentTime(0);
            setIsEditing(false);
        }
    }, [isOpen, callId]);

    const fetchCallDetail = async () => {
        if (!callId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await INTELICONVOAPI.get(`/calls/${callId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCallData(res.data);
            setNotes(res.data.agent_notes || "");
            const parsedTags = safeParseTags(res.data.tags);
            setTags(parsedTags.join(", "));
        } catch (e) {
            console.error("Failed to fetch call detail:", e);
        } finally {
            setLoading(false);
        }
    };

    const safeParseTags = (raw: string | null): string[] => {
        if (!raw) return [];
        try {
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    };

    const handleSave = async () => {
        if (!callId) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
            await INTELICONVOAPI.patch(`/calls/${callId}/notes`, {
                notes,
                tags: parsedTags,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsEditing(false);
        } catch (e) {
            console.error("Failed to save:", e);
        } finally {
            setIsSaving(false);
        }
    };

    // Audio player controls
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
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
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

    const formatTime = (sec: number) => {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const formatDuration = (sec: number | null | undefined) => {
        if (!sec) return "—";
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        if (m === 0) return `${s}s`;
        return `${m}m ${s}s`;
    };

    const formatDateTime = (iso: string | null | undefined) => {
        if (!iso) return "—";
        const d = new Date(iso);
        return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    };

    const recordingUrl = callData?.recording_gcs_url || callData?.recording_url || null;
    const displayPhone = phoneNumber || (callData?.direction === "inbound" ? callData?.from_number : callData?.to_number) || "Unknown";
    const disconnectedBy = callData?.disconnect_reason
        ? callData.disconnect_reason.charAt(0).toUpperCase() + callData.disconnect_reason.slice(1)
        : "—";

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-[#111] z-[9998]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[517px] bg-white/90 backdrop-blur-[42px] border-l border-white/10 shadow-2xl z-[9999] rounded-l-[24px] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[#111]/5">
                                <h2 className="text-[#0C335C] font-sans font-medium text-lg">Post-Call Review</h2>
                                <button onClick={onClose} className="text-[#111] hover:text-[#0C335C] transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                                {loading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <Loader2 size={32} className="animate-spin text-[#FE641F]" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Phone Number */}
                                        <div className="flex items-center justify-center p-4 rounded-2xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                            <span className="text-[#111] font-sans font-medium text-lg">{displayPhone}</span>
                                        </div>

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <InfoItem label="Call ID" value={callId?.slice(0, 8) || "—"} />
                                            <InfoItem label="Duration" value={formatDuration(callData?.duration)} />
                                            <InfoItem label="Disconnected by" value={disconnectedBy} />
                                            <InfoItem label="Time" value={formatDateTime(callData?.started_at)} />
                                        </div>

                                        {/* Recording Player */}
                                        {recordingUrl ? (
                                            <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={togglePlay}
                                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FE641F] text-white hover:bg-[#e55a1b] transition-colors shadow-md shrink-0"
                                                    >
                                                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                                                    </button>
                                                    <div className="flex-1 flex flex-col gap-1">
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
                                                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                                            <span>{formatTime(currentTime)}</span>
                                                            <span>{formatTime(audioDuration)}</span>
                                                        </div>
                                                    </div>
                                                    <Volume2 size={16} className="text-gray-400 shrink-0" />
                                                </div>
                                                <audio
                                                    ref={audioRef}
                                                    src={recordingUrl}
                                                    onTimeUpdate={handleTimeUpdate}
                                                    onLoadedMetadata={handleLoadedMetadata}
                                                    onEnded={handleAudioEnded}
                                                    preload="metadata"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-3 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-500 font-sans text-xs">Recording</span>
                                                    <span className="text-gray-400 font-sans font-medium text-sm italic">Not available</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tagging IDs */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 font-sans text-xs">Tagging IDs</span>
                                            <div className="p-3 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                                {isEditing ? (
                                                    <textarea
                                                        value={tags}
                                                        onChange={(e) => setTags(e.target.value)}
                                                        className="w-full h-24 bg-transparent border-none outline-none text-[#111] font-sans font-medium text-sm resize-none"
                                                        placeholder="Enter tags, comma separated..."
                                                    />
                                                ) : (
                                                    <span className="text-[#111] font-sans font-medium text-sm block whitespace-pre-wrap">
                                                        {tags || <span className="text-gray-400 italic">No tags</span>}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-500 font-sans text-xs">Notes</span>
                                            <div className="p-3 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                                {isEditing ? (
                                                    <textarea
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        className="w-full h-24 bg-transparent border-none outline-none text-[#111] font-sans font-medium text-sm resize-none"
                                                        placeholder="Enter notes..."
                                                    />
                                                ) : (
                                                    <p className="text-[#111] font-sans font-medium text-sm whitespace-pre-wrap">
                                                        {notes || <span className="text-gray-400 italic">No notes</span>}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-[#111]/5 flex items-center justify-between mt-auto">
                                <button
                                    onClick={() => setShowReminderModal(true)}
                                    className="flex items-center gap-2 px-0 py-2.5 bg-transparent hover:opacity-70 transition-opacity"
                                >
                                    <Bell size={16} className="text-[#111]" />
                                    <span className="text-[#111] font-sans font-semibold text-sm">Set Reminder</span>
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)] bg-white border border-[#fe641f] hover:bg-orange-50 transition-colors"
                                    >
                                        <Pencil size={16} />
                                        <span className="text-[#111] font-sans font-semibold text-sm">Edit</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)] bg-[#fe641f] hover:bg-[#e55a1b] transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={16} className="text-white animate-spin" />
                                        ) : (
                                            <Check size={16} className="text-white" />
                                        )}
                                        <span className="text-white font-sans font-semibold text-sm">Save</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CreateReminderModal
                isOpen={showReminderModal}
                onClose={() => setShowReminderModal(false)}
            />
        </>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col justify-center px-3 py-2 h-[54px] rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
            <span className="text-slate-500 font-sans text-xs">{label}</span>
            <span className="text-[#111] font-sans font-medium text-sm text-right">{value}</span>
        </div>
    );
}
