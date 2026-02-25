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
    const isCompleted = call.status === "completed";
    const isMissed = call.status === "missed";
    const isFailed = call.status === "failed";
    const isVoicemail = call.status === "voicemail";

    const getOutcomeDetails = () => {
        switch (call.status) {
            case "completed": return { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 size={14} className="mr-1" />, label: "Completed" };
            case "missed": return { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={14} className="mr-1" />, label: "Missed" };
            case "voicemail": return { bg: "bg-amber-100", text: "text-amber-800", icon: <FileText size={14} className="mr-1" />, label: "Voicemail" };
            case "failed": return { bg: "bg-gray-100", text: "text-gray-800", icon: <AlertTriangle size={14} className="mr-1" />, label: "Failed" };
            case "initiated": return { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock size={14} className="mr-1" />, label: "Initiated" };
            default: return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: call.status };
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

    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(call.started_at));
    const hasNotes = !!call.agent_notes;

    let parsedTags: any[] = [];
    try { parsedTags = JSON.parse(call.tags || "[]"); } catch (e) { }

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
                        {call.direction === "inbound" ? (
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
                        <Phone size={16} className="text-gray-400" /> {call.direction === "inbound" ? call.from_number : call.to_number}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1"><Clock size={16} /> {formatDuration(call.duration)}</div>
                {(call.recording_gcs_url || call.recording_url) && (
                    <div className="flex items-center gap-1 text-red-600"><div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Recording</div>
                )}
                {!(call.recording_gcs_url || call.recording_url) && call.status === "completed" && (
                    <div className="flex items-center gap-1 text-amber-600"><Clock size={14} /> Processing</div>
                )}
                <div className="text-gray-400 ml-auto">{formattedDate}</div>
            </div>

            {parsedTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-400">🏷️</span>
                    {parsedTags.slice(0, 3).map((tag: any) => (
                        <span key={tag.id || tag.name} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                            {tag.id || tag.name}
                        </span>
                    ))}
                    {parsedTags.length > 3 && (
                        <span className="text-xs text-gray-500">+{parsedTags.length - 3}</span>
                    )}
                </div>
            )}

            {hasNotes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-black/5 italic flex gap-2">
                    <span className="shrink-0">📝</span>
                    <span className="line-clamp-2">"{call.agent_notes}"</span>
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
