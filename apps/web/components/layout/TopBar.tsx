"use client";

import { useEffect, useState } from "react";
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
    const [user, setUser] = useState<{ firstName: string; lastName: string; role: string } | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser({
                    firstName: userData.first_name || "Guest",
                    lastName: userData.last_name || "",
                    role: userData.role || "User"
                });
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const getRoleLabel = (role: string) => {
        const roleMap: Record<string, string> = {
            "AGENT": "Agent",
            "SUPERVISOR": "Manager",
            "MANAGER": "Manager",
            "ORG_ADMIN": "Admin",
            "PLATFORM_ADMIN": "VocaLabs Admin"
        };
        return roleMap[role] || role;
    };

    return (
        <header
            className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-between px-6 py-3 border-b border-white/10 shadow-vl-sm backdrop-blur-glass"
            style={{ background: "var(--vl-glass-top)" }}
        >
            <Logo />

            {/* Center Stats — agents & supervisors only */}
            {user && ["AGENT", "SUPERVISOR", "MANAGER"].includes(user.role) && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                    {[
                        { icon: Clock, label: "Call Time (Today)", value: "05 HR 19 MIN" },
                        { icon: Phone, label: "No. of Calls (Today)", value: "47" },
                    ].map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 rounded-md border border-[rgba(17,17,17,0.05)] px-4 py-2 backdrop-blur-glass"
                            style={{ background: "var(--vl-glass-dark)" }}
                        >
                            <Icon className="h-4 w-4 text-ink" />
                            <div className="flex items-baseline gap-1">
                                <span className="text-vl-xs text-ink">{label}:</span>
                                <span className="text-vl-sm font-medium text-ink">{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-vl-sm font-semibold text-navy">
                        {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
                    </p>
                    <p className="text-vl-xs text-vl-gray-3">
                        {user ? getRoleLabel(user.role) : "Guest"}
                    </p>
                </div>
                <button className="text-vl-gray-3 hover:text-ink transition-colors">
                    <ChevronDown className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
