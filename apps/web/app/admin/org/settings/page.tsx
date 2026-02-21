"use client";
import React from "react";
import { Card } from "@/components/ui/card";

export default function OrgSettingsScreen() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const integrations = [
        { name: "Salesforce", status: "connected" }, { name: "HubSpot", status: "disconnected" },
        { name: "Slack", status: "connected" }, { name: "Zapier", status: "needs-auth" },
    ];

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

    const intColor = (s: string) => s === "connected" ? "green" : s === "needs-auth" ? "amber" : "gray";
    const intLabel = (s: string) => s === "connected" ? "✅ Connected" : s === "needs-auth" ? "⚠️ Needs re-auth" : "❌ Not connected";

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Organization Settings</h1>
                <p className="text-sm text-gray-500">Manage business hours, integrations, and compliance.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Organization Profile</h4>
                    <div className="flex flex-col gap-3">
                        {[["Organization Name", "Acme Corporation"], ["Website", "www.acme.com"], ["Industry", "Technology"], ["Timezone", "America/New_York"]].map(([k, v]) => (
                            <div key={k}><label className="text-xs text-gray-400">{k}</label><input defaultValue={v} className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg mt-0.5 text-sm bg-white" /></div>
                        ))}
                    </div>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Business Hours</h4>
                    <div className="flex flex-col gap-1.5 text-sm">
                        {days.map((d, i) => (
                            <div key={d} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-none">
                                <span className="text-gray-600 w-24">{d}</span>
                                {i < 5 ? (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>9:00 AM</span><span>—</span><span>6:00 PM</span>
                                        <Badge text="Open" color="green" />
                                    </div>
                                ) : <Badge text="Closed" color="gray" />}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Integrations</h4>
                    <div className="flex flex-col gap-2">
                        {integrations.map(i => (
                            <div key={i.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">{i.name[0]}</div>
                                    <div><p className="text-sm font-medium text-[#0C335C]">{i.name}</p><p className={`text-xs ${i.status === "connected" ? "text-green-600" : i.status === "needs-auth" ? "text-amber-600" : "text-gray-400"}`}>{intLabel(i.status)}</p></div>
                                </div>
                                <button className={`text-xs px-3 py-1 rounded-lg border font-medium ${i.status === "connected" ? "border-gray-200 text-gray-600 hover:bg-gray-100" : i.status === "needs-auth" ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-[#FE641F] text-[#FE641F] hover:bg-orange-50"}`}>
                                    {i.status === "connected" ? "Configure" : i.status === "needs-auth" ? "Reconnect" : "Connect"}
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-4">Recording & Compliance</h4>
                    {[["Call Recording", "✅ Enabled for all calls"], ["Recording Retention", "90 days"], ["AI Transcription", "✅ Enabled"], ["GDPR Retention", "365 days"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none">
                            <span className="text-gray-600">{k}</span><span className="font-medium text-[#0C335C]">{v}</span>
                        </div>
                    ))}
                    <h4 className="font-semibold text-[#0C335C] mb-3 mt-4">Billing & Plan</h4>
                    {[["Current Plan", "Professional"], ["Monthly Cost", "$149/month"], ["Next Invoice", "Feb 15, 2025"], ["Payment Method", "Visa •••• 4242"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-none">
                            <span className="text-gray-600">{k}</span><span className="font-medium text-[#0C335C]">{v}</span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
