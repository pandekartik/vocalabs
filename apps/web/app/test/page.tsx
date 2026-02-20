"use client";

import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { UploadCloud, UserPlus } from "lucide-react";

// Mock Data Interfaces
interface Agent {
    id: string;
    agentId: string;
    initials: string;
    name: string;
    phone: string;
    callTime: string;
    callsToday: number;
    type: string;
    status: "Live" | "Offline" | "On Call";
}

// Mock Data
const MOCK_AGENTS: Agent[] = [
    { id: "1", agentId: "AGT-00123", initials: "A.B.", name: "Aarav Sharma", phone: "+1 555-0123", callTime: "03 HR 23 MIN", callsToday: 23, type: "Inbound", status: "Live" },
    { id: "2", agentId: "AGT-00124", initials: "C.D.", name: "Riya Mehta", phone: "+1 555-0456", callTime: "05 HR 19 MIN", callsToday: 34, type: "Outbound", status: "Offline" },
    { id: "3", agentId: "AGT-00125", initials: "E.F.", name: "Nisha Verma", phone: "+1 555-0789", callTime: "04 HR 18 MIN", callsToday: 45, type: "Both (Inbound/Outbound)", status: "On Call" },
    { id: "4", agentId: "AGT-00126", initials: "G.H.", name: "Vikram Joshi", phone: "+1 555-1011", callTime: "00 HR 12 MIN", callsToday: 56, type: "Outbound", status: "Live" },
    { id: "5", agentId: "AGT-00128", initials: "K.L.", name: "Rohan Singh", phone: "+1 555-1415", callTime: "08 HR 32 MIN", callsToday: 38, type: "Outbound", status: "Live" },
    { id: "6", agentId: "AGT-00127", initials: "I.J.", name: "Sanya Kapoor", phone: "+1 555-1213", callTime: "07 HR 31 MIN", callsToday: 29, type: "Inbound", status: "On Call" },
    { id: "7", agentId: "AGT-00129", initials: "M.N.", name: "Priya Gupta", phone: "+1 555-1617", callTime: "04 HR 36 MIN", callsToday: 41, type: "Both (Inbound/Outbound)", status: "Live" },
    { id: "8", agentId: "AGT-00130", initials: "O.P.", name: "Karan Desai", phone: "+1 555-1819", callTime: "03 HR 42 MIN", callsToday: 52, type: "Inbound", status: "On Call" },
    { id: "9", agentId: "AGT-00131", initials: "Q.R.", name: "Anaya Reddy", phone: "+1 555-2021", callTime: "05 HR 34 MIN", callsToday: 19, type: "Outbound", status: "Offline" },
    { id: "10", agentId: "AGT-00132", initials: "S.T.", name: "Dev Patel", phone: "+1 555-2223", callTime: "01 HR 13 MIN", callsToday: 27, type: "Inbound", status: "On Call" },
];

