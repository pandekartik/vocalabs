"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Eye, MoreHorizontal } from "lucide-react";

export default function GlobalUserSearch() {
    const [search, setSearch] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const users = [
        { id: "1", name: "John Doe", email: "john@acme.com", org: "Acme Corporation", role: "Agent", status: "Active", lastActive: "2 min ago" },
        { id: "2", name: "Sarah Johnson", email: "sarah@acme.com", org: "Acme Corporation", role: "Supervisor", status: "Active", lastActive: "5 min ago" },
        { id: "3", name: "Maria López", email: "maria@techstart.io", org: "TechStart Inc", role: "Agent", status: "Active", lastActive: "1 hour ago" },
        { id: "4", name: "Chen Wei", email: "chen@globalservices.com", org: "Global Services", role: "Supervisor", status: "Inactive", lastActive: "2 days ago" },
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

    const roleColor = (r: string) => r === "Supervisor" ? "blue" : "gray";
    const cols: TableColumn<typeof users[0]>[] = [
        {
            key: "name", label: "User", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-medium">{u.name.split(" ").map(p => p[0]).join("")}</div>
                    <div><p className="font-medium text-[#0C335C] text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div>
            )
        },
        { key: "org", label: "Organization", sortable: true, width: "w-[180px]", render: (u) => <span className="text-sm text-[#FE641F] font-medium hover:underline cursor-pointer">{u.org}</span> },
        { key: "role", label: "Role", width: "w-[100px]", render: (u) => <Badge text={u.role} color={roleColor(u.role) as "blue" | "gray"} /> },
        { key: "status", label: "Status", width: "w-[90px]", render: (u) => <Badge text={u.status} color={u.status === "Active" ? "green" : "gray"} /> },
        { key: "lastActive", label: "Last Active", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-400">{u.lastActive}</span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0C335C]"><MoreHorizontal size={14} /></button>
                </div>
            )
        },
    ];
    const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search) || u.org.toLowerCase().includes(search.toLowerCase()));

    return (
        <TableCard
            title="Global User Search"
            breadcrumbs={[{ label: "Platform Admin" }, { label: "User Search" }]}
            searchPlaceholder="Search across all organizations..."
            searchValue={search}
            onSearchChange={setSearch}
            stats={[{ label: "Results", value: filtered.length.toString(), valueColorClass: "text-[#0C335C]" }, { label: "Organizations", value: "4", valueColorClass: "text-[#FE641F]" }]}
            columns={cols}
            data={filtered}
            keyExtractor={(u) => u.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: filtered.length, totalPages: 1, onPageChange: () => { } }}
        />
    );
}
