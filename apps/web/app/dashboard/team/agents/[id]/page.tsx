"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import {
    ArrowLeft,
    MoreHorizontal,
    Phone,
    Mail,
    Calendar,
    Clock,
    TrendingUp,
    PhoneCall,
    Activity,
    Download,
    Settings,
    Shield,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data for the Agent
const MOCK_AGENT_DETAILS = {
    id: "1",
    name: "Alex Thompson",
    initials: "AT",
    email: "alex.t@vocalabs.ai",
    phone: "+1 (555) 019-2834",
    countryCode: "US",
    joinedDate: "Oct 12, 2023",
    type: "Inbound Only",
    status: "Live",

    // Performance Today
    callsToday: 42,
    callTimeToday: "4h 12m",
    avgDuration: "5m 30s",
    successRate: "94%",
};

// Mock Data for Call History Tab
interface CallLog {
    id: string;
    customerName: string;
    customerPhone: string;
    direction: "Inbound" | "Outbound";
    duration: string;
    timestamp: string;
    status: "Completed" | "Missed" | "Voicemail";
    sentiment: "Positive" | "Neutral" | "Negative";
    qualityScore: number;
}

const MOCK_CALL_HISTORY: CallLog[] = [
    { id: "c1", customerName: "Sarah Jenkins", customerPhone: "+1 (555) 111-2222", direction: "Inbound", duration: "12m 45s", timestamp: "10:30 AM Today", status: "Completed", sentiment: "Positive", qualityScore: 98 },
    { id: "c2", customerName: "Michael Chang", customerPhone: "+1 (555) 333-4444", direction: "Outbound", duration: "4m 20s", timestamp: "09:45 AM Today", status: "Completed", sentiment: "Neutral", qualityScore: 85 },
    { id: "c3", customerName: "Unknown Caller", customerPhone: "+1 (555) 999-0000", direction: "Inbound", duration: "0s", timestamp: "09:12 AM Today", status: "Missed", sentiment: "Neutral", qualityScore: 0 },
    { id: "c4", customerName: "Emily Roberts", customerPhone: "+1 (555) 777-8888", direction: "Inbound", duration: "25m 10s", timestamp: "Yesterday", status: "Completed", sentiment: "Negative", qualityScore: 65 },
    { id: "c5", customerName: "David Wilson", customerPhone: "+1 (555) 444-5555", direction: "Outbound", duration: "1m 15s", timestamp: "Yesterday", status: "Voicemail", sentiment: "Neutral", qualityScore: 0 },
];

type TabType = "history" | "performance" | "settings";

