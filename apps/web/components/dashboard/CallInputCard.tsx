"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useCallStore } from "@/store/useCallStore";
import { sanitizeDTMFInput } from "@/lib/dtmf";
import { Send } from "lucide-react";

export default function CallInputCard() {
    const { sendDTMF, callStatus } = useCallStore();
    const [input, setInput] = useState("");

    const isInCall = callStatus === "in-progress";

    const sanitized = sanitizeDTMFInput(input);

    const handleSend = () => {
        if (!sanitized || !isInCall) return;
        sendDTMF(sanitized);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card title="Call Input" className="h-full">
            <div className="flex h-full flex-col justify-between pt-2 gap-3">
                <div
                    className="flex flex-1 self-stretch flex-col gap-2 p-4 rounded-2xl border border-[rgba(17,17,17,0.05)] backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isInCall ? "Type digits or letters, press Enter to send DTMF" : "Start a call to send DTMF tones"}
                        disabled={!isInCall}
                        className="h-full w-full resize-none bg-transparent text-left font-sans text-base font-medium text-[#111] placeholder:text-[#111] placeholder:opacity-60 focus:outline-none disabled:opacity-40"
                    />
                </div>

                {/* Sanitized preview + send button */}
                <div className="flex items-center gap-2">
                    <div
                        className="flex-1 flex items-center px-3 py-2 rounded-xl border border-[rgba(17,17,17,0.05)] min-h-[40px]"
                        style={{
                            background: "linear-gradient(96deg, rgba(17, 17, 17, 0.03) -4.09%, rgba(17, 17, 17, 0.01) 105.58%)"
                        }}
                    >
                        {sanitized ? (
                            <span className="text-sm font-mono text-[#0c335c] font-medium tracking-wider">
                                Will send: {sanitized}
                            </span>
                        ) : (
                            <span className="text-sm text-[#111] opacity-40">
                                {input ? "No valid DTMF characters" : "DTMF preview"}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!sanitized || !isInCall}
                        className="flex items-center justify-center h-[40px] w-[40px] rounded-xl bg-[#0c335c] text-white transition-all hover:bg-[#0a2a4d] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
