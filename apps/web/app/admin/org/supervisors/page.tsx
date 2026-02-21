"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Plus } from "lucide-react";
import { MOCK_USERS } from "@/app/test/components/mockData";

export default function SupervisorsScreen() {
    const supervisors = MOCK_USERS.filter(u => u.role === "Supervisor");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const cols: TableColumn<typeof supervisors[0]>[] = [
        {
            key: "name", label: "Supervisor", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">{u.name.split(" ").map(p => p[0]).join("")}</div>
                    <div><p className="font-medium text-[#0C335C] text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                </div>
            )
        },
        { key: "team", label: "Team", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-600">{u.team}</span> },
        { key: "calls7d", label: "Active Calls", width: "w-[100px]", render: () => <span className="text-sm font-medium text-[#FE641F]">2 on calls</span> },
        { key: "lastActive", label: "Last Active", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-400">{u.lastActive}</span> },
        {
            key: "actions", label: "Actions", width: "w-[120px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">View</button>
                    <button className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Reassign</button>
                </div>
            )
        },
    ];
    return (
        <TableCard
            title="Supervisors"
            breadcrumbs={[{ label: "Org Admin" }, { label: "Supervisors" }]}
            primaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"><Plus size={16} /> Add Supervisor</button>}
            stats={[
                { label: "Total Supervisors", value: supervisors.length.toString(), valueColorClass: "text-blue-600" },
                { label: "Active Now", value: supervisors.filter(s => s.status === "Active").length.toString(), valueColorClass: "text-green-600" },
            ]}
            columns={cols}
            data={supervisors}
            keyExtractor={(u) => u.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: supervisors.length, totalPages: 1, onPageChange: () => { } }}
        />
    );
}
