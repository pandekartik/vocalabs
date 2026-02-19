"use client";

import { useEffect, useState } from "react";
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
    LayoutDashboard,
    Building2,
    Users,
    Shield,
    PhoneCall,
    Voicemail,
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
                    ? "bg-[#FE641F] text-white shadow-[0px_4px_14px_0_rgba(254,100,31,0.3)]"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
            )}
        >
            <Icon className={cn("h-4 w-4", isActive ? "text-white" : "opacity-70")} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}

// Menu configurations for each role
const MENU_ITEMS = {
    // 1. Platform Admin
    "PLATFORM_ADMIN": [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Building2, label: "Organizations", href: "/organizations" },
        { icon: Users, label: "Users", href: "/users" },
        { icon: Phone, label: "Telephony", href: "/telephony" },
        { icon: Shield, label: "Security", href: "/security" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ],
    // 2. Org Admin
    "ORG_ADMIN": [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Users", href: "/users" },
        { icon: BarChart, label: "Analytics", href: "/analytics" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ],
    // 3. Supervisor (MANAGER in reference, assumes SUPERVISOR here)
    "SUPERVISOR": [
        { icon: Phone, label: "Dialer", href: "/" },
        { icon: Users, label: "Team", href: "/team" },
        { icon: Voicemail, label: "Voicemails", href: "/voicemails" },
        { icon: BarChart, label: "Analytics", href: "/analytics" },
        { icon: Bell, label: "Reminders", href: "/reminders" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ],
    // 4. Agent
    "AGENT": [
        { icon: Phone, label: "Dialer", href: "/" },
        { icon: Contact, label: "Call History", href: "/call-history" },
        { icon: BarChart, label: "Analytics", href: "/analytics" },
        { icon: Bell, label: "Reminders", href: "/reminders" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ],
};

type UserRole = keyof typeof MENU_ITEMS;

export function SideNav() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        try {
            // Fetch role from localStorage similar to reference code
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const userRole = user?.role?.toUpperCase();

                // Map "MANAGER" from reference to "SUPERVISOR" if needed, 
                // or just accept strictly what's in local storage.
                // Assuming the new roles will be set correctly in the backend/login.
                // For fallback/compatibility:
                if (userRole === 'MANAGER') setRole('SUPERVISOR');
                else if (MENU_ITEMS[userRole as UserRole]) {
                    setRole(userRole as UserRole);
                } else {
                    // Default fallback or handle unknown roles
                    setRole('AGENT');
                }
            } else {
                // Default to AGENT if not logged in (for now/dev)
                setRole('AGENT');
            }
        } catch (e) {
            console.error("Failed to parse user role", e);
            setRole('AGENT');
        }
    }, []);

    const navItems = role ? MENU_ITEMS[role] : [];

    return (
        <aside className="fixed left-6 top-[84px] h-[calc(100vh-108px)] w-[193px] shrink-0">
            <div
                className="flex h-full flex-col justify-between rounded-2xl border border-white/10 px-4 py-6 shadow-[0px_4px_8px_0px_rgba(26,26,26,0.12)] backdrop-blur-[42px]"
                style={{
                    background:
                        "linear-gradient(91.18deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)",
                }}
            >
                <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-white/50 hover:text-foreground"
                >
                    <LogOut className="h-4 w-4 opacity-70" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
