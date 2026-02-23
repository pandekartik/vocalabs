"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Bell } from "lucide-react";
import axios from "axios";

export default function OrgDashboard() {
    const [stats, setStats] = useState([
        { label: "Total Users", value: "-", change: "", action: "Manage", color: "text-[#0C335C]" },
        { label: "Supervisors", value: "-", change: "", action: "View", color: "text-blue-600" },
        { label: "Agents", value: "-", change: "", action: "View", color: "text-gray-700" },
        { label: "Active Calls", value: "-", change: "", action: "Monitor", color: "text-[#FE641F]" },
        { label: "Today's Calls", value: "-", change: "", action: "View details", color: "text-[#0C335C]" },
        { label: "Avg Handle Time", value: "-", change: "", action: "Analyze", color: "text-green-600" },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem("user");
                const token = localStorage.getItem("token");
                if (!userStr || !token) return;

                const user = JSON.parse(userStr);
                if (!user.organization_id) return;

                const headers = { Authorization: `Bearer ${token}` };

                const [orgRes, liveRes, statsRes] = await Promise.all([
                    axios.get(`https://api.vocalabstech.com/admin/organizations/${user.organization_id}`, { headers }),
                    axios.get(`https://api.vocalabstech.com/supervisor/live-calls`, { headers }),
                    axios.get(`https://api.vocalabstech.com/calls/my-calls/stats`, { headers })
                ]);

                const orgData = orgRes.data;
                const liveData = liveRes.data;
                const callsStats = statsRes.data;

                // Format duration safely
                const formatDuration = (seconds: number) => {
                    if (!seconds || seconds <= 0) return "0m 0s";
                    const m = Math.floor(seconds / 60);
                    const s = Math.floor(seconds % 60);
                    return `${m}m ${s}s`;
                };

                const users = orgData.users || [];
                const supervisorsCount = users.filter((u: any) => u.role?.toLowerCase() === 'supervisor').length;
                const agentsCount = users.filter((u: any) => u.role?.toLowerCase() === 'agent').length;

                setStats([
                    { label: "Total Users", value: users.length.toString(), change: "", action: "Manage", color: "text-[#0C335C]" },
                    { label: "Supervisors", value: supervisorsCount.toString(), change: "", action: "View", color: "text-blue-600" },
                    { label: "Agents", value: agentsCount.toString(), change: "", action: "View", color: "text-gray-700" },
                    { label: "Active Calls", value: Array.isArray(liveData) ? liveData.length.toString() : "0", change: "Live now", action: "Monitor", color: "text-[#FE641F]" },
                    { label: "Today's Calls", value: (callsStats.today_calls || 0).toString(), change: "", action: "View details", color: "text-[#0C335C]" },
                    { label: "Avg Handle Time", value: formatDuration(callsStats.avg_duration || 0), change: "", action: "Analyze", color: "text-green-600" },
                ]);

            } catch (error) {
                console.error("Failed to fetch dashboard metrics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Set up an interval to refresh live calls occasionally
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0C335C]">Organization Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your organization's activity and status.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <Card key={s.label} className="p-4 relative">
                        {loading && <div className="absolute inset-0 bg-white/50 animate-pulse rounded-xl" />}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.color} transition-all`}>{s.value}</p>
                                <p className="text-xs text-gray-400 mt-1 min-h-[16px]">{s.change}</p>
                            </div>
                            <button className="text-xs text-[#FE641F] font-medium hover:underline">{s.action}</button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Temporarily hidden sections */}
            <div className="hidden">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> System Health</h4>
                    </Card>
                    <Card className="p-5">
                        <h4 className="font-semibold text-[#0C335C] mb-3 flex items-center gap-2"><Bell size={14} /> Action Items</h4>
                    </Card>
                </div>
                <Card className="p-5">
                    <h4 className="font-semibold text-[#0C335C] mb-3">Recent Activity</h4>
                </Card>
            </div>

        </div>
    );
}
