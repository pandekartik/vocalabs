import { useEffect, useState, useRef } from "react";
import { Phone, Delete, User } from "lucide-react";
import { useCallStore } from "@/store/useCallStore";
import { cn } from "@repo/ui/lib/utils";
import AgentStatusPill, { AgentStatusType } from "./AgentStatusPill";
import DialerStatusPill, { DialerStatusType } from "./DialerStatusPill";
import CallControlButton from "./CallControlButton";

interface DialerCardProps {
    onCallStart: () => void;
}

export default function DialerCard({ onCallStart }: DialerCardProps) {
    const {
        phoneNumber,
        setPhoneNumber,
        initiateCall,
        callStatus,
        errorMessage,
        initializeDevice,
        device,
        isDeviceRegistered,
        isInitializing,
    } = useCallStore();

    useEffect(() => {
        // Initialize device if not already done
        const token = localStorage.getItem("token");
        if (!device && token && !isInitializing) {
            initializeDevice();
        }
    }, [device, initializeDevice, isInitializing]);

    const handleKeyPress = (key: string) => {
        if (phoneNumber.length < 15) {
            setPhoneNumber(phoneNumber + key);
        }
    };

    const handleDelete = () => {
        setPhoneNumber(phoneNumber.slice(0, -1));
    };

    const handleCall = async () => {
        if (phoneNumber) {
            await initiateCall();
            onCallStart();
        }
    };

    const keys = [
        { label: "1", sub: "" }, // 1 traditionally doesn't have letters for dialing, or it's voicemail. 
        { label: "2", sub: "abc" },
        { label: "3", sub: "def" },
        { label: "4", sub: "ghi" },
        { label: "5", sub: "jkl" },
        { label: "6", sub: "mno" },
        { label: "7", sub: "pqrs" },
        { label: "8", sub: "tuv" },
        { label: "9", sub: "wxyz" },
        { label: "*", sub: "" },
        { label: "0", sub: "+" },
        { label: "#", sub: "" },
    ];

    // Long press logic
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isLongPress, setIsLongPress] = useState(false);

    const handlePointerDown = (key: { label: string, sub: string }) => {
        setIsLongPress(false);
        if (key.sub) {
            timerRef.current = setTimeout(() => {
                setIsLongPress(true);
                // On long press, insert the first character of `sub` if it's "+", "abc" doesn't usually dial letters but for + it's useful
                const charToInsert = key.label === "0" ? "+" : key.label; // Only 0/+ is typically long-pressed on a dialer, but we can extend this
                if (charToInsert) {
                    handleKeyPress(charToInsert);
                }
            }, 500); // 500ms long press threshold
        }
    };

    const handlePointerUp = (key: { label: string, sub: string }) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (!isLongPress) {
            // It was a short press
            handleKeyPress(key.label);
        }
    };

    const handlePointerLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Determine Statuses
    let dialerStatus: DialerStatusType = "Disconnected";
    if (isDeviceRegistered) {
        dialerStatus = "Connected";
    } else if (isInitializing) {
        dialerStatus = "Initializing";
    } else if (errorMessage) {
        dialerStatus = "Disconnected";
    } else if (device) {
        dialerStatus = "Connected";
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {/* Dialer Container */}
            <div
                className="flex flex-1 flex-col gap-3 rounded-3xl border border-white/10 p-6 shadow-sm backdrop-blur-[42px]"
                style={{
                    background: "linear-gradient(93.78deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)"
                }}
            >
                {/* Dialer Header */}
                <div className="flex items-center gap-3">
                    <h2 className="flex-1 font-medium text-[#0c335c] text-base">Dialer</h2>
                    <DialerStatusPill status={dialerStatus} />
                </div>

                {/* Status Message */}
                {errorMessage && (
                    <div className="text-center text-xs text-red-500">{errorMessage}</div>
                )}

                {/* Input Layer */}
                <div className="flex flex-col gap-6 items-center w-full mt-2">
                    {/* Input Header */}
                    <div
                        className="relative flex items-center justify-center w-full h-[56px] px-4 rounded-2xl border border-[rgba(17,17,17,0.05)] backdrop-blur-[42px]"
                        style={{
                            background: "linear-gradient(132.68deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                        }}
                    >
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow + prefix for international numbers (e.g. +91, +1)
                                if (/^\+?[0-9*#]*$/.test(val) && val.length <= 15) {
                                    setPhoneNumber(val);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCall();
                            }}
                            placeholder="+1XXXXXXXXXX"
                            className="w-full bg-transparent text-center font-medium text-base text-[#111] placeholder:text-[#111] placeholder:opacity-60 focus:outline-none"
                        />
                        {phoneNumber.length > 0 && (
                            <button
                                onClick={handleDelete}
                                className="absolute right-4 text-gray-400 hover:text-gray-600"
                            >
                                <Delete className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-6 w-full place-items-center">
                        {keys.map((key) => (
                            <button
                                key={key.label}
                                onPointerDown={() => handlePointerDown(key)}
                                onPointerUp={() => handlePointerUp(key)}
                                onPointerLeave={handlePointerLeave}
                                // Prevent default context menu on touch devices during long press
                                onContextMenu={(e) => { e.preventDefault(); return false; }}
                                className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all hover:bg-white/10 active:scale-95 touch-none select-none"
                                style={{
                                    background: "linear-gradient(95.95deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                                }}
                            >
                                <span className="text-[21px] text-[#111] leading-none">
                                    {key.label}
                                </span>
                                {key.sub && (
                                    <span className="text-[14px] text-[#111] opacity-60 leading-none uppercase">
                                        {key.sub}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Call Button */}
                    <CallControlButton
                        variant="call"
                        onClick={handleCall}
                        disabled={!phoneNumber || !isDeviceRegistered}
                    />
                </div>
            </div>
        </div>
    );
}
