"use client";

import { Card } from "@/components/ui/card";

export default function ActiveCallRightPanel() {
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
                        <p><span className="font-bold">Agent:</span> Thank you for calling HealthCare Solutions! We truly appreciate your call. How can I assist you today? Is there something specific you need help with?</p>
                        <p><span className="font-bold">Customer:</span> Hi there! I’m reaching out because I need some assistance regarding my recent prescription order. I want to ensure everything is in order.</p>
                        <p><span className="font-bold">Agent:</span> Of course! I’d be happy to help with that. Can you please provide me with your order number or the name on the account?</p>
                        <p><span className="font-bold">Customer:</span> Sure, the order number is #123456789.</p>
                        <p><span className="font-bold">Agent:</span> Thank you. Let me check the status for you...</p>
                        <p><span className="font-bold">Agent:</span> I see the order is processing and will ship tomorrow.</p>
                        <p><span className="font-bold">Customer:</span> Great, thank you!</p>
                        <p><span className="font-bold">Agent:</span> Is there anything else?</p>
                        <p><span className="font-bold">Customer:</span> No that's all.</p>
                        <p><span className="font-bold">Agent:</span> Have a great day!</p>
                        <p><span className="font-bold">Customer:</span> You too.</p>
                        <p><span className="font-bold">Agent:</span> Goodbye.</p>
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
