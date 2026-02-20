
"use client";

import { useCallStore } from "@/store/useCallStore";
import { cn } from "@repo/ui/lib/utils";
import { Mic, MicOff, Phone, Pause, GripHorizontal, CirclePause, Play, ChevronLeft } from "lucide-react";
import DialerStatusPill from "./DialerStatusPill";
import RecordingPill from "./RecordingPill";
import { useState } from "react";
import CallControlButton from "./CallControlButton";

interface ActiveCallCardProps {
    onEndCall: () => void;
}

export default function ActiveCallCard({ onEndCall }: ActiveCallCardProps) {
    const {
        duration,
        endCall,
        toggleMute,
        isMuted,
        toggleHold,
        isOnHold,
        toggleRecording,
        isRecordingPaused,
        phoneNumber,
        callStatus
    } = useCallStore();

    const [showKeypad, setShowKeypad] = useState(false);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        endCall();
        onEndCall();
    };

    const handleKeyPress = (key: string) => {
        console.log("Key pressed:", key);
    };

    const keys = [
        { label: "1", sub: "ABC" },
        { label: "2", sub: "DEF" },
        { label: "3", sub: "GHI" },
        { label: "4", sub: "JKL" },
        { label: "5", sub: "MNO" },
        { label: "6", sub: "PQRS" },
        { label: "7", sub: "TUV" },
        { label: "8", sub: "WXYZ" },
        { label: "9", sub: "" },
        { label: "*", sub: "" },
        { label: "0", sub: "+" },
        { label: "#", sub: "" },
    ];

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {/* Active Call Dialer Container */}
            <div
                className="relative flex flex-1 flex-col gap-6 rounded-[24px] border border-white/10 p-6 shadow-sm backdrop-blur-[42px] overflow-hidden"
                style={{
                    backgroundImage: "linear-gradient(95.08deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)",
                    boxShadow: "0px 4px 8px 0px rgba(26,26,26,0.12)"
                }}
            >
                {/* Header with Dialer Status */}
                <div className="flex items-center justify-between w-full shrink-0">
                    <h2 className="font-medium text-[#0c335c] text-base">Dialer</h2>
                    <div className="flex items-center gap-2">
                        <RecordingPill isPaused={isRecordingPaused} />
                        <DialerStatusPill status={callStatus === 'in-progress' ? "Connected" : "Initializing"} />
                    </div>
                </div>

                {/* Keypad Overlay View */}
                {showKeypad ? (
                    <div className="flex flex-col items-center justify-center flex-1 w-full animate-in fade-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {keys.map((key) => (
                                <button
                                    key={key.label}
                                    onClick={() => handleKeyPress(key.label)}
                                    className="flex h-[60px] w-[60px] flex-col items-center justify-center gap-0 rounded-[30px] border border-[rgba(17,17,17,0.05)] bg-white/40 hover:bg-white/60 active:scale-95 transition-all"
                                >
                                    <span className="text-lg font-medium text-[#111]">{key.label}</span>
                                    {key.sub && <span className="text-[10px] text-[#64748b]">{key.sub}</span>}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowKeypad(false)}
                            className="flex items-center gap-2 text-[#0c335c] font-medium hover:underline mt-2"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back to Call Controls
                        </button>
                    </div>
                ) : (
                    /* Default Active Call View */
                    <div className="flex flex-col items-center justify-center flex-1 gap-6 w-full animate-in fade-in zoom-in-95 duration-200">

                        {/* Status / Timer Display */}
                        <div className="flex flex-col items-center gap-2 h-[80px] justify-center text-center">
                            {isOnHold ? (
                                <h1 className="text-[24px] font-medium text-[#0c335c]">Call on Hold</h1>
                            ) : (
                                <>
                                    <h1 className="text-[24px] font-medium text-[#111] leading-none">
                                        {callStatus === 'in-progress' ? formatDuration(duration) :
                                            callStatus === 'ringing' ? 'Ringing...' : 'Connecting...'}
                                    </h1>
                                    <p className="text-[14px] text-[#64748b] leading-none">{phoneNumber || "Unknown Number"}</p>
                                </>
                            )}
                        </div>

                        {/* Controls Grid */}
                        <div className="flex items-center justify-between w-full px-2">
                            {/* Mute Button */}
                            <div className="flex flex-col items-center gap-1 w-[72px]">
                                <button
                                    onClick={toggleMute}
                                    className={cn(
                                        "flex h-[72px] w-[72px] items-center justify-center rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all active:scale-95",
                                        isMuted
                                            ? "bg-[#fe641f] border-[#fe641f]/20 hover:bg-[#e55a1b]"
                                            : "hover:bg-white/10"
                                    )}
                                    style={!isMuted ? {
                                        backgroundImage: "linear-gradient(95.95deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                                    } : {}}
                                >
                                    {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-[#111]" />}
                                </button>
                                <span className="text-[12px] font-medium text-[#111] opacity-60 text-center">Mute</span>
                            </div>

                            {/* Hold Button */}
                            <div className="flex flex-col items-center gap-1 w-[72px]">
                                <button
                                    onClick={toggleHold}
                                    className={cn(
                                        "flex h-[72px] w-[72px] items-center justify-center rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all active:scale-95",
                                        isOnHold
                                            ? "bg-[#fe641f] border-[#fe641f]/20 hover:bg-[#e55a1b]"
                                            : "hover:bg-white/10"
                                    )}
                                    style={!isOnHold ? {
                                        backgroundImage: "linear-gradient(95.95deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                                    } : {}}
                                >
                                    {isOnHold ? <Play className="h-6 w-6 text-white fill-current" /> : <CommonPhoneIcon className="h-6 w-6 text-[#111]" />}
                                </button>
                                <span className="text-[12px] font-medium text-[#111] opacity-60 text-center">
                                    {isOnHold ? "Resume" : "Hold"}
                                </span>
                            </div>

                            {/* Stop Recording / Pause */}
                            <div className="flex flex-col items-center gap-1 w-[72px]">
                                <button
                                    onClick={toggleRecording}
                                    className={cn(
                                        "flex h-[72px] w-[72px] items-center justify-center rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all hover:bg-white/10 active:scale-95",
                                        isRecordingPaused ? "bg-red-50" : ""
                                    )}
                                    style={{
                                        backgroundImage: "linear-gradient(95.95deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                                    }}
                                >
                                    {isRecordingPaused ? <Play className="h-6 w-6 text-[#111] fill-current" /> : <Pause className="h-6 w-6 text-[#111]" />}
                                </button>
                                <span className="text-[12px] font-medium text-[#111] opacity-60 text-center whitespace-nowrap">
                                    {isRecordingPaused ? "Resume" : "Stop Recording"}
                                </span>
                            </div>

                            {/* Keypad */}
                            <div className="flex flex-col items-center gap-1 w-[72px]">
                                <button
                                    onClick={() => setShowKeypad(true)}
                                    className="flex h-[72px] w-[72px] items-center justify-center rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all hover:bg-white/10 active:scale-95"
                                    style={{
                                        backgroundImage: "linear-gradient(95.95deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                                    }}
                                >
                                    {/* Using Grid icon as hash replacement based on Lucide options, Hash is better if available */}
                                    <GripHorizontal className="h-6 w-6 text-[#111]" />
                                </button>
                                <span className="text-[12px] font-medium text-[#111] opacity-60 text-center">Keypad</span>
                            </div>
                        </div>

                        {/* End Call Button */}
                        <div className="w-full mt-4">
                            <CallControlButton
                                variant="end"
                                onClick={handleEndCall}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper component to avoid icon naming conflict if Phone is used for both Hold icon and End Call icon in imports
function CommonPhoneIcon({ className }: { className?: string }) {
    return <Phone className={className} />;
}
