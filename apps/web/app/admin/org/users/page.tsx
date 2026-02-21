"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Eye, Download, MoreHorizontal, Plus } from "lucide-react";
import { MOCK_USERS } from "@/app/test/components/mockData";

export default function UserManagementScreen() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
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

    const roleColor = (r: string): "blue" | "gray" | "purple" => r === "Supervisor" ? "blue" : r === "Org Admin" ? "purple" : "gray";
    const statusColor = (s: string): "green" | "gray" | "amber" => s === "Active" ? "green" : s === "Pending" ? "amber" : "gray";

    const columns: TableColumn<typeof MOCK_USERS[0]>[] = [
        {
            key: "name", label: "User", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-medium text-[#0C335C]">
                        {u.name.split(" ").map(p => p[0]).join("")}
                    </div>
                    <div><p className="font-medium text-[#0C335C] text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div>
            )
        },
        { key: "role", label: "Role", sortable: true, width: "w-[110px]", render: (u) => <Badge text={u.role} color={roleColor(u.role)} /> },
        { key: "team", label: "Team", width: "w-[100px]", render: (u) => <span className="text-sm text-gray-600">{u.team}</span> },
        { key: "status", label: "Status", sortable: true, width: "w-[100px]", render: (u) => <Badge text={u.status} color={statusColor(u.status)} /> },
        { key: "lastActive", label: "Last Active", sortable: true, width: "w-[120px]", render: (u) => <span className="text-sm text-gray-400">{u.lastActive}</span> },
        { key: "calls7d", label: "Calls (7d)", sortable: true, width: "w-[90px]", render: (u) => <span className="text-sm font-medium text-[#0C335C]">{u.calls7d}</span> },
        { key: "created", label: "Created", width: "w-[110px]", render: (u) => <span className="text-xs text-gray-500">{u.created}</span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><MoreHorizontal size={14} /></button>
                </div>
            )
        },
    ];
    const filtered = MOCK_USERS.filter(u => {
        const s = search.toLowerCase();
        return (!search || u.name.toLowerCase().includes(s) || u.email.includes(s)) &&
            (roleFilter === "all" || u.role.toLowerCase().includes(roleFilter)) &&
            (statusFilter === "all" || u.status.toLowerCase() === statusFilter);
    });
    return (
        <TableCard
            title="Users"
            breadcrumbs={[{ label: "Org Admin" }, { label: "Users" }]}
            primaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"><Plus size={16} /> Add User</button>}
            secondaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Bulk Import</button>}
            searchPlaceholder="Search by name or email..."
            searchValue={search}
            onSearchChange={setSearch}
            onClearFilters={search || roleFilter !== "all" || statusFilter !== "all" ? () => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); } : undefined}
            filters={[
                { key: "role", label: "Role", value: roleFilter, onChange: setRoleFilter, options: [{ label: "Supervisor", value: "supervisor" }, { label: "Agent", value: "agent" }] },
                { key: "status", label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }, { label: "Pending", value: "pending" }] },
            ]}
            stats={[
                { label: "Total Users", value: MOCK_USERS.length.toString(), valueColorClass: "text-[#0C335C]" },
                { label: "Supervisors", value: MOCK_USERS.filter(u => u.role === "Supervisor").length.toString(), valueColorClass: "text-blue-600" },
                { label: "Agents", value: MOCK_USERS.filter(u => u.role === "Agent").length.toString(), valueColorClass: "text-gray-600" },
                { label: "Active", value: MOCK_USERS.filter(u => u.status === "Active").length.toString(), valueColorClass: "text-green-600" },
            ]}
            columns={columns}
            data={filtered}
            keyExtractor={(u) => u.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
        />
    );
}
