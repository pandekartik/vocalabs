"use client";

import { Bell, ChevronDown, Clock, Phone } from "lucide-react";

import Image from "next/image";

function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/Logo.png"
                alt="Voca Labs"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
                priority
            />
        </div>
    );
}

export function TopBar() {
    return (
        <header className="flex h-[60px] w-full items-center justify-between border border-white/10 px-6 py-3 shadow-[0_4px_8px_0_rgba(26,26,26,0.12)] backdrop-blur-[42px]" style={{ background: "linear-gradient(95deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.80) 100%)" }}>
            <Logo />

            {/* Center Stats */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">

                {/* Call Time Stats */}
                <div
                    className="flex items-center gap-2 rounded-2xl border border-[rgba(17,17,17,0.05)] px-[17px] py-[8px] backdrop-blur-[42px]"
                    style={{ background: "linear-gradient(123.7deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)" }}
                >
                    <Clock className="h-4 w-4 text-[#111]" />
                    <div className="flex items-baseline gap-1">
                        <span className="font-sans text-xs font-normal text-[#111]">Call Time (Today) :</span>
                        <span className="font-sans text-sm font-medium text-[#111]">05 HR 19 MIN</span>
                    </div>
                </div>

                {/* Call Count Stats */}
                <div
                    className="flex items-center gap-2 rounded-2xl border border-[rgba(17,17,17,0.05)] px-[17px] py-[8px] backdrop-blur-[42px]"
                    style={{ background: "linear-gradient(116.8deg, rgba(17, 17, 17, 0.05) 4.09%, rgba(17, 17, 17, 0.02) 105.58%)" }}
                >
                    <Phone className="h-4 w-4 text-[#111]" />
                    <div className="flex items-baseline gap-1">
                        <span className="font-sans text-xs font-normal text-[#111]">No. of Calls (Today) :</span>
                        <span className="font-sans text-sm font-medium text-[#111]">47</span>
                    </div>
                </div>

            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">Kartik Pande</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
