"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useCallStore } from "@/store/useCallStore";

export default function ActiveCallRightPanel() {
    const { transcript } = useCallStore();
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [transcript]);

    return (
        <div className="grid h-full grid-rows-3 gap-4">
            {/* Live Transcript Card */}
            <Card title="Live Transcript" className="min-h-0">
                <div className="h-full rounded-2xl border border-[rgba(17,17,17,0.05)] p-4 overflow-y-auto backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <div className="flex flex-col gap-4 text-base font-medium text-[#111] opacity-60 font-sans whitespace-pre-wrap">
                        {transcript.length > 0 ? (
                            transcript.map((msg, index) => (
                                <p key={index}>
                                    <span className="font-bold">{msg.speaker}:</span> {msg.text}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No transcript yet...</p>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>
            </Card>

            {/* Notes Card */}
            <Card title="Notes" className="min-h-0">
                <div className="h-full rounded-2xl border border-[rgba(17,17,17,0.05)] p-4 backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <textarea
                        placeholder="Enter notes..."
                        className="h-full w-full resize-none bg-transparent text-left font-sans text-base font-medium text-[#111] placeholder:text-[#111] placeholder:opacity-60 focus:outline-none"
                    />
                </div>
            </Card>

            {/* Tagging ID Card */}
            <Card title="Tagging ID" className="min-h-0">
                <div className="h-full rounded-2xl border border-[rgba(17,17,17,0.05)] p-4 backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <textarea
                        placeholder="Please Enter the Tagging IDs"
                        className="h-full w-full resize-none bg-transparent text-left font-sans text-base font-medium text-[#111] placeholder:text-[#111] placeholder:opacity-60 focus:outline-none"
                    />
                </div>
            </Card>
        </div>
    );
}
