"use client";

import { Card } from "@/components/ui/card";
import { Phone, Mic, MicOff, Pause, LayoutGrid, SignalHigh } from "lucide-react";
import { useCallStore } from "@/store/useCallStore";

interface ActiveCallCardProps {
    onEndCall: () => void;
}

export default function ActiveCallCard({ onEndCall }: ActiveCallCardProps) {
    const {
        endCall,
        duration,
        isMuted,
        toggleMute,
        callStatus
    } = useCallStore();

    const handleEndCall = () => {
        endCall();
        onEndCall();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="h-auto">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full animate-pulse ${callStatus === 'in-progress' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="font-sans text-sm font-medium text-[#0c335c]">
                            {callStatus === 'in-progress' ? 'Voice Connected' : 'Connecting...'}
                        </span>
                    </div>
                    <div className="font-sans text-xl font-medium text-[#111]">
                        {formatDuration(duration)}
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-sans text-xs font-medium text-[#111]">Voice Recording</span>
                    </div>
                    <SignalHigh className="h-4 w-4 text-[#111]" />
                </div>

                <div className="flex justify-center gap-4 py-2">
                    <button
                        onClick={toggleMute}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors border border-white/20 shadow-sm backdrop-blur-md ${isMuted ? 'bg-red-100 hover:bg-red-200' : 'bg-white/40 hover:bg-white/60'}`}
                    >
                        {isMuted ? <MicOff className="h-5 w-5 text-red-600" /> : <Mic className="h-5 w-5 text-[#111]" />}
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 hover:bg-white/60 transition-colors border border-white/20 shadow-sm backdrop-blur-md">
                        <Pause className="h-5 w-5 text-[#111]" />
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 hover:bg-white/60 transition-colors border border-white/20 shadow-sm backdrop-blur-md">
                        <LayoutGrid className="h-5 w-5 text-[#111]" />
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ef4444] hover:bg-[#dc2626] transition-colors shadow-[0_4px_14px_0_rgba(239,68,68,0.4)]"
                    >
                        <Phone className="h-5 w-5 text-white rotate-[135deg]" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
