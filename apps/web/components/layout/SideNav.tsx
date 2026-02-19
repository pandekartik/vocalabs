"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import {
    Phone,
    Contact,
    BarChart,
    Bell,
    Settings,
    LogOut,
    Users,
    Voicemail,
    Building2,
    ShieldCheck,
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
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                isActive
                    ? "bg-[#FE641F] text-white shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)]"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
            )}
        >
            <Icon className={cn("h-4 w-4", isActive ? "text-white" : "opacity-70")} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}

export function SideNav() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Define all possible nav items with their allowed roles
    const allNavItems = [
        {
            icon: BarChart,
            label: "Dashboard",
            href: "/dashboard",
            roles: ["Platform Admin", "Org Admin"]
        },
        {
            icon: Phone,
            label: "Dialer",
            href: "/dialer",
            roles: ["Supervisor", "Agent"]
        },
        {
            icon: Contact,
            label: "Call History",
            href: "/call-history",
            roles: ["Agent"]
        },
        {
            icon: Users, // Need to import Users
            label: "Team",
            href: "/team",
            roles: ["Supervisor"]
        },
        {
            icon: Voicemail, // Need to import Voicemail
            label: "Voicemails",
            href: "/voicemails",
            roles: ["Supervisor"]
        },
        {
            icon: BarChart,
            label: "Analytics",
            href: "/analytics",
            roles: ["Org Admin", "Supervisor", "Agent"]
        },
        {
            icon: Building2, // Need to import Building2 for Organizations
            label: "Organizations",
            href: "/organizations",
            roles: ["Platform Admin"]
        },
        {
            icon: Users,
            label: "Users",
            href: "/users",
            roles: ["Platform Admin", "Org Admin"]
        },
        {
            icon: Phone,
            label: "Telephony",
            href: "/telephony",
            roles: ["Platform Admin"]
        },
        {
            icon: ShieldCheck, // Need to import ShieldCheck for Security
            label: "Security",
            href: "/security",
            roles: ["Platform Admin"]
        },
        {
            icon: Bell,
            label: "Reminders",
            href: "/reminders",
            roles: ["Supervisor", "Agent"]
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/settings",
            roles: ["Platform Admin", "Org Admin", "Supervisor", "Agent"]
        },
    ];

    // Filter items based on the current user's role
    // If no user is logged in, show nothing or just public items (handled by protection usually)
    const userRole = user?.role;
    const navItems = allNavItems.filter(item =>
        userRole && item.roles.includes(userRole)
    );

    return (
        <aside className="fixed left-6 top-[84px] h-[calc(100vh-108px)] w-[193px] shrink-0">
            <div
                className="flex h-full flex-col justify-between rounded-2xl border border-white/10 px-4 py-6 shadow-[0px_4px_8px_0px_rgba(26,26,26,0.12)] backdrop-blur-[42px]"
                style={{
                    background:
                        "linear-gradient(91.18deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)",
                }}
            >
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="px-2 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        {userRole || "Guest"}
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-white/50 hover:text-foreground"
                    >
                        <LogOut className="h-4 w-4 opacity-70" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
