"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Eye, Download, MoreHorizontal, Plus } from "lucide-react";
import { MOCK_ORGS } from "@/app/test/components/mockData";

export default function OrganizationsScreen() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

    const planColor = (plan: string): "gray" | "blue" | "purple" | "orange" => {
        if (plan === "Starter") return "gray";
        if (plan === "Professional") return "blue";
        if (plan === "Enterprise") return "purple";
        return "orange";
    };
    const statusColor = (s: string): "green" | "blue" | "red" | "gray" => {
        if (s === "Active") return "green";
        if (s === "Trial") return "blue";
        if (s === "Suspended") return "red";
        return "gray";
    };

    const columns: TableColumn<(typeof MOCK_ORGS)[0]>[] = [
        { key: "id", label: "Org ID", width: "w-[110px]", render: (o) => <span className="font-mono text-xs text-gray-500">{o.id}</span> },
        {
            key: "name", label: "Organization", sortable: true, width: "w-[200px]",
            render: (o) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FE641F]/20 to-[#0C335C]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#0C335C]">{o.name[0]}</span>
                    </div>
                    <div>
                        <p className="font-medium text-[#0C335C] text-sm">{o.name}</p>
                        <p className="text-xs text-gray-400">{o.domain}</p>
                    </div>
                </div>
            )
        },
        { key: "plan", label: "Plan", sortable: true, width: "w-[120px]", render: (o) => <Badge text={o.plan} color={planColor(o.plan)} /> },
        { key: "status", label: "Status", sortable: true, width: "w-[100px]", render: (o) => <Badge text={o.status} color={statusColor(o.status)} /> },
        { key: "users", label: "Users", width: "w-[90px]", render: (o) => <span className="text-sm text-gray-600">{o.users}</span> },
        { key: "calls30d", label: "Calls (30d)", sortable: true, width: "w-[100px]", render: (o) => <span className="text-sm text-gray-700 font-medium">{o.calls30d.toLocaleString()}</span> },
        {
            key: "usage", label: "Usage", width: "w-[120px]",
            render: (o) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${o.usage > 85 ? "bg-red-500" : o.usage > 60 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${o.usage}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{o.usage}%</span>
                </div>
            )
        },
        { key: "created", label: "Created", width: "w-[110px]", render: (o) => <span className="text-xs text-gray-500">{o.created}</span> },
        { key: "admin", label: "Admin", width: "w-[170px]", render: (o) => <span className="text-xs text-gray-600 truncate">{o.admin}</span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true,
            render: (o) => (
                <div className="flex items-center gap-1 justify-center">
                    <button onClick={() => console.log('View', o.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0C335C]"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0C335C]"><MoreHorizontal size={14} /></button>
                </div>
            )
        },
    ];

    const filtered = MOCK_ORGS.filter(o => {
        const s = search.toLowerCase();
        const matchSearch = !search || o.name.toLowerCase().includes(s) || o.domain.includes(s) || o.id.includes(s);
        const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter;
        const matchPlan = planFilter === "all" || o.plan.toLowerCase() === planFilter;
        return matchSearch && matchStatus && matchPlan;
    });

    return (
        <TableCard
            title="All Organizations"
            breadcrumbs={[{ label: "Platform Admin" }, { label: "Organizations" }]}
            primaryAction={
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]">
                    <Plus size={16} /> Create Organization
                </button>
            }
            secondaryAction={
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50">
                    <Download size={16} /> Export List
                </button>
            }
            searchPlaceholder="Search by name, domain, or ID..."
            searchValue={search}
            onSearchChange={setSearch}
            onClearFilters={search || statusFilter !== "all" || planFilter !== "all" ? () => { setSearch(""); setStatusFilter("all"); setPlanFilter("all"); } : undefined}
            filters={[
                { key: "status", label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Trial", value: "trial" }, { label: "Suspended", value: "suspended" }, { label: "Expired", value: "expired" }] },
                { key: "plan", label: "Plan", value: planFilter, onChange: setPlanFilter, options: [{ label: "Starter", value: "starter" }, { label: "Professional", value: "professional" }, { label: "Enterprise", value: "enterprise" }, { label: "Custom", value: "custom" }] },
            ]}
            stats={[
                { label: "Active Orgs", value: "42", valueColorClass: "text-green-600" },
                { label: "Trial Orgs", value: "3", valueColorClass: "text-blue-600" },
                { label: "Suspended", value: "2", valueColorClass: "text-red-600" },
                { label: "MRR", value: "$47,500", valueColorClass: "text-[#FE641F]" },
            ]}
            columns={columns}
            data={filtered.slice((currentPage - 1) * 10, currentPage * 10)}
            keyExtractor={(o) => o.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
        />
    );
}
