import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Play, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { CallRecord } from "@/app/call-history/types";
import { cn } from "@repo/ui/lib/utils";

export default function RecentCallsCard() {
    const [calls, setCalls] = useState<CallRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentCalls = async () => {
            try {
                const token = localStorage.getItem('token') || '';
                const response = await fetch('https://api.vocalabstech.com/calls/my-calls', {
                    headers: {
                        'accept': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCalls(data);
                } else {
                    console.error("Failed to fetch recent calls");
                }
            } catch (error) {
                console.error("Error fetching recent calls:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentCalls();
    }, []);

    const toggleExpand = (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setExpandedId(prev => (prev === id ? null : id));
    };

    const formatDuration = (sec: number) => {
        if (!sec) return "0s";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        if (m === 0) return `${s}s`;
        return `${m}m ${s}s`;
    };

    const formatDate = (isoStr: string) => {
        const d = new Date(isoStr);
        return d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    return (
        <Card title="Recent Calls" className="h-full flex flex-col overflow-hidden">
            <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 pb-2">
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-2xl animate-spin">⏳</span>
                    </div>
                ) : calls.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        No recent calls found.
                    </div>
                ) : (
                    calls.slice(0, 50).map((call) => {
                        const isExpanded = expandedId === call.id;
                        const hasRecording = !!call.recording_url;
                        const hasTranscript = !!call.transcript;
                        const hasSummary = !!call.ai_summary;
                        const displayNum = call.direction === "inbound" ? call.from_number : call.to_number;

                        let tagStr = "No Tags";
                        try {
                            const t = JSON.parse(call.tags || "[]");
                            if (t.length > 0) {
                                tagStr = t[0].name || t[0].id || tagStr;
                            }
                        } catch (e) { }

                        return (
                            <div
                                key={call.id}
                                onClick={() => toggleExpand(call.id)}
                                className="flex flex-col shrink-0 rounded-2xl border border-[#1111110d] backdrop-blur-[42px] transition-colors hover:bg-[#f0f0f0] cursor-pointer overflow-hidden"
                                style={{
                                    background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)",
                                }}
                            >
                                {/* Compact Row */}
                                <div className="flex items-center justify-between gap-2 p-3 overflow-hidden">
                                    <div className="flex-1 min-w-0 truncate">
                                        <p className="font-semibold text-[#111] truncate" title={displayNum}>{displayNum}</p>
                                    </div>

                                    <div className="flex flex-col shrink-0 text-right sm:text-left sm:shrink">
                                        <p className="text-xs font-medium text-[#111]">{formatDate(call.started_at)}</p>
                                        <p className="text-[10px] text-muted-foreground">{formatDuration(call.duration)}</p>
                                    </div>

                                    <div className="flex flex-col shrink-0 hidden md:flex">
                                        <p className="text-xs font-medium text-[#111] truncate">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full inline-block mr-1",
                                                call.status === "completed" ? "bg-green-500" :
                                                    call.status === "missed" ? "bg-red-500" :
                                                        "bg-gray-400"
                                            )} />
                                            {call.status}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">{tagStr}</p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            className={cn("flex h-8 w-8 text-xs items-center justify-center rounded-full border bg-white transition-colors",
                                                hasTranscript || hasSummary ? "border-orange-100 text-[#fe641f] hover:bg-orange-50" : "border-gray-100 text-gray-300 cursor-default"
                                            )}
                                            onClick={(e) => hasTranscript || hasSummary ? toggleExpand(call.id, e) : e.stopPropagation()}
                                            title={hasTranscript || hasSummary ? "View Details" : "No Details"}
                                        >
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button
                                            className={cn("flex h-8 w-8 items-center justify-center rounded-full border bg-white transition-colors",
                                                hasRecording ? "border-green-100 text-[#22c55e] hover:bg-green-50" : "border-gray-100 text-gray-300 cursor-default"
                                            )}
                                            onClick={(e) => hasRecording ? toggleExpand(call.id, e) : e.stopPropagation()}
                                            title={hasRecording ? "Play Recording" : "No Recording"}
                                        >
                                            <Play className="h-4 w-4 ml-0.5" />
                                        </button>
                                        <div className="px-1 text-gray-400">
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="p-4 pt-0 text-sm border-t border-black/5 mt-1 cursor-default" onClick={(e) => e.stopPropagation()}>
                                        {(hasSummary || call.overall_sentiment) && (
                                            <div className="mt-3 bg-white/50 rounded-lg p-3">
                                                <h4 className="font-semibold text-xs text-navy mb-1">✨ AI Summary</h4>
                                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{call.ai_summary || "No summary available."}</p>
                                                {call.overall_sentiment && (
                                                    <div className="mt-2 text-[10px] font-medium inline-block px-2 rounded bg-indigo-50/80 text-indigo-700 border border-indigo-100/50">
                                                        Sentiment: {call.overall_sentiment}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {hasTranscript && (
                                            <div className="mt-3">
                                                <h4 className="font-semibold text-xs text-navy mb-1 px-1">Transcript</h4>
                                                <div className="bg-white/60 p-3 inset-0 rounded-lg text-xs leading-relaxed max-h-40 overflow-y-auto font-sans whitespace-pre-wrap text-gray-700 border border-black/5">
                                                    {call.transcript}
                                                </div>
                                            </div>
                                        )}

                                        {hasRecording && (
                                            <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex items-center gap-3">
                                                <button className="h-8 w-8 shrink-0 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand/90 transition-transform">
                                                    <Play size={14} className="ml-0.5" />
                                                </button>
                                                <audio src={call.recording_url} className="w-full h-8 hidden" controls />
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="w-0 h-full bg-brand"></div>
                                                </div>
                                                <span className="text-[10px] font-mono text-gray-500">0:00 / {formatDuration(call.duration)}</span>
                                            </div>
                                        )}

                                        {!hasSummary && !hasTranscript && !hasRecording && (
                                            <div className="mt-3 text-xs text-gray-500 italic text-center py-2">
                                                No detailed call data available.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
