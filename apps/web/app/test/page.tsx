"use client";
import { Shield, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TestPage() {
    const router = useRouter();

    const handleRoleSelect = (role: "platform" | "org") => {
        // Set mock user data in localStorage to simulate login for the SideNav
        const user = {
            first_name: role === "platform" ? "Platform" : "Org",
            last_name: "Admin",
            role: role === "platform" ? "PLATFORM_ADMIN" : "ORG_ADMIN",
            email: "admin@example.com"
        };
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate to the respective dashboard
        if (role === "platform") {
            router.push("/admin/platform");
        } else {
            router.push("/admin/org");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #fdf0e8 100%)"
        }}>
            <div className="text-center max-w-2xl w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0C335C]">Admin Flow Demo</h1>
                    <p className="text-gray-500 mt-2">Select a role to preview the fully integrated admin interface.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
                    <button
                        onClick={() => handleRoleSelect("platform")}
                        className="group flex flex-col items-center flex-1 gap-4 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#FE641F]/30 transition-all text-left"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors shrink-0 mx-auto">
                            <Shield size={28} className="text-purple-600" />
                        </div>
                        <div className="text-center flex-1">
                            <p className="font-bold text-[#0C335C] text-lg">Platform Admin</p>
                            <p className="text-sm text-gray-500 mt-1">Manage all organizations, system health & global settings across VocaLabs.</p>
                        </div>
                        <div className="flex items-center justify-center w-full mt-auto">
                            <div className="flex items-center gap-1 text-[#FE641F] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Enter Dashboard <ChevronRight size={16} />
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect("org")}
                        className="group flex flex-col items-center flex-1 gap-4 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl hover:border-[#FE641F]/30 transition-all text-left"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0 mx-auto">
                            <Building2 size={28} className="text-blue-600" />
                        </div>
                        <div className="text-center flex-1">
                            <p className="font-bold text-[#0C335C] text-lg">Org Admin</p>
                            <p className="text-sm text-gray-500 mt-1">Manage your organization's users, active calls, statistics & settings.</p>
                        </div>
                        <div className="flex items-center justify-center w-full mt-auto">
                            <div className="flex items-center gap-1 text-[#FE641F] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Enter Dashboard <ChevronRight size={16} />
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200">
                    <Link href="/" className="text-sm text-gray-500 hover:text-[#0C335C] transition-colors flex items-center justify-center gap-2">
                        ← Back to standard Dialer interface
                    </Link>
                </div>
            </div>
        </div>
    );
}
