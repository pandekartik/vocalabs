"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Play, Pause, Download, Phone, UserPlus, CheckCircle,
    Trash2, X, Volume2, VolumeX, ChevronDown, ExternalLink, Clock, MapPin
} from "lucide-react";
import { VLModal, VLButton, VLBadge } from "@/components/ui/vl";
import { cn } from "@repo/ui/lib/utils";

interface Voicemail {
    id: string;
    callerName: string | null;
    callerPhone: string;
    durationSecs: number;
    transcript: string;
    receivedAt: string;
    status: string;
    priority: string;
}

interface VoicemailPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    voicemail: Voicemail;
    onAssign: () => void;
}

function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Stable pseudo-random waveform bars
const WAVEFORM = Array.from({ length: 60 }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.4) * 40 + Math.sin(i * 0.8) * 20 + 15);
    return Math.min(Math.max(v, 8), 60);
});

export function VoicemailPlayerModal({ isOpen, onClose, voicemail, onAssign }: VoicemailPlayerModalProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0-1
    const [speed, setSpeed] = useState("1x");
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(80);
    const [searchQuery, setSearchQuery] = useState("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Simulate playback
    useEffect(() => {
        if (!isOpen) { setIsPlaying(false); setProgress(0); }
    }, [isOpen]);

    useEffect(() => {
        if (isPlaying) {
            const speedMult = parseFloat(speed.replace("x", ""));
            intervalRef.current = setInterval(() => {
                setProgress(p => {
                    if (p >= 1) { setIsPlaying(false); return 1; }
                    return p + (0.1 * speedMult) / voicemail.durationSecs;
                });
            }, 100);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, speed, voicemail.durationSecs]);

    const currentSec = Math.floor(progress * voicemail.durationSecs);
    const playedBars = Math.floor(progress * WAVEFORM.length);

    const TRANSCRIPT_SENTENCES = voicemail.transcript.split(". ").map(s => s.trim()).filter(Boolean);

    return (
        <VLModal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title={`Voicemail from ${voicemail.callerName || voicemail.callerPhone}`}
            subtitle={`Received ${voicemail.receivedAt} • ${formatTime(voicemail.durationSecs)}`}
        >
            <div className="flex flex-col gap-6">

                {/* ── Waveform + Progress ── */}
                <div className="bg-vl-gray-1 rounded-md p-5 border border-vl-gray-4">
                    {/* Waveform */}
                    <div
                        className="flex items-center gap-[2px] h-16 mb-4 cursor-pointer"
                        onClick={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setProgress((e.clientX - rect.left) / rect.width);
                        }}
                    >
                        {WAVEFORM.map((h, i) => (
                            <div
                                key={i}
                                style={{ height: `${h}px` }}
                                className={cn(
                                    "flex-1 rounded-full transition-colors",
                                    i < playedBars ? "bg-brand" : "bg-vl-gray-2"
                                )}
                            />
                        ))}
                    </div>

                    {/* Time + Progress bar */}
                    <div
                        className="relative h-1.5 bg-vl-gray-2 rounded-full mb-4 cursor-pointer"
                        onClick={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setProgress((e.clientX - rect.left) / rect.width);
                        }}
                    >
                        <div className="absolute left-0 top-0 h-full bg-brand rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand border-2 border-white rounded-full shadow-vl-sm" style={{ left: `${progress * 100}%` }} />
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center gap-4">
                        {/* Play/Pause */}
                        <button
                            onClick={() => setIsPlaying(p => !p)}
                            className="w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-vl-orange text-white hover:opacity-90 transition-opacity shrink-0"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                        </button>

                        {/* Time */}
                        <div className="flex items-center gap-1 text-vl-sm font-mono text-navy">
                            <span>{formatTime(currentSec)}</span>
                            <span className="text-vl-gray-3">/</span>
                            <span className="text-vl-gray-3">{formatTime(voicemail.durationSecs)}</span>
                        </div>

                        {/* Speed */}
                        <div className="relative ml-auto">
                            <select
                                value={speed}
                                onChange={e => setSpeed(e.target.value)}
                                className="appearance-none bg-white border border-vl-gray-2 rounded-sm px-2 py-1 pr-6 text-vl-xs text-navy focus:outline-none cursor-pointer"
                            >
                                {["0.5x", "1x", "1.5x", "2x"].map(s => <option key={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-vl-gray-3 pointer-events-none" />
                        </div>

                        {/* Volume */}
                        <button onClick={() => setIsMuted(m => !m)} className="text-vl-gray-3 hover:text-navy transition-colors">
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <input type="range" min="0" max="100" value={isMuted ? 0 : volume}
                            onChange={e => { setVolume(+e.target.value); setIsMuted(+e.target.value === 0); }}
                            className="w-20 accent-brand" />

                        <button className="text-vl-gray-3 hover:text-navy transition-colors ml-2">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* ── Transcript ── */}
                <div className="bg-white border border-vl-gray-4 rounded-md overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-vl-gray-4 bg-vl-gray-1">
                        <div className="flex items-center gap-2">
                            <span className="text-vl-sm font-semibold text-navy">AI Transcript</span>
                            <VLBadge variant="live" dot={false}>98% confidence</VLBadge>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search in transcript..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-white border border-vl-gray-2 rounded-sm px-3 py-1 text-vl-xs placeholder:text-vl-gray-3 focus:outline-none focus:border-brand w-44"
                            />
                        </div>
                    </div>
                    <div className="p-5 max-h-36 overflow-y-auto space-y-2">
                        <p className="text-vl-xs font-semibold text-vl-gray-3 uppercase tracking-widest mb-3">Caller</p>
                        {TRANSCRIPT_SENTENCES.map((s, i) => {
                            const isHighlighted = searchQuery && s.toLowerCase().includes(searchQuery.toLowerCase());
                            return (
                                <p key={i} className={cn(
                                    "text-vl-sm leading-relaxed",
                                    isHighlighted ? "bg-amber-100 text-navy rounded px-1" : "text-vl-gray-3"
                                )}>
                                    {s}.
                                </p>
                            );
                        })}
                    </div>
                </div>

                {/* ── Caller Info ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-vl-gray-1 rounded-md border border-vl-gray-4 p-4">
                        <p className="text-vl-caps font-semibold text-vl-gray-3 tracking-widest mb-3">Caller Information</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-vl-sm"><Phone size={14} className="text-vl-gray-3" /><span className="text-navy">{voicemail.callerPhone}</span></div>
                            <div className="flex items-center gap-2 text-vl-sm"><MapPin size={14} className="text-vl-gray-3" /><span className="text-vl-gray-3">New York, NY</span></div>
                            <div className="flex items-center gap-2 text-vl-sm"><Clock size={14} className="text-vl-gray-3" /><span className="text-vl-gray-3">3 previous calls</span></div>
                        </div>
                    </div>
                    <div className="bg-vl-gray-1 rounded-md border border-vl-gray-4 p-4">
                        <p className="text-vl-caps font-semibold text-vl-gray-3 tracking-widest mb-3">Quick Actions</p>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 text-vl-sm text-brand hover:underline">
                                <ExternalLink size={13} /> View in CRM
                            </button>
                            <button className="w-full flex items-center gap-2 text-vl-sm text-info hover:underline">
                                <Phone size={13} /> Call Back Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex items-center gap-3 pt-2 border-t border-vl-gray-4">
                    <VLButton variant="primary" leftIcon={<Phone size={15} />}>Call Back</VLButton>
                    <VLButton variant="secondary" leftIcon={<UserPlus size={15} />} onClick={onAssign}>Assign to Agent</VLButton>
                    <VLButton variant="secondary" leftIcon={<CheckCircle size={15} />}>Mark as Resolved</VLButton>
                    <VLButton variant="danger" leftIcon={<Trash2 size={15} />} className="ml-auto">Delete</VLButton>
                </div>
            </div>
        </VLModal>
    );
}
