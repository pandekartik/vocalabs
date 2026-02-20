"use client";

import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { UserPlus, Phone, ArrowDownToLine, ArrowUpToLine, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

// API Schema Interface
interface Agent {
    id: string;
    user_id: string;
    organization_id: string;
    agent_name: string;
    agent_id: string;
    calling_type: "inbound" | "outbound" | string;
    inbound_enabled: boolean;
    outbound_enabled: boolean;
    is_active: boolean;
    phone_number: string | null;
    twilio_sid: string | null;
    created_at: string;
}

export default function SupervisorTeamManagement() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [callingTypeFilter, setCallingTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<string>("agent_name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const response = await fetch("https://api.vocalabstech.com/agents", {
                    headers: {
                        accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAgents(data);
                } else {
                    console.error("Failed to fetch agents:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const formatDate = (isoStr: string) => {
        return new Date(isoStr).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const columns: TableColumn<Agent>[] = [
        {
            key: "agent_name",
            label: "Agent",
            sortable: true,
            width: "w-[220px]",
            render: (agent) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-10 w-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-[#111]">{getInitials(agent.agent_name)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-[#0C335C]">{agent.agent_name}</span>
                        <span className="text-xs text-gray-500 font-mono">{agent.agent_id}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "phone_number",
            label: "Phone",
            sortable: false,
            width: "w-[160px]",
            render: (agent) => (
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-700 font-mono text-xs">
                        {agent.phone_number ?? <span className="text-gray-400 italic">No number</span>}
                    </span>
                </div>
            ),
        },
        {
            key: "calling_type",
            label: "Calling Type",
            sortable: true,
            width: "w-[140px]",
            render: (agent) => {
                const both = agent.inbound_enabled && agent.outbound_enabled;
                return (
                    <div className="flex items-center gap-1.5 text-sm">
                        {agent.inbound_enabled && (
                            <ArrowDownToLine size={14} className="text-blue-500 shrink-0" />
                        )}
                        {agent.outbound_enabled && (
                            <ArrowUpToLine size={14} className="text-orange-500 shrink-0" />
                        )}
                        <span className="capitalize text-gray-700">
                            {both
                                ? "Both"
                                : agent.inbound_enabled
                                    ? "Inbound"
                                    : agent.outbound_enabled
                                        ? "Outbound"
                                        : "None"}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "is_active",
            label: "Status",
            sortable: true,
            width: "w-[110px]",
            render: (agent) =>
                agent.is_active ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-medium">
                        <CheckCircle2 size={12} /> Active
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-medium">
                        <XCircle size={12} /> Inactive
                    </div>
                ),
        },
        {
            key: "twilio_sid",
            label: "Twilio SID",
            sortable: false,
            width: "flex-1 min-w-[140px]",
            render: (agent) => (
                <span className="text-xs font-mono text-gray-500 truncate">
                    {agent.twilio_sid ?? <span className="text-gray-300 italic">—</span>}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Joined",
            sortable: true,
            width: "w-[120px]",
            render: (agent) => (
                <span className="text-sm text-gray-500">{formatDate(agent.created_at)}</span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            width: "w-[80px]",
            fixedRight: true,
            render: (agent) => (
                <div className="flex items-center gap-1 justify-center">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 group relative"
                        title="View Agent"
                    >
                        <ExternalLink size={16} className="group-hover:text-[#0C335C]" />
                    </button>
                </div>
            ),
        },
    ];

    // Filter Logic
    const filteredData = React.useMemo(() => {
        let result = agents;

        if (searchValue) {
            const lowerSearch = searchValue.toLowerCase();
            result = result.filter(
                (agent) =>
                    agent.agent_name.toLowerCase().includes(lowerSearch) ||
                    agent.agent_id.toLowerCase().includes(lowerSearch) ||
                    (agent.phone_number ?? "").toLowerCase().includes(lowerSearch)
            );
        }

        if (statusFilter !== "all") {
            result = result.filter((agent) =>
                statusFilter === "active" ? agent.is_active : !agent.is_active
            );
        }

        if (callingTypeFilter !== "all") {
            result = result.filter((agent) => {
                if (callingTypeFilter === "inbound") return agent.inbound_enabled && !agent.outbound_enabled;
                if (callingTypeFilter === "outbound") return agent.outbound_enabled && !agent.inbound_enabled;
                if (callingTypeFilter === "both") return agent.inbound_enabled && agent.outbound_enabled;
                return true;
            });
        }

        return result;
    }, [agents, searchValue, statusFilter, callingTypeFilter]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const hasActiveFilters =
        searchValue !== "" ||
        (statusFilter !== "" && statusFilter !== "all") ||
        (callingTypeFilter !== "" && callingTypeFilter !== "all");

    const handleClearFilters = () => {
        setSearchValue("");
        setStatusFilter("all");
        setCallingTypeFilter("all");
        setCurrentPage(1);
    };

    const activeCount = agents.filter((a) => a.is_active).length;
    const inboundCount = agents.filter((a) => a.inbound_enabled).length;
    const outboundCount = agents.filter((a) => a.outbound_enabled).length;

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-84px)] w-full flex flex-col p-6 overflow-hidden" style={{ background: "var(--background)" }}>
                <div className="flex-1 overflow-hidden relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                            <span className="text-4xl animate-spin">⏳</span>
                            <p className="mt-4 text-navy font-semibold">Loading agents...</p>
                        </div>
                    )}
                    <TableCard<Agent>
                        title="Team Management"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Team Management" },
                        ]}
                        primaryAction={
                            <button className="bg-[#FE641F] text-white px-4 py-2.5 rounded-[12px] flex items-center gap-2 hover:bg-[#FE641F]/90 transition-colors shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] font-bold text-sm">
                                <UserPlus size={18} />
                                <span>Add Agent</span>
                            </button>
                        }
                        searchPlaceholder="Search by name, ID or phone..."
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
                        filters={[
                            {
                                key: "status",
                                label: "Status",
                                value: statusFilter,
                                onChange: setStatusFilter,
                                options: [
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                ],
                            },
                            {
                                key: "calling_type",
                                label: "Calling Type",
                                value: callingTypeFilter,
                                onChange: setCallingTypeFilter,
                                options: [
                                    { label: "Inbound Only", value: "inbound" },
                                    { label: "Outbound Only", value: "outbound" },
                                    { label: "Both", value: "both" },
                                ],
                            },
                        ]}
                        stats={[
                            { label: "Total Agents", value: agents.length.toString(), valueColorClass: "text-[#0C335C]" },
                            { label: "Active", value: activeCount.toString(), valueColorClass: "text-green-600" },
                            { label: "Inbound", value: inboundCount.toString(), valueColorClass: "text-blue-600" },
                            { label: "Outbound", value: outboundCount.toString(), valueColorClass: "text-[#FE641F]" },
                        ]}
                        columns={columns}
                        data={paginatedData}
                        keyExtractor={(agent) => agent.id}
                        selectable
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        onSortChange={setSortKey}
                        pagination={{
                            currentPage,
                            itemsPerPage: ITEMS_PER_PAGE,
                            totalItems: filteredData.length,
                            totalPages,
                            onPageChange: setCurrentPage,
                        }}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
