"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Phone, Delete } from "lucide-react";
import { useCallStore } from "@/store/useCallStore";

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

    return (
        <Card title="Dialer" className="h-full">
            <div className="flex h-full flex-col justify-between pt-4">
                {/* Status Display */}
                <div className="text-center h-6 text-sm text-gray-500">
                    {errorMessage ? (
                        <span className="text-red-500">{errorMessage}</span>
                    ) : (
                        <span>{callStatus === 'idle' ? 'Ready' : callStatus}</span>
                    )}
                </div>

                {/* Input Display */}
                <div
                    className="relative flex h-[56px] w-full items-center justify-center border border-[rgba(17,17,17,0.05)] px-4 mb-2 rounded-[46px] backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
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
                        placeholder="Enter Number"
                        className="w-full bg-transparent text-center font-sans text-xl font-medium text-[#111] placeholder:text-gray-400 focus:outline-none"
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
                <div className="grid grid-cols-3 gap-y-3 gap-x-4 place-items-center mb-2">
                    {keys.map((key) => (
                        <button
                            key={key.label}
                            onClick={() => handleKeyPress(key.label)}
                            className="group flex h-[64px] w-[64px] flex-col items-center justify-center gap-[2px] rounded-[46px] border border-[rgba(17,17,17,0.05)] p-3 backdrop-blur-[42px] transition-all hover:bg-white/10 active:scale-95"
                            style={{
                                background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)",
                                aspectRatio: "1/1"
                            }}
                        >
                            <span className="font-sans text-xl font-medium text-[#111]">
                                {key.label}
                            </span>
                            {key.sub && (
                                <span className="font-sans text-[9px] font-medium text-gray-400">
                                    {key.sub}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Call Button */}
                <div className="flex justify-center pb-2">
                    <button
                        onClick={handleCall}
                        disabled={!phoneNumber || !device}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] transition-all active:scale-95 ${phoneNumber && device
                            ? "bg-[#1DB013] text-white shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] hover:bg-[#16A34A]"
                            : "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none"
                            }`}
                        style={phoneNumber && device ? { boxShadow: "0px 4px 14px 0px rgba(254, 100, 31, 0.30)" } : {}}
                    >
                        <Phone className="h-5 w-5 fill-current" />
                        <span className="font-sans text-base font-semibold">Call</span>
                    </button>
                </div>
            </div>
        </Card>
    );
}
