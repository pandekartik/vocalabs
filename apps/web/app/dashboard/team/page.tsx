"use client";

import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AddAgentModal } from "@/components/agents/AddAgentModal";
import { BulkUploadModal } from "@/components/agents/BulkUploadModal";
import { UploadCloud, UserPlus, MoreHorizontal, Eye, Edit2, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Data Interfaces
interface Agent {
    id: string;
    avatarUrl?: string;
    initials: string;
    name: string;
    email: string;
    phone: string;
    countryCode: string; // e.g., "US", "IN"
    callTime: string;
    callsToday: number;
    type: "Inbound Only" | "Outbound Only" | "Both";
    status: "Live" | "Offline" | "On Call" | "Paused";
    lastActive: string;
}

// Mock Data
const MOCK_AGENTS: Agent[] = [
    { id: "1", initials: "JD", name: "John Doe", email: "john.doe@company.com", phone: "+1 (555) 123-4567", countryCode: "US", callTime: "4h 23m", callsToday: 47, type: "Both", status: "Live", lastActive: "2 min ago" },
    { id: "2", initials: "RM", name: "Riya Mehta", email: "riya.mehta@company.com", phone: "+91 98765 43210", countryCode: "IN", callTime: "5h 19m", callsToday: 34, type: "Outbound Only", status: "Offline", lastActive: "1 hour ago" },
    { id: "3", initials: "NV", name: "Nisha Verma", email: "nisha.v@company.com", phone: "+1 (555) 234-5678", countryCode: "US", callTime: "4h 18m", callsToday: 45, type: "Both", status: "On Call", lastActive: "Just now" },
    { id: "4", initials: "VJ", name: "Vikram Joshi", email: "v.joshi@company.com", phone: "+44 20 7123 4567", countryCode: "GB", callTime: "0h 12m", callsToday: 2, type: "Outbound Only", status: "Paused", lastActive: "15 min ago" },
    { id: "5", initials: "RS", name: "Rohan Singh", email: "rohan.s@company.com", phone: "+91 99887 76655", countryCode: "IN", callTime: "8h 32m", callsToday: 88, type: "Inbound Only", status: "Live", lastActive: "1 min ago" },
    { id: "6", initials: "SK", name: "Sanya Kapoor", email: "sanya.k@company.com", phone: "+1 (555) 345-6789", countryCode: "US", callTime: "7h 31m", callsToday: 62, type: "Both", status: "On Call", lastActive: "Just now" },
    { id: "7", initials: "PG", name: "Priya Gupta", email: "priya.g@company.com", phone: "+61 2 1234 5678", countryCode: "AU", callTime: "4h 36m", callsToday: 41, type: "Outbound Only", status: "Live", lastActive: "3 min ago" },
    { id: "8", initials: "KD", name: "Karan Desai", email: "karan.d@company.com", phone: "+1 (555) 456-7890", countryCode: "US", callTime: "3h 42m", callsToday: 52, type: "Both", status: "Paused", lastActive: "45 min ago" },
    { id: "9", initials: "AR", name: "Anaya Reddy", email: "anaya.r@company.com", phone: "+44 20 7987 6543", countryCode: "GB", callTime: "5h 34m", callsToday: 19, type: "Outbound Only", status: "Offline", lastActive: "2 hours ago" },
    { id: "10", initials: "DP", name: "Dev Patel", email: "dev.patel@company.com", phone: "+91 91234 56789", countryCode: "IN", callTime: "1h 13m", callsToday: 27, type: "Inbound Only", status: "On Call", lastActive: "Just now" },
];

export default function SupervisorTeamManagement() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    // Agent columns mapping
    const columns: TableColumn<Agent>[] = [
        {
            key: "name",
            label: "Agent",
            sortable: true,
            width: "w-[250px]",
            render: (agent) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-10 w-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-[#111]">{agent.initials}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-[#0C335C]">{agent.name}</span>
                        <span className="text-xs text-gray-500">{agent.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: "phone",
            label: "Phone",
            sortable: true,
            width: "w-[150px]",
            render: (agent) => (
                <div className="flex items-center gap-2">
                    <span className="text-lg">{agent.countryCode === 'US' ? '🇺🇸' : agent.countryCode === 'GB' ? '🇬🇧' : agent.countryCode === 'IN' ? '🇮🇳' : '🇦🇺'}</span>
                    <span className="text-gray-700">{agent.phone}</span>
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "w-[120px]",
            render: (agent) => {
                let bg = "bg-[#1DB013]"; // Live
                if (agent.status === "Offline") bg = "bg-[#6B7280]"; // Gray
                if (agent.status === "On Call") bg = "bg-[#FE641F]"; // Orange
                if (agent.status === "Paused") bg = "bg-[#F59E0B]"; // Amber
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-medium ${bg}`}>
                        {agent.status !== "Offline" && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                        {agent.status === "Offline" && <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0 border border-white" />}
                        {agent.status}
                    </div>
                );
            }
        },
        {
            key: "type",
            label: "Role",
            sortable: true,
            width: "w-[150px]",
            render: (agent) => {
                return (
                    <div className="flex items-center gap-1.5 text-gray-700">
                        {agent.type.includes('Inbound') && <span className="text-[#1DB013] font-bold">↓</span>}
                        {agent.type.includes('Outbound') && <span className="text-[#FE641F] font-bold">↑</span>}
                        {agent.type === 'Both' && <span className="text-blue-500 font-bold">⇅</span>}
                        <span>{agent.type === 'Both' ? 'Both' : agent.type.replace(' Only', '')}</span>
                    </div>
                );
            }
        },
        {
            key: "callsToday",
            label: "Today's Calls",
            sortable: true,
            width: "w-[120px]",
            render: (agent) => <span className="text-gray-700">{agent.callsToday} calls</span>
        },
        {
            key: "callTime",
            label: "Call Time",
            sortable: true,
            width: "w-[120px]",
            render: (agent) => <span className="text-gray-700">{agent.callTime}</span>
        },
        {
            key: "lastActive",
            label: "Last Active",
            sortable: true,
            width: "w-[150px]",
            render: (agent) => <span className="text-gray-500">{agent.lastActive}</span>
        },
        {
            key: "actions",
            label: "Actions",
            width: "w-[120px]",
            render: (agent) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={() => router.push(`/test/agents/${agent.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 group relative"
                    >
                        <Eye size={18} className="group-hover:text-[#0C335C]" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">View Details</span>
                    </button>
                    <button className="text-gray-400 hover:text-[#FE641F] transition-colors"><MoreHorizontal size={16} /></button>
                </div>
            )
        }
    ];

    // Filter Logic
    const filteredData = React.useMemo(() => {
        let result = MOCK_AGENTS;

        if (searchValue) {
            const lowerSearch = searchValue.toLowerCase();
            result = result.filter(agent =>
                agent.name.toLowerCase().includes(lowerSearch) ||
                agent.email.toLowerCase().includes(lowerSearch) ||
                agent.phone.toLowerCase().includes(lowerSearch)
            );
        }

        if (statusFilter && statusFilter !== 'all') {
            result = result.filter(agent => agent.status.toLowerCase() === statusFilter.toLowerCase());
        }

        if (roleFilter && roleFilter !== 'all') {
            result = result.filter(agent => agent.type.toLowerCase().includes(roleFilter.toLowerCase()));
        }

        return result;
    }, [searchValue, statusFilter, roleFilter]);

    const hasActiveFilters = searchValue !== "" || (statusFilter !== "" && statusFilter !== "all") || (roleFilter !== "" && roleFilter !== "all");

    const handleClearFilters = () => {
        setSearchValue("");
        setStatusFilter("all");
        setRoleFilter("all");
    };

    return (
        <DashboardLayout>
            <div className="h-full w-full">
                <TableCard<Agent>
                    title="Team Management"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Team Management" }
                    ]}
                    primaryAction={
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#FE641F] text-white px-4 py-2 rounded-[12px] flex items-center gap-2 hover:bg-[#FE641F]/90 transition-colors"
                        >
                            <UserPlus size={18} />
                            <span className="font-medium text-sm">Add Agent</span>
                        </button>
                    }
                    secondaryAction={
                        <button
                            onClick={() => setIsBulkModalOpen(true)}
                            className="bg-white border border-[#CBCBCB] text-[#0C335C] px-4 py-2 rounded-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <UploadCloud size={18} />
                            <span className="font-medium text-sm">Bulk Upload</span>
                        </button>
                    }

                    // Search & Filters
                    searchPlaceholder="Search agents..."
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
                    filters={[
                        {
                            key: "status",
                            label: "All Status",
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { label: "Live", value: "live" },
                                { label: "Offline", value: "offline" },
                                { label: "On Call", value: "on call" },
                                { label: "Paused", value: "paused" }
                            ]
                        },
                        {
                            key: "role",
                            label: "All Roles",
                            value: roleFilter,
                            onChange: setRoleFilter,
                            options: [
                                { label: "Inbound Only", value: "inbound" },
                                { label: "Outbound Only", value: "outbound" },
                                { label: "Both", value: "both" }
                            ]
                        }
                    ]}

                    // Stats Header
                    stats={[
                        { label: "Total Agents", value: "12" },
                        { label: "Live Now", value: "8", valueColorClass: "text-[#1DB013]" },
                        { label: "On Calls", value: "3", valueColorClass: "text-[#FE641F]" },
                        { label: "Offline", value: "1", valueColorClass: "text-[#6B7280]" }
                    ]}

                    // Table Data
                    columns={columns}
                    data={filteredData}
                    keyExtractor={(agent) => agent.id}

                    // Interactivity
                    selectable
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}

                    clickableColumnIndex={0} // The "Agent" column turns orange on hover and is clickable
                    onRowClick={(agent) => console.log("Clicked row name:", agent.name)}

                    // Sorting internally via TableCard
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={setSortKey}

                    // Pagination
                    pagination={{
                        currentPage: currentPage,
                        itemsPerPage: 10,
                        totalItems: filteredData.length,
                        totalPages: Math.ceil(filteredData.length / 10) || 1,
                        onPageChange: setCurrentPage
                    }}
                />
            </div>

            <AddAgentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => console.log("Agent added successfully!")}
            />

            <BulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onSuccess={() => console.log("Agents bulk uploaded successfully!")}
            />
        </DashboardLayout>
    );
}
