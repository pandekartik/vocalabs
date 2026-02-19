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
    type LucideIcon,
} from "lucide-react";

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

    const navItems = [
        { icon: Phone, label: "Dialer", href: "/" },
        { icon: Contact, label: "Call History", href: "/call-history" },
        { icon: BarChart, label: "Analytics", href: "/analytics" },
        { icon: Bell, label: "Reminders", href: "/reminders" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ];

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

                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-white/50 hover:text-foreground">
                    <LogOut className="h-4 w-4 opacity-70" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