export default function TestPage() {
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<string>("agentId");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);

    // Sorting logic mock
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    // Agent columns mapping
    const columns: TableColumn<Agent>[] = [
        { key: "agentId", label: "Agent ID", sortable: true, width: "w-[100px]" },
        {
            key: "name",
            label: "Agent Name",
            sortable: true,
            render: (agent) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-9 w-9 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <span className="text-xs text-[#111]">{agent.initials}</span>
                    </div>
                    <span>{agent.name}</span>
                </div>
            )
        },
        { key: "phone", label: "Phone Number", sortable: true },
        { key: "callTime", label: "Call Time(Today)", sortable: true },
        { key: "callsToday", label: "No. of Calls (Today)", sortable: true },
        { key: "type", label: "Agent Type", sortable: true },
        {
            key: "status",
            label: "Status",
            width: "w-[100px]",
            render: (agent) => {
                let bg = "bg-[#1DB013]"; // Live
                if (agent.status === "Offline") bg = "bg-[#B01313]";
                if (agent.status === "On Call") bg = "bg-[#FE641F]";
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] uppercase font-medium ${bg}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        {agent.status}
                    </div>
                );
            }
        }
    ];

    // Filter Logic
    const filteredData = React.useMemo(() => {
        let result = MOCK_AGENTS;

        if (searchValue) {
            const lowerSearch = searchValue.toLowerCase();
            result = result.filter(agent =>
                agent.name.toLowerCase().includes(lowerSearch) ||
                agent.phone.toLowerCase().includes(lowerSearch) ||
                agent.agentId.toLowerCase().includes(lowerSearch)
            );
        }

        if (statusFilter && statusFilter !== 'all') {
            result = result.filter(agent => agent.status.toLowerCase() === statusFilter.toLowerCase());
        }

        if (roleFilter && roleFilter !== 'all') {
            result = result.filter(agent => agent.type.toLowerCase().includes(roleFilter.toLowerCase()));
        }

        // We aren't filtering purely by date here because MOCK_AGENTS doesn't have a date field, 
        // but this wires up the dropdown visually and functionally in principle.

        return result;
    }, [searchValue, statusFilter, roleFilter]);

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col">
                <TableCard<Agent>
                    className="flex-1" // Take up available height so scrolling happens inside
                    breadcrumbs={[
                        { label: "Dashboard" },
                        { label: "Team" }
                    ]}
                    title="Team Management"

                    // Top Right Actions
                    secondaryAction={
                        <button className="flex items-center gap-2 px-4 py-2 border border-[#FE641F] rounded-xl text-[#111] font-bold text-sm hover:bg-[#FE641F]/5 transition">
                            <UploadCloud size={18} className="text-gray-700" />
                            Bulk Import
                        </button>
                    }
                    primaryAction={
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#FE641F] rounded-xl text-white font-bold text-sm hover:bg-[#E55A1A] transition">
                            <UserPlus size={18} />
                            Add Agent
                        </button>
                    }

                    // Search & Filter
                    searchPlaceholder="Search by name, email, or phone..."
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    filters={[
                        {
                            key: "date",
                            label: "Select Date",
                            value: "", // Default empty
                            onChange: () => { }, // Mock onChange
                            isDate: true,
                            options: [
                                { label: "Today", value: "today" },
                                { label: "Yesterday", value: "yesterday" },
                                { label: "Last 7 Days", value: "7days" }
                            ]
                        },
                        {
                            key: "status",
                            label: "All Status",
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { label: "Live", value: "live" },
                                { label: "Offline", value: "offline" },
                                { label: "On Call", value: "on call" }
                            ]
                        },
                        {
                            key: "role",
                            label: "All Roles",
                            value: roleFilter,
                            onChange: setRoleFilter,
                            options: [
                                { label: "Inbound", value: "inbound" },
                                { label: "Outbound", value: "outbound" },
                            ]
                        }
                    ]}

                    // Stats Header
                    stats={[
                        { label: "Total Agents", value: "400" },
                        { label: "Live Now", value: "200", valueColorClass: "text-[#1DB013]" },
                        { label: "On Calls", value: "120", valueColorClass: "text-[#FE641F]" },
                        { label: "Offline", value: "80", valueColorClass: "text-[#B01313]" }
                    ]}

                    // Table Data
                    columns={columns}
                    data={filteredData}
                    keyExtractor={(agent) => agent.id}

                    // Interactivity
                    selectable
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}

                    clickableColumnIndex={1} // The "Agent Name" column turns orange on hover and is clickable
                    onRowClick={(agent) => console.log("Clicked row name:", agent.name)}
                    onInfoClick={(agent) => alert(`Info for ${agent.name}`)}

                    // Sorting
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={handleSort}

                    // Pagination
                    pagination={{
                        currentPage: currentPage,
                        itemsPerPage: 50,
                        totalItems: filteredData.length,
                        totalPages: Math.ceil(filteredData.length / 50) || 1,
                        onPageChange: setCurrentPage
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
