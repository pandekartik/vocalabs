"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import {
    Phone, Users, Voicemail, BarChart, Bell, Settings, LogOut, Clock,
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
                "flex w-full items-center gap-[10px] rounded-[10px] transition-all duration-200 text-[14px] leading-[20px]",
                isActive
                    ? "bg-[#fe641f] text-white font-bold shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)] px-[16px] py-[10px]"
                    : "text-[#64748b] font-normal hover:bg-white/50 hover:text-navy p-[12px]"
            )}
        >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "opacity-70")} />
            <span className={isActive ? "font-bold" : ""}>{label}</span>
        </Link>
    );
}

const SUPERVISOR_ITEMS = [
    { icon: Phone, label: "Dialer", href: "/dialer" },
    { icon: Clock, label: "Call History", href: "/call-history" },
    { icon: Users, label: "Team", href: "/dashboard/team" },
    { icon: Voicemail, label: "Voicemails", href: "/dashboard/voicemails" },
    { icon: Bell, label: "Reminders", href: "/dashboard/reminders" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const AGENT_ITEMS = [
    { icon: Phone, label: "Dialer", href: "/dialer" },
    { icon: Clock, label: "Call History", href: "/call-history" },
    { icon: Bell, label: "Reminders", href: "/reminders" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

const PLATFORM_ADMIN_ITEMS = [
    { icon: BarChart, label: "Dashboard", href: "/admin/platform" },
    { icon: Users, label: "Organizations", href: "/admin/platform/orgs" },
    { icon: Clock, label: "Audit Trail", href: "/admin/platform/audit" },
    { icon: Settings, label: "System Health", href: "/admin/platform/health" },
    { icon: Settings, label: "Settings", href: "/admin/platform/settings" },
];

const ORG_ADMIN_ITEMS = [
    { icon: BarChart, label: "Dashboard", href: "/admin/org" },
    { icon: Users, label: "User Management", href: "/admin/org/users" },
    { icon: Users, label: "Supervisors", href: "/admin/org/supervisors" },
    { icon: Phone, label: "Calls Overview", href: "/admin/org/calls" },
    { icon: Clock, label: "Audit Log", href: "/admin/org/audit" },
    { icon: Settings, label: "Settings", href: "/admin/org/settings" },
];

type UserRole = "SUPERVISOR" | "AGENT" | "PLATFORM_ADMIN" | "ORG_ADMIN";

export function SideNav() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        if (pathname.startsWith("/admin/platform")) {
            setRole("PLATFORM_ADMIN");
            return;
        }
        if (pathname.startsWith("/admin/org")) {
            setRole("ORG_ADMIN");
            return;
        }
        if (pathname.startsWith("/dashboard")) {
            setRole("SUPERVISOR");
            return;
        }
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const r = user?.role?.toUpperCase();
                if (r === "PLATFORM_ADMIN") setRole("PLATFORM_ADMIN");
                else if (r === "ORG_ADMIN") setRole("ORG_ADMIN");
                else if (r === "SUPERVISOR" || r === "MANAGER") setRole("SUPERVISOR");
                else setRole("AGENT");
            } else {
                setRole("AGENT");
            }
        } catch {
            setRole("AGENT");
        }
    }, [pathname]);

    const items = role === "PLATFORM_ADMIN" ? PLATFORM_ADMIN_ITEMS
        : role === "ORG_ADMIN" ? ORG_ADMIN_ITEMS
            : role === "SUPERVISOR" ? SUPERVISOR_ITEMS
                : AGENT_ITEMS;

    return (
        <aside className="fixed left-6 top-[84px] h-[calc(100vh-108px)] w-[193px] shrink-0">
            <div
                className="flex h-full flex-col justify-between rounded-[16px] border border-[rgba(255,255,255,0.1)] px-[16px] py-[24px] shadow-[0px_4px_8px_0px_rgba(26,26,26,0.12)] backdrop-blur-[42px]"
                style={{ backgroundImage: "linear-gradient(91.179deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)" }}
            >
                <div className="flex flex-col gap-1">
                    {items.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            isActive={
                                item.href === "/admin/platform"
                                    ? pathname === "/admin/platform"
                                    : item.href === "/admin/org"
                                        ? pathname === "/admin/org"
                                        : item.href === "/dialer"
                                            ? pathname === "/dialer"
                                            : item.href === "/dashboard/team"
                                                ? pathname === "/dashboard/team"
                                                : pathname.startsWith(item.href)
                            }
                        />
                    ))}
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-[10px] rounded-[10px] p-[12px] text-[14px] font-normal text-[#64748b] transition-all hover:bg-white/50 hover:text-navy"
                >
                    <LogOut className="h-[14px] w-[14px]" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
