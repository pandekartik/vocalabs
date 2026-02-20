"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import {
    Phone, Users, Voicemail, BarChart, Bell, Settings, LogOut,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive?: boolean;
}

function NavItem({ icon: Icon, label, href, isActive }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex w-full items-center gap-3 rounded-sm px-4 py-3 transition-all duration-200 text-vl-sm font-medium",
                isActive
                    ? "bg-brand text-white shadow-vl-orange"
                    : "text-vl-gray-3 hover:bg-white/50 hover:text-navy"
            )}
        >
            <Icon className={cn("h-4 w-4", isActive ? "text-white" : "opacity-70")} />
            <span>{label}</span>
        </Link>
    );
}

const SUPERVISOR_ITEMS = [
    { icon: Phone, label: "Dialer", href: "/" },
    { icon: Users, label: "Team", href: "/dashboard/team" },
    { icon: Voicemail, label: "Voicemails", href: "/dashboard/voicemails" },
    { icon: BarChart, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Bell, label: "Reminders", href: "/dashboard/reminders" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const AGENT_ITEMS = [
    { icon: Phone, label: "Dialer", href: "/" },
    { icon: Voicemail, label: "Call History", href: "/call-history" },
    { icon: BarChart, label: "Analytics", href: "/analytics" },
    { icon: Bell, label: "Reminders", href: "/reminders" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

type UserRole = "SUPERVISOR" | "AGENT";

export function SideNav() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        if (pathname.startsWith("/dashboard")) {
            setRole("SUPERVISOR");
            return;
        }
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const r = user?.role?.toUpperCase();
                if (r === "SUPERVISOR" || r === "MANAGER") setRole("SUPERVISOR");
                else setRole("AGENT");
            } else {
                setRole("AGENT");
            }
        } catch {
            setRole("AGENT");
        }
    }, [pathname]);

    const items = role === "SUPERVISOR" ? SUPERVISOR_ITEMS : AGENT_ITEMS;

    return (
        <aside className="fixed left-6 top-[84px] h-[calc(100vh-108px)] w-[193px] shrink-0">
            <div
                className="flex h-full flex-col justify-between rounded-lg border border-white/10 px-4 py-6 shadow-vl-sm backdrop-blur-glass"
                style={{ background: "var(--vl-glass)" }}
            >
                <div className="flex flex-col gap-1">
                    {items.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            isActive={
                                item.href === "/dashboard/team"
                                    ? pathname === "/dashboard/team"
                                    : pathname.startsWith(item.href) && item.href !== "/"
                            }
                        />
                    ))}
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-vl-sm font-medium text-vl-gray-3 transition-all hover:bg-white/50 hover:text-navy"
                >
                    <LogOut className="h-4 w-4 opacity-70" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
