import { useEffect } from "react";
import { Phone, Delete, User } from "lucide-react";
import { useCallStore } from "@/store/useCallStore";
import { cn } from "@repo/ui/lib/utils";
import AgentStatusPill, { AgentStatusType } from "./AgentStatusPill";
import DialerStatusPill, { DialerStatusType } from "./DialerStatusPill";
import AgentInfoHeader from "./AgentInfoHeader";
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
        device
    } = useCallStore();

    useEffect(() => {
        if (!device) {
            initializeDevice();
        }
    }, [device, initializeDevice]);

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

    // Determine Statuses
    const agentStatus: AgentStatusType = (callStatus === "in-progress" || callStatus === "ringing") ? "On Call" : "Live";

    let dialerStatus: DialerStatusType = "Disconnected";
    if (callStatus === "registered" || device) {
        dialerStatus = "Connected";
    } else if (callStatus === "idle" && !device) { // Or a specific initializing state if we had one
        dialerStatus = "Initializing";
    }
    // Simple override for now as 'idle' usually means ready/connected in our store logic after init
    if (device) dialerStatus = "Connected";
    if (!device && !errorMessage) dialerStatus = "Initializing";
    if (errorMessage) dialerStatus = "Disconnected";



    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {/* Agent Info Header */}
            <AgentInfoHeader status={agentStatus} />

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
                                if (/^[0-9*#+]*$/.test(val) && val.length <= 15) {
                                    setPhoneNumber(val);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCall();
                            }}
                            placeholder="Please Enter the Phone Number"
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
                                onClick={() => handleKeyPress(key.label)}
                                className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all hover:bg-white/10 active:scale-95"
                                style={{
                                    background: "linear-gradient(95.95deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                                }}
                            >
                                <span className="text-[21px] text-[#111] leading-none">
                                    {key.label}
                                </span>
                                {key.sub && (
                                    <span className="text-[14px] text-[#111] opacity-60 leading-none">
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
                        disabled={!phoneNumber || !device}
                    />
                </div>
            </div>
        </div>
    );
}
