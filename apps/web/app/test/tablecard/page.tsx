"use client";

import React, { useState } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, Plus } from "lucide-react";

interface TestUser {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Viewer";
    status: "Active" | "Inactive" | "Pending";
    lastLogin: string;
}

const MOCK_DATA: TestUser[] = [
    { id: "1", name: "Alice Smith", email: "alice@example.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
    { id: "2", name: "Bob Jones", email: "bob@example.com", role: "Editor", status: "Inactive", lastLogin: "3 days ago" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Active", lastLogin: "5 mins ago" },
    { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Pending", lastLogin: "Never" },
    { id: "5", name: "Eve Davis", email: "eve@example.com", role: "Editor", status: "Active", lastLogin: "1 day ago" },
    { id: "6", name: "Frank Miller", email: "frank@example.com", role: "Viewer", status: "Inactive", lastLogin: "1 week ago" },
    { id: "7", name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Active", lastLogin: "4 hours ago" },
    { id: "8", name: "Henry Ford", email: "henry@example.com", role: "Viewer", status: "Active", lastLogin: "10 mins ago" },
    { id: "9", name: "Ivy Chen", email: "ivy@example.com", role: "Editor", status: "Pending", lastLogin: "12 hours ago" },
    { id: "10", name: "Jack Dawson", email: "jack@example.com", role: "Viewer", status: "Inactive", lastLogin: "1 month ago" },
    { id: "11", name: "Karen Page", email: "karen@example.com", role: "Admin", status: "Active", lastLogin: "Just now" },
    { id: "12", name: "Leo Das", email: "leo@example.com", role: "Editor", status: "Active", lastLogin: "30 mins ago" },
    { id: "13", name: "Mia Wong", email: "mia@example.com", role: "Viewer", status: "Pending", lastLogin: "2 days ago" },
    { id: "14", name: "Noah Carter", email: "noah@example.com", role: "Editor", status: "Active", lastLogin: "1 hour ago" },
    { id: "15", name: "Olivia Kim", email: "olivia@example.com", role: "Admin", status: "Inactive", lastLogin: "2 weeks ago" },
    { id: "16", name: "Peter Parker", email: "peter@example.com", role: "Viewer", status: "Active", lastLogin: "Yesterday" },
    { id: "17", name: "Quinn Harley", email: "quinn@example.com", role: "Editor", status: "Pending", lastLogin: "4 days ago" },
];

export default function TableCardPreview() {
    const [searchValue, setSearchValue] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const columns: TableColumn<TestUser>[] = [
        {
            key: "name",
            label: "User Name",
            sortable: true,
            width: "w-[200px]",
            render: (user) => <span className="font-medium text-[#0c335c]">{user.name}</span>
        },
        {
            key: "email",
            label: "Email Address",
            sortable: true,
            width: "w-[250px]",
            render: (user) => <span className="text-gray-500">{user.email}</span>
        },
        {
            key: "role",
            label: "Role",
            sortable: true,
            width: "w-[120px]",
            render: (user) => {
                const colors = {
                    Admin: "text-purple-700 bg-purple-100",
                    Editor: "text-blue-700 bg-blue-100",
                    Viewer: "text-gray-700 bg-gray-100"
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[user.role]}`}>
                        {user.role}
                    </span>
                );
            }
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "w-[120px]",
            render: (user) => {
                const colors = {
                    Active: "text-green-700 bg-green-100 border border-green-200",
                    Inactive: "text-red-700 bg-red-100 border border-red-200",
                    Pending: "text-amber-700 bg-amber-100 border border-amber-200"
                };
                return (
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colors[user.status]}`}>
                        {user.status}
                    </span>
                );
            }
        },
        {
            key: "lastLogin",
            label: "Last Login",
            sortable: true,
            width: "w-[150px]",
            render: (user) => <span className="text-gray-600">{user.lastLogin}</span>
        }
    ];

    const filteredData = React.useMemo(() => {
        let result = MOCK_DATA;

        if (searchValue) {
            const lower = searchValue.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
            );
        }

        if (roleFilter !== "all") {
            result = result.filter(u => u.role.toLowerCase() === roleFilter.toLowerCase());
        }

        if (statusFilter !== "all") {
            result = result.filter(u => u.status.toLowerCase() === statusFilter.toLowerCase());
        }

        return result;
    }, [searchValue, roleFilter, statusFilter]);

    const handleClearFilters = () => {
        setSearchValue("");
        setRoleFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    const hasActiveFilters = searchValue || roleFilter !== "all" || statusFilter !== "all";

    const ITEMS_PER_PAGE = 5;
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12" style={{ background: "var(--background)" }}>
            <div className="w-full max-w-7xl">
                <TableCard<TestUser>
                    title="Component Preview: TableCard"
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Components", href: "#" },
                        { label: "TableCard" }
                    ]}
                    primaryAction={
                        <button className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white text-center font-sans text-sm font-bold leading-[20px] transition-colors hover:bg-[#e55a1b]">
                            <Plus size={24} /> Add User
                        </button>
                    }
                    secondaryAction={
                        <button className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.3)] text-[#111] text-center font-sans text-sm font-bold leading-[20px] transition-colors hover:bg-black/5 bg-transparent">
                            <Download size={24} /> Export
                        </button>
                    }

                    searchPlaceholder="Search by name or email..."
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onClearFilters={hasActiveFilters ? handleClearFilters : undefined}

                    filters={[
                        {
                            key: "role",
                            label: "Role",
                            value: roleFilter,
                            onChange: setRoleFilter,
                            options: [
                                { label: "Admin", value: "admin" },
                                { label: "Editor", value: "editor" },
                                { label: "Viewer", value: "viewer" }
                            ]
                        },
                        {
                            key: "status",
                            label: "Status",
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" },
                                { label: "Pending", value: "pending" }
                            ]
                        }
                    ]}

                    stats={[
                        { label: "Total Users", value: MOCK_DATA.length.toString() },
                        { label: "Active", value: MOCK_DATA.filter(u => u.status === "Active").length.toString(), valueColorClass: "text-green-600" },
                        { label: "Admins", value: MOCK_DATA.filter(u => u.role === "Admin").length.toString(), valueColorClass: "text-purple-600" }
                    ]}

                    columns={columns}
                    data={paginatedData}
                    keyExtractor={(user) => user.id}

                    selectable
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}

                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={setSortKey}

                    pagination={{
                        currentPage: currentPage,
                        itemsPerPage: ITEMS_PER_PAGE,
                        totalItems: filteredData.length,
                        totalPages: totalPages,
                        onPageChange: setCurrentPage
                    }}
                />
            </div>
        </div>
    );
}
