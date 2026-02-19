"use client";

import { Bell, ChevronDown } from "lucide-react";

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

            <div className="flex items-center gap-6">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 hover:bg-gray-50">
                    <Bell className="h-5 w-5 text-gray-600" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">Kartik Pande</p>
                        <p className="text-xs text-muted-foreground">Agent</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
