"use client";
import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download } from "lucide-react";

export default function AuditLogScreen() {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const logs = [
        { id: "a1", ts: "2024-01-15 14:32", user: "sarah@acme.com", action: "CREATE", resource: "Agent", details: "Created: mike@acme.com", ip: "192.168.1.5" },
        { id: "a2", ts: "2024-01-15 14:15", user: "john@acme.com", action: "UPDATE", resource: "Call", details: "Added tag: hot-lead", ip: "192.168.1.12" },
        { id: "a3", ts: "2024-01-15 13:48", user: "admin@acme.com", action: "LOGIN", resource: "System", details: "Successful", ip: "192.168.1.1" },
        { id: "a4", ts: "2024-01-15 13:20", user: "priya@acme.com", action: "EXPORT", resource: "Calls", details: "Exported 450 records", ip: "192.168.1.8" },
        { id: "a5", ts: "2024-01-15 12:44", user: "admin@acme.com", action: "UPDATE", resource: "Setting", details: "Changed recording retention: 60d → 90d", ip: "192.168.1.1" },
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

    const actionColor = (a: string): "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" =>
        a === "CREATE" ? "green" : a === "UPDATE" ? "blue" : a === "DELETE" ? "red" : a === "LOGIN" ? "gray" : "amber";

    const cols: TableColumn<typeof logs[0]>[] = [
        { key: "ts", label: "Timestamp", sortable: true, width: "w-[160px]", render: (l) => <span className="text-xs font-mono text-gray-600">{l.ts}</span> },
        {
            key: "user", label: "User", width: "w-[180px]", render: (l) => (
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[10px] font-medium">{l.user?.[0]?.toUpperCase() || '?'}</div>
                    <span className="text-xs text-gray-700">{l.user}</span>
                </div>
            )
        },
        { key: "action", label: "Action", width: "w-[90px]", render: (l) => <Badge text={l.action} color={actionColor(l.action)} /> },
        { key: "resource", label: "Resource", width: "w-[100px]", render: (l) => <span className="text-sm text-gray-700">{l.resource}</span> },
        { key: "details", label: "Details", width: "flex-1 min-w-[180px]", render: (l) => <span className="text-xs text-gray-500">{l.details}</span> },
        { key: "ip", label: "IP Address", width: "w-[130px]", render: (l) => <span className="text-xs font-mono text-gray-400">{l.ip}</span> },
    ];

    return (
        <TableCard
            title="Audit Log"
            breadcrumbs={[{ label: "Org Admin", href: "/admin/org" }, { label: "Audit Log" }]}
            searchPlaceholder="Search by user, action, or resource..."
            secondaryAction={<button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Export</button>}
            filters={[
                { key: "action", label: "Action", value: "all", onChange: () => { }, options: [{ label: "Create", value: "create" }, { label: "Update", value: "update" }, { label: "Delete", value: "delete" }, { label: "Login", value: "login" }] },
                { key: "resource", label: "Resource", value: "all", onChange: () => { }, options: [{ label: "User", value: "user" }, { label: "Call", value: "call" }, { label: "Setting", value: "setting" }] },
            ]}
            columns={cols}
            data={logs}
            keyExtractor={(l) => l.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{ currentPage: 1, itemsPerPage: 10, totalItems: logs.length, totalPages: 1, onPageChange: () => { } }}
        />
    );
}