export default function AgentDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState<TabType>("history");
    const [historySearch, setHistorySearch] = useState("");

    // Call History Columns
    const callColumns: TableColumn<CallLog>[] = [
        {
            key: "customerName",
            label: "Customer",
            sortable: true,
            render: (call) => (
                <div className="flex flex-col py-1">
                    <span className="font-medium text-[#0C335C]">{call.customerName}</span>
                    <span className="text-xs text-gray-500">{call.customerPhone}</span>
                </div>
            )
        },
        {
            key: "direction",
            label: "Direction",
            render: (call) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${call.direction === 'Inbound' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                    {call.direction}
                </span>
            )
        },
        {
            key: "timestamp",
            label: "Time & Duration",
            render: (call) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#0C335C]">{call.duration}</span>
                    <span className="text-xs text-gray-400">{call.timestamp}</span>
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (call) => (
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${call.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                    call.status === 'Missed' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                    {call.status}
                </span>
            )
        },
        {
            key: "sentiment",
            label: "Sentiment",
            render: (call) => (
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${call.sentiment === 'Positive' ? 'bg-green-500' :
                        call.sentiment === 'Negative' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                    <span className="text-sm text-gray-600">{call.sentiment}</span>
                </div>
            )
        },
        {
            key: "qualityScore",
            label: "Quality Score",
            sortable: true,
            render: (call) => (
                call.qualityScore > 0 ? (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-16">
                            <div
                                className={`h-full rounded-full ${call.qualityScore > 80 ? 'bg-green-500' : call.qualityScore > 60 ? 'bg-orange-400' : 'bg-red-500'}`}
                                style={{ width: `${call.qualityScore}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-6">{call.qualityScore}</span>
                    </div>
                ) : <span className="text-gray-400 text-sm">-</span>
            )
        },
        {
            key: "id",
            label: "",
            width: "w-[80px]",
            render: () => (
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                    <MoreHorizontal size={18} />
                </button>
            )
        }
    ];

    const TabButton = ({ type, label, icon: Icon }: { type: TabType, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-all border-b-2 relative -mb-[2px] ${activeTab === type
                ? 'border-[#FE641F] text-[#FE641F]'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full max-w-[1200px] mx-auto pb-8 animate-in fade-in duration-300 w-full pl-8 pr-10">

                {/* Back Link */}
                <Link href="/test" className="flex items-center gap-2 text-gray-500 hover:text-[#0C335C] transition-colors mb-6 mt-2 w-fit">
                    <ArrowLeft size={16} />
                    <span className="font-medium text-sm">Back to Directory</span>
                </Link>

                {/* Agent Header Section */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-8 justify-between">

                    {/* Left: Profile Info */}
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center border-2 border-orange-100 shrink-0">
                            <span className="text-2xl font-bold text-[#FE641F]">{MOCK_AGENT_DETAILS.initials}</span>
                        </div>
                        <div className="flex flex-col pt-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-[#0C335C]">{MOCK_AGENT_DETAILS.name}</h1>
                                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    {MOCK_AGENT_DETAILS.status}
                                </span>
                            </div>

                            <span className="text-sm font-medium text-gray-500 mb-3 block">
                                {MOCK_AGENT_DETAILS.type} Agent
                            </span>

                            <div className="flex items-center gap-5 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Mail size={14} className="text-gray-400" />
                                    {MOCK_AGENT_DETAILS.email}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Phone size={14} className="text-gray-400" />
                                    {MOCK_AGENT_DETAILS.phone}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Calendar size={14} className="text-gray-400" />
                                    Joined {MOCK_AGENT_DETAILS.joinedDate}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Stats for Today */}
                    <div className="flex items-center gap-4 bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                        <div className="flex flex-col gap-1 px-4 border-r border-gray-200/60 last:border-0 h-full justify-center">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <PhoneCall size={12} /> Calls Today
                            </span>
                            <span className="text-2xl font-bold text-[#0C335C]">{MOCK_AGENT_DETAILS.callsToday}</span>
                        </div>
                        <div className="flex flex-col gap-1 px-4 border-r border-gray-200/60 last:border-0 h-full justify-center">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Clock size={12} /> Talk Time
                            </span>
                            <span className="text-2xl font-bold text-[#0C335C]">{MOCK_AGENT_DETAILS.callTimeToday}</span>
                        </div>
                        <div className="flex flex-col gap-1 px-4 h-full justify-center">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                Success Rate
                            </span>
                            <span className="text-2xl font-bold text-green-600">{MOCK_AGENT_DETAILS.successRate}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b-2 border-gray-100 flex gap-4 mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 pt-2">
                    <TabButton type="history" label="Call History" icon={FileText} />
                    <TabButton type="performance" label="Performance" icon={TrendingUp} />
                    <TabButton type="settings" label="Settings & Rules" icon={Settings} />
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* HISTORY TAB */}
                    {activeTab === "history" && (
                        <div className="flex flex-col h-full rounded-[24px] overflow-hidden">
                            <TableCard
                                title="Call Logs"
                                data={MOCK_CALL_HISTORY}
                                columns={callColumns}
                                keyExtractor={(log) => log.id}
                                searchPlaceholder="Search calls by customer name or phone..."

                                // Optional secondary action like downloading report
                                secondaryAction={
                                    <button className="bg-white border border-[#CBCBCB] text-[#0C335C] px-4 py-2 rounded-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                        <Download size={18} />
                                        <span className="font-medium text-sm">Export Report</span>
                                    </button>
                                }
                            />
                        </div>
                    )}

                    {/* PERFORMANCE TAB */}
                    {activeTab === "performance" && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm h-[300px] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Activity size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-[#0C335C]">Performance Analytics</h3>
                                <p className="text-gray-500 text-sm mt-2 max-w-[250px]">Charts and graphs for agent sentiment and call volume will be visualized here.</p>
                            </div>
                            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm h-[300px] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-[#0C335C]">Quality Assurance</h3>
                                <p className="text-gray-500 text-sm mt-2 max-w-[250px]">Call transcript reviews and AI generated compliance scores will be shown here.</p>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === "settings" && (
                        <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 max-w-[800px]">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-[#0C335C]">Agent Configuration</h3>
                                    <p className="text-gray-500 text-sm mt-1">Manage rules, limits, and system access for this agent.</p>
                                </div>
                                <button className="bg-white border border-[#CBCBCB] text-[#0C335C] px-4 py-2 rounded-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                    <Settings size={18} />
                                    <span className="font-medium text-sm">Edit Settings</span>
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Agent Role / Direction</p>
                                        <p className="text-[#0C335C] font-semibold">{MOCK_AGENT_DETAILS.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-sm font-semibold inline-flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Active Account
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Max Daily Calls</p>
                                        <p className="text-[#0C335C] font-semibold">100 Calls / Day</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Max Call Duration</p>
                                        <p className="text-[#0C335C] font-semibold">60 Minutes</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#0C335C] mb-4">Danger Zone</h4>
                                    <div className="border border-red-100 rounded-xl p-5 flex items-center justify-between bg-red-50/30">
                                        <div>
                                            <h5 className="font-semibold text-red-700">Deactivate Agent</h5>
                                            <p className="text-sm text-red-600/80 mt-1">Revoke access and stop all routing to this agent immediately.</p>
                                        </div>
                                        <button className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl font-semibold transition-colors border border-red-200">
                                            Deactivate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout>
    );
}
