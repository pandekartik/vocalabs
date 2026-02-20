"use client";
import { useState } from "react";
import PlatformAdminFlow from "./components/PlatformAdminFlow";
import OrgAdminFlow from "./components/OrgAdminFlow";
import { Shield, Building2, ChevronRight } from "lucide-react";

type Role = null | "platform" | "org";

export default function TestPage() {
    const [role, setRole] = useState<Role>(null);

    if (role === "platform") return <PlatformAdminFlow onBack={() => setRole(null)} />;
    if (role === "org") return <OrgAdminFlow onBack={() => setRole(null)} />;

    return (
        <div className="min-h-screen flex items-center justify-center" style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #fdf0e8 100%)"
        }}>
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0C335C]">Admin Flow Demo</h1>
                    <p className="text-gray-500 mt-2">Select a role to preview the admin interface</p>
                </div>
                <div className="flex gap-6 justify-center">
                    <button
                        onClick={() => setRole("platform")}
                        className="group flex flex-col items-center gap-4 bg-white rounded-2xl p-8 w-64 border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#FE641F]/30 transition-all"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <Shield size={28} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="font-bold text-[#0C335C] text-lg">Platform Admin</p>
                            <p className="text-sm text-gray-500 mt-1">Manage all organizations, system health & global settings</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#FE641F] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Enter <ChevronRight size={16} />
                        </div>
                    </button>
                    <button
                        onClick={() => setRole("org")}
                        className="group flex flex-col items-center gap-4 bg-white rounded-2xl p-8 w-64 border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#FE641F]/30 transition-all"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Building2 size={28} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="font-bold text-[#0C335C] text-lg">Org Admin</p>
                            <p className="text-sm text-gray-500 mt-1">Manage your organization's users, calls & settings</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#FE641F] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Enter <ChevronRight size={16} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
