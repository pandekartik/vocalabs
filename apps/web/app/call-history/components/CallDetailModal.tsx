import React from "react";
import { CallRecord } from "../types";
import { X, Phone, Download, Share, Plus, Play, Pause, FastForward, CheckCircle2, XCircle, AlertTriangle, FileText, Clock, ArrowDownToLine, ArrowUpToLine, Search } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface CallDetailModalProps {
    call: CallRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Full Drawer/Modal for Call Detail View (A-006)
 */
export function CallDetailModal({ call, isOpen, onClose }: CallDetailModalProps) {
    if (!isOpen || !call) return null;

    const formatDuration = (seconds: number) => {
        if (!seconds) return "—";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} minute${m !== 1 ? 's' : ''} ${s} second${s !== 1 ? 's' : ''}`;
    };

    const startedAt = new Date(call.timestamp);
    const endedAt = new Date(startedAt.getTime() + call.durationSeconds * 1000);

    const getOutcomeDetails = () => {
        switch (call.outcome) {
            case "Completed": return { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 size={16} className="mr-1" />, label: "Completed" };
            case "Missed": return { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={16} className="mr-1" />, label: "Missed" };
            case "Voicemail": return { bg: "bg-amber-100", text: "text-amber-800", icon: <FileText size={16} className="mr-1" />, label: "Voicemail" };
            case "Failed": return { bg: "bg-gray-100", text: "text-gray-800", icon: <AlertTriangle size={16} className="mr-1" />, label: "Failed" };
            case "In Progress": return { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock size={16} className="mr-1" />, label: "In Progress" };
            default: return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: call.outcome };
        }
    };
    const outcomeDetails = getOutcomeDetails();

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
                                {call.id}
                            </span>
                            <button className="text-brand hover:text-brand/80 text-sm font-medium">Copy</button>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Actions Bar */}
                <div className="px-6 py-4 bg-gray-50 border-b border-black/5 flex items-center gap-3 shrink-0 overflow-x-auto">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm shrink-0">
                        <Phone size={16} /> Call Back
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/10 text-navy rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm shrink-0">
                        <Download size={16} /> Download
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/10 text-navy rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm shrink-0">
                        <Share size={16} /> Share
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

                    {/* Metadata Section */}
                    <section className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Phone Number</span>
                                <span className="font-medium text-navy flex items-center gap-2">
                                    {call.phoneNumber}
                                    <button className="text-brand hover:underline text-xs">Copy</button>
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Direction</span>
                                <span className="font-medium text-navy flex items-center gap-1.5">
                                    {call.direction === "Inbound" ? <ArrowDownToLine size={16} className="text-blue-500" /> : <ArrowUpToLine size={16} className="text-orange-500" />}
                                    {call.direction}
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
                                <span className="font-medium text-navy">{formatDuration(call.durationSeconds)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Outcome</span>
                                <div>
                                    <span className={cn("inline-flex items-center px-2 py-1 rounded-md font-medium text-xs", outcomeDetails.bg, outcomeDetails.text)}>
                                        {outcomeDetails.icon} {outcomeDetails.label}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Recording Status</span>
                                <span className="font-medium text-navy flex items-center gap-2">
                                    {call.recordingStatus === "Available" && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                                    {call.recordingStatus === "Processing" && <Clock size={14} className="text-amber-500" />}
                                    {call.recordingStatus === "Failed" && <AlertTriangle size={14} className="text-red-500" />}
                                    {call.recordingStatus}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tags Section */}
                    <section className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
                                Tags <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-normal">{call.tags.length}</span>
                            </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {call.tags.map(tag => (
                                <div key={tag.id} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm group">
                                    {tag.name}
                                    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button className="flex items-center gap-1.5 text-sm font-medium text-brand border border-brand/20 bg-brand/5 hover:bg-brand/10 px-3 py-1.5 rounded-lg transition-colors dashed">
                                <Plus size={16} /> Add Tag
                            </button>
                        </div>
                    </section>

                    {/* Notes Section */}
                    <section className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-navy">Notes</h3>
                            <span className="text-xs text-gray-400">Last edited Oct 15, 2:45 PM</span>
                        </div>
                        <div className="relative">
                            <textarea
                                className="w-full min-h-[120px] p-4 bg-gray-50 border border-black/10 rounded-xl text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all resize-y"
                                placeholder="Add notes here..."
                                defaultValue={call.notes}
                            />
                            <div className="absolute bottom-3 right-4 flex items-center gap-3">
                                <span className="text-xs text-gray-400">Saving...</span>
                                <span className="text-xs text-gray-400">{call.notes.length}/2000</span>
                            </div>
                        </div>
                    </section>

                    {/* AI Summary Section */}
                    {(call.aiSummary || call.sentiment) && (
                        <section className="flex flex-col gap-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                                    ✨ AI Summary
                                </h3>
                                <span className="text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded-full border border-indigo-100 shadow-sm">
                                    98% confidence
                                </span>
                            </div>
                            <p className="text-sm text-indigo-900/80 leading-relaxed">
                                {call.aiSummary}
                            </p>
                            {call.sentiment && (
                                <div className="mt-2 pt-3 border-t border-indigo-100/50 flex flex-col gap-2">
                                    <p className="text-xs text-indigo-900/60 font-medium">Sentiment</p>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-md text-sm font-medium border",
                                            call.sentiment === "Positive" ? "bg-green-50 text-green-700 border-green-200" :
                                                call.sentiment === "Negative" ? "bg-red-50 text-red-700 border-red-200" :
                                                    "bg-gray-50 text-gray-700 border-gray-200"
                                        )}>
                                            {call.sentiment === "Positive" ? "😊 Positive" :
                                                call.sentiment === "Negative" ? "😞 Negative" :
                                                    "😐 Neutral"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Transcript Section */}
                    <section className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-navy">Transcript</h3>
                            <button className="text-xs text-brand font-medium hover:underline">Download TXT</button>
                        </div>
                        <div className="flex flex-col gap-4 p-4 border border-black/10 rounded-xl bg-white">
                            {/* Search */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-black/5">
                                <Search size={16} className="text-gray-400" />
                                <input type="text" placeholder="Search transcript..." className="bg-transparent border-none outline-none text-sm w-full" />
                            </div>

                            {/* Transcript Body Mock */}
                            <div className="flex flex-col gap-3 mt-2 font-['IBM_Plex_Sans'] text-sm">
                                <div className="flex gap-3">
                                    <span className="text-gray-400 font-mono text-xs w-[60px] shrink-0 pt-0.5">2:34:15</span>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-brand">Agent</span>
                                        <span className="text-navy">Thank you for calling. How can I help?</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-gray-400 font-mono text-xs w-[60px] shrink-0 pt-0.5">2:34:22</span>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-blue-600">Customer</span>
                                        <span className="text-navy">Hi, I'm interested in your premium plan and would like to know the pricing.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Recording Player (Fixed Bottom) */}
                {call.recordingStatus === "Available" && (
                    <div className="p-4 border-t border-black/10 bg-white/80 backdrop-blur-md shrink-0 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                        <button className="h-10 w-10 shrink-0 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand/90 transition-transform hover:scale-105 shadow-sm">
                            <Play size={20} className="ml-1" />
                        </button>
                        <div className="flex-1 flex flex-col gap-1.5">
                            {/* Fake Waveform */}
                            <div className="h-8 w-full flex items-center gap-0.5">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-1 rounded-full",
                                            i < 15 ? "bg-orange-400" : "bg-gray-200"
                                        )}
                                        style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                <span>01:23</span>
                                <span>{formatDuration(call.durationSeconds)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <button className="text-xs font-semibold text-gray-500 hover:text-navy px-1">1.5x</button>
                            <button className="text-gray-400 hover:text-navy"><FastForward size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
