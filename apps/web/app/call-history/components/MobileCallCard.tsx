import React from "react";
import { CallRecord } from "../types";
import { Phone, ArrowDownToLine, ArrowUpToLine, FileText, CheckCircle2, XCircle, AlertTriangle, Clock, PlayCircle } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface MobileCallCardProps {
    call: CallRecord;
    onClick: () => void;
    onSelect?: (checked: boolean) => void;
    isSelected?: boolean;
    selectable?: boolean;
}

export function MobileCallCard({ call, onClick, onSelect, isSelected, selectable }: MobileCallCardProps) {
    const isCompleted = call.outcome === "Completed";
    const isMissed = call.outcome === "Missed";
    const isFailed = call.outcome === "Failed";
    const isVoicemail = call.outcome === "Voicemail";

    const getOutcomeDetails = () => {
        switch (call.outcome) {
            case "Completed": return { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 size={14} className="mr-1" />, label: "Completed" };
            case "Missed": return { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={14} className="mr-1" />, label: "Missed" };
            case "Voicemail": return { bg: "bg-amber-100", text: "text-amber-800", icon: <FileText size={14} className="mr-1" />, label: "Voicemail" };
            case "Failed": return { bg: "bg-gray-100", text: "text-gray-800", icon: <AlertTriangle size={14} className="mr-1" />, label: "Failed" };
            case "In Progress": return { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock size={14} className="mr-1" />, label: "In Progress" };
            default: return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: call.outcome };
        }
    };

    const outcomeDetails = getOutcomeDetails();

    const formatDuration = (seconds: number) => {
        if (!seconds) return "—";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        if (m === 0) return `${s}s`;
        return `${m}m ${s}s`;
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(call.timestamp));
    const hasNotes = !!call.notes;

    return (
        <div
            className={cn("bg-white rounded-2xl p-4 border border-black/5 shadow-sm flex flex-col gap-3 relative transition-all", isSelected && "border-brand bg-orange-50/20")}
        >
            {selectable && (
                <div className="absolute top-4 left-4 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelect?.(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                    />
                </div>
            )}

            {/* Header logic */}
            <div className={cn("flex items-start justify-between", selectable && "pl-8")}>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-medium">
                        {call.direction === "Inbound" ? (
                            <span className="flex items-center text-blue-600"><ArrowDownToLine size={14} className="mr-1" /> Inbound</span>
                        ) : (
                            <span className="flex items-center text-orange-600"><ArrowUpToLine size={14} className="mr-1" /> Outbound</span>
                        )}
                        <span className={cn("flex items-center px-1.5 py-0.5 rounded-md", outcomeDetails.bg, outcomeDetails.text)}>
                            {outcomeDetails.icon} {outcomeDetails.label}
                        </span>
                    </div>
                    <div className="text-sm font-mono text-gray-500 mt-1">Call ID: {call.id}</div>
                    <div className="text-base font-semibold text-navy flex items-center gap-1.5 mt-0.5">
                        <Phone size={16} className="text-gray-400" /> {call.phoneNumber}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1"><Clock size={16} /> {formatDuration(call.durationSeconds)}</div>
                {call.recordingStatus === "Available" && (
                    <div className="flex items-center gap-1 text-red-600"><div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Recording</div>
                )}
                <div className="text-gray-400 ml-auto">{formattedDate}</div>
            </div>

            {call.tags && call.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-400">🏷️</span>
                    {call.tags.slice(0, 3).map(tag => (
                        <span key={tag.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                            {tag.name}
                        </span>
                    ))}
                    {call.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{call.tags.length - 3}</span>
                    )}
                </div>
            )}

            {hasNotes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-black/5 italic flex gap-2">
                    <span className="shrink-0">📝</span>
                    <span className="line-clamp-2">"{call.notes}"</span>
                </div>
            )}

            <div className="flex items-center gap-3 mt-1 pt-3 border-t border-black/5">
                <button
                    onClick={onClick}
                    className="flex-1 py-2 text-center text-sm font-medium text-navy bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    View Details
                </button>
                <button
                    className="flex-1 py-2 text-center text-sm font-medium text-white bg-brand hover:bg-brand/90 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <Phone size={16} /> Call Back
                </button>
            </div>

        </div>
    );
}
