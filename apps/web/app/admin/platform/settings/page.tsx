"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Shield, Zap, AlertTriangle } from "lucide-react";

export default function PlatformSettingsScreen() {
    const flags = [
        { name: "New AI Model", status: "enabled", rollout: 100, orgs: "All" },
        { name: "Advanced Analytics", status: "beta", rollout: 25, orgs: "12 orgs" },
        { name: "Custom Integrations", status: "disabled", rollout: 0, orgs: "—" },
        { name: "Mobile App Access", status: "enabled", rollout: 100, orgs: "All" },
    ];
    const flagColor = (s: string) => s === "enabled" ? "text-green-700 bg-green-100" : s === "beta" ? "text-amber-700 bg-amber-100" : "text-red-700 bg-red-100";
    const flagDot = (s: string) => s === "enabled" ? "🟢" : s === "beta" ? "🟡" : "🔴";

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Platform Settings</h1>
                <p className="text-sm text-gray-500">Global configurations, feature flags, and security.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Feature Flags</h4>
                    <table className="w-full text-sm">
                        <thead><tr className="text-xs text-gray-400 text-left border-b border-gray-100">{["Feature", "Status", "Rollout %", "Organizations"].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
                        <tbody>
                            {flags.map(f => (
                                <tr key={f.name} className="border-b border-gray-50 last:border-none">
                                    <td className="py-2 pr-4 font-medium text-gray-800">{f.name}</td>
                                    <td className="py-2 pr-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flagColor(f.status)}`}>{flagDot(f.status)} {f.status}</span></td>
                                    <td className="py-2 pr-4 text-gray-600">{f.rollout}%</td>
                                    <td className="py-2 text-gray-500">{f.orgs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">General Settings</h4>
                    <div className="flex flex-col gap-3 text-sm">
                        {[["Platform Name", "Voca Labs"], ["Support Email", "support@vocalabs.com"]].map(([k, v]) => (
                            <div key={k}><label className="text-xs text-gray-400">{k}</label><input defaultValue={v} className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg mt-0.5 text-sm" /></div>
                        ))}
                        <div className="flex items-center justify-between"><span className="text-gray-600">Maintenance Mode</span><div className="w-10 h-5 rounded-full bg-gray-200 relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" /></div></div>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Shield size={14} /> Security Settings</h4>
                    {[["Require 2FA for Platform Admins", "✅ Yes"], ["Password Min Length", "12 characters"], ["Max Login Attempts", "5"], ["Lockout Duration", "30 minutes"], ["Session Lifetime", "8 hours"], ["Require HTTPS", "✅ Yes"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none"><span className="text-gray-600">{k}</span><span className="font-medium text-[#0C335C]">{v}</span></div>
                    ))}
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4 flex items-center gap-2"><Zap size={14} /> API Configuration</h4>
                    {[["Rate Limit (per org)", "10,000/hour"], ["Max Webhook Retries", "5"], ["Webhook Timeout", "30 seconds"], ["API Version", "v2.1"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none"><span className="text-gray-600">{k}</span><span className="font-mono font-medium text-[#0C335C]">{v}</span></div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
