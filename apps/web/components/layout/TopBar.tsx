"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, Clock, Phone } from "lucide-react";
import Image from "next/image";
import { useCallStore } from "@/store/useCallStore";
import AgentStatusPill, { AgentStatusType } from "@/components/dashboard/AgentStatusPill";
import axios from "axios";

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
    const [user, setUser] = useState<{ firstName: string; lastName: string; role: string; phone?: string; initials?: string; organization_id?: string; user_id?: string; } | null>(null);
    const { callStatus, isDeviceRegistered } = useCallStore();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                let firstName = userData.first_name || "Guest";
                let lastName = userData.last_name || "";

                const setUserStateAndInitials = (fName: string, lName: string) => {
                    const initials = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();
                    setUser({
                        firstName: fName,
                        lastName: lName,
                        role: userData.role || "User",
                        phone: "+91 7722010666", // Mocking phone number for now as it's not in the generic user object
                        initials,
                        organization_id: userData.organization_id,
                        user_id: userData.user_id
                    });
                };

                // Set optimistic state first
                setUserStateAndInitials(firstName, lastName);

                // Fetch real name for ORG_ADMIN since auth returns no name
                if (userData.role?.toUpperCase() === "ORG_ADMIN" && userData.organization_id && token) {
                    axios.get(`https://api.vocalabstech.com/admin/organizations/${userData.organization_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).then(res => {
                        const adminData = res.data?.admin;
                        if (adminData && adminData.first_name) {
                            setUserStateAndInitials(adminData.first_name, adminData.last_name || "");
                        }
                    }).catch(err => console.error("Failed fetching org admin user details for topbar", err));
                }

            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const getRoleLabel = (role: string) => {
        const r = role.toUpperCase();
        const roleMap: Record<string, string> = {
            "AGENT": "Agent",
            "SUPERVISOR": "Manager",
            "MANAGER": "Manager",
            "ORG_ADMIN": "Organization Admin",
            "PLATFORM_ADMIN": "VocaLabs Admin"
        };
        return roleMap[r] || role;
    };

    return (
        <header
            className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-between px-6 py-3 border-b border-white/10 shadow-vl-sm backdrop-blur-glass"
            style={{ background: "var(--vl-glass-top)" }}
        >
            <Logo />

            {/* Center Stats — agents & supervisors only */}
            {user && ["AGENT", "SUPERVISOR", "MANAGER"].includes(user.role?.toUpperCase()) && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
                    {user.phone && (
                        <div className="flex items-center rounded-full border border-brand bg-[#fe641f]/10 px-4 py-1.5 backdrop-blur-md text-sm">
                            <span className="font-semibold text-[#111]">{user.phone}</span>
                        </div>
                    )}

                    <AgentStatusPill
                        status={
                            callStatus === 'in-progress' ? "On Call" :
                                isDeviceRegistered ? "Live" : "Offline"
                        }
                    />

                    <div className="flex items-center gap-4 rounded-full border border-brand bg-[#fe641f]/10 px-4 py-1.5 backdrop-blur-md text-sm">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#64748b]" />
                            <span className="text-[#64748b]">Call Time:</span>
                            <span className="font-semibold text-[#111]">05h 19m</span>
                        </div>
                        <div className="w-[1px] h-4 bg-black/10"></div>
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4 text-[#64748b]" />
                            <span className="text-[#64748b]">Calls:</span>
                            <span className="font-semibold text-[#111]">47</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 pr-2">
                <div className="text-right flex flex-col justify-center items-end">
                    <p className="text-sm font-semibold text-navy leading-none mb-1.5">
                        {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
                    </p>
                    <p className="text-xs text-[#64748b] leading-none">
                        {user ? getRoleLabel(user.role) : "Guest"}
                    </p>
                </div>
            </div>
        </header>
    );
}
