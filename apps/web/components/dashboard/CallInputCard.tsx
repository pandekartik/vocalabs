"use client";

import { Card } from "@/components/ui/card";

export default function CallInputCard() {
    return (
        <Card title="Call Input" className="h-full">
            <div className="flex h-full flex-col justify-between pt-2">
                <div className="flex flex-1 self-stretch items-start gap-2 p-4 rounded-2xl border border-[rgba(17,17,17,0.05)] backdrop-blur-[42px]"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <textarea
                        placeholder="Please Enter the Inputs"
                        className="h-full w-full resize-none bg-transparent text-left font-sans text-base font-medium text-[#111] placeholder:text-[#111] placeholder:opacity-60 focus:outline-none"
                    />
                </div>

                {/* Additional inputs from design 32:1313? 
                   The design snippet showed "Call Input" header and "Please Enter the Inputs".
                   It seems to be a generic input area. I'll stick to one for now.
                */}
            </div>
        </Card>
    );
}
