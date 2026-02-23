"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Eye, Download, MoreHorizontal, Plus, Loader2, Trash2 } from "lucide-react";
import { VLModal } from "@/components/ui/VLModal";

interface Organization {
    id: string;
    name: string;
    slug?: string;
    is_active?: boolean;
    created_at?: string;
    admin?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        email_verified: boolean;
    };
    supervisors_count?: number;
    agents_count?: number;
}

export default function OrganizationsScreen() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Create Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", slug: "", admin_email: "", admin_first_name: "", admin_last_name: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // View Modal state
    const [viewOrg, setViewOrg] = useState<Organization | null>(null);

    const fetchOrgs = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("https://api.vocalabstech.com/admin/organizations", {
                headers: {
                    accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrgs(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Fetch orgs error", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgs();
    }, []);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError("");
        try {
            const token = localStorage.getItem("token") || "";
            const params = new URLSearchParams(formData).toString();
            const response = await fetch(`https://api.vocalabstech.com/admin/organizations?${params}`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (response.ok) {
                setIsCreateModalOpen(false);
                setFormData({ name: "", slug: "org_admin", admin_email: "", admin_first_name: "", admin_last_name: "" });
                fetchOrgs();
            } else {
                const data = await response.json();
                setFormError(data?.detail?.[0]?.msg || "Error creating organization.");
            }
        } catch (err) {
            setFormError("A network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOrg = async (orgId: string) => {
        if (!window.confirm("Are you sure you want to delete this organization? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch(`https://api.vocalabstech.com/admin/organizations/${orgId}`, {
                method: "DELETE",
                headers: {
                    accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (response.ok) {
                fetchOrgs();
            } else {
                alert("Failed to delete organization");
            }
        } catch (err) {
            console.error("Delete org error:", err);
            alert("A network error occurred while deleting.");
        }
    };

    function Badge({ text, color }: { text: string; color: "green" | "blue" | "red" | "gray" | "amber" | "purple" | "orange" }) {
        const cls: Record<string, string> = {
            green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800",
            red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
            amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        };
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[color]}`}>{text}</span>;
    }

    const columns: TableColumn<Organization>[] = [
        { key: "id", label: "Org ID", width: "w-[110px]", render: (o) => <span className="font-mono text-xs text-gray-500">{o.id?.slice(0, 8) || "N/A"}</span> },
        {
            key: "name", label: "Organization", sortable: true, width: "w-[200px]",
            render: (o) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FE641F]/20 to-[#0C335C]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#0C335C]">{o.name?.[0]?.toUpperCase() || "?"}</span>
                    </div>
                    <div>
                        <p className="font-medium text-[#0C335C] text-sm">{o.name}</p>
                        <p className="text-xs text-gray-400">{o.slug}</p>
                    </div>
                </div>
            )
        },
        { key: "status", label: "Status", sortable: true, width: "w-[100px]", render: (o) => <Badge text={o.is_active ? "Active" : "Suspended"} color={o.is_active ? "green" : "red"} /> },
        { key: "supervisors", label: "Supervisors", width: "w-[110px]", render: (o) => <span className="text-sm text-gray-600">{o.supervisors_count || 0}</span> },
        { key: "agents", label: "Agents", width: "w-[100px]", render: (o) => <span className="text-sm text-gray-700 font-medium">{o.agents_count || 0}</span> },
        { key: "created", label: "Created", width: "w-[110px]", render: (o) => <span className="text-xs text-gray-500">{new Date(o.created_at || Date.now()).toLocaleDateString()}</span> },
        { key: "admin", label: "Admin", width: "w-[170px]", render: (o) => <span className="text-xs text-gray-600 truncate">{o.admin?.first_name ? `${o.admin.first_name} ${o.admin.last_name}` : "Unassigned"} <br /><span className="text-[10px] text-gray-400">{o.admin?.email}</span></span> },
        {
            key: "actions", label: "Actions", width: "w-[80px]", fixedRight: true,
            render: (o) => (
                <div className="flex items-center gap-1 justify-center">
                    <button onClick={() => setViewOrg(o)} title="View Organization Details" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0C335C]">
                        <Eye size={14} />
                    </button>
                    <button onClick={() => handleDeleteOrg(o.id)} title="Delete Organization" className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600">
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        },
    ];

    const filtered = orgs.filter(o => {
        const s = search.toLowerCase();
        const matchSearch = !search || o.name?.toLowerCase().includes(s) || o.slug?.toLowerCase().includes(s) || o.id?.toLowerCase().includes(s);
        const st = o.is_active ? "active" : "suspended";
        const matchStatus = statusFilter === "all" || st === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FE641F] mb-4" />
                    <p className="text-[#0C335C] font-medium">Loading Organizations...</p>
                </div>
            )}

            <TableCard
                title="All Organizations"
                breadcrumbs={[{ label: "Platform Admin", href: "/admin/platform" }, { label: "Organizations" }]}
                primaryAction={
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"
                    >
                        <Plus size={16} /> Create Organization
                    </button>
                }
                secondaryAction={
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50">
                        <Download size={16} /> Export List
                    </button>
                }
                searchPlaceholder="Search by name, slug, or ID..."
                searchValue={search}
                onSearchChange={setSearch}
                onClearFilters={search || statusFilter !== "all" ? () => { setSearch(""); setStatusFilter("all"); } : undefined}
                filters={[
                    { key: "status", label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Suspended", value: "suspended" }] },
                ]}
                stats={[
                    { label: "Total Orgs", value: orgs.length.toString(), valueColorClass: "text-[#0C335C]" },
                    { label: "Active", value: orgs.filter(o => o.is_active).length.toString(), valueColorClass: "text-green-600" },
                    { label: "Suspended", value: orgs.filter(o => !o.is_active).length.toString(), valueColorClass: "text-red-600" },
                ]}
                columns={columns}
                data={filtered.slice((currentPage - 1) * 10, currentPage * 10)}
                keyExtractor={(o) => o.id}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
            />

            <VLModal
                isOpen={isCreateModalOpen}
                onClose={() => !isSubmitting && setIsCreateModalOpen(false)}
                title="Create Organization"
                size="md"
            >
                <form id="create-org-form" onSubmit={handleCreateSubmit} className="space-y-4">
                    {formError && (
                        <div className="p-3 rounded bg-red-50 text-red-600 text-sm">{formError}</div>
                    )}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Name of Organization *</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => {
                                const newName = e.target.value;
                                const autoSlug = newName.toLowerCase().replace(/\s+/g, '-').slice(0, 10);
                                setFormData({ ...formData, name: newName, slug: autoSlug });
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE641F]"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Full Name of Admin</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="First Name"
                                value={formData.admin_first_name}
                                onChange={e => setFormData({ ...formData, admin_first_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE641F]"
                            />
                            <input
                                placeholder="Last Name"
                                value={formData.admin_last_name}
                                onChange={e => setFormData({ ...formData, admin_last_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE641F]"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Admin Email *</label>
                        <input
                            required
                            type="email"
                            value={formData.admin_email}
                            onChange={e => setFormData({ ...formData, admin_email: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE641F]"
                        />
                    </div>
                </form>
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        disabled={isSubmitting}
                        className="px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-org-form"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-[#FE641F] rounded-lg hover:bg-[#e55a1b] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(254,100,31,0.30)]"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Create Organization
                    </button>
                </div>
            </VLModal>

            {/* View Organization Modal */}
            <VLModal
                isOpen={!!viewOrg}
                onClose={() => setViewOrg(null)}
                title="Organization Details"
                subtitle={`View details for ${viewOrg?.name}`}
                size="md"
            >
                {viewOrg && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID</h4>
                                <p className="text-sm font-mono text-[#0C335C] truncate">{viewOrg.id}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</h4>
                                <p className="text-sm font-medium text-[#0C335C]">{viewOrg.name}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Slug</h4>
                                <p className="text-sm text-gray-700">{viewOrg.slug || "N/A"}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                                <div className="mt-1"><Badge text={viewOrg.is_active ? "Active" : "Suspended"} color={viewOrg.is_active ? "green" : "red"} /></div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created</h4>
                                <p className="text-sm text-gray-700">{new Date(viewOrg.created_at || Date.now()).toLocaleString()}</p>
                            </div>
                            <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Administrator Details</h4>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-4">
                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                        {viewOrg.admin?.first_name?.[0] || '?'}{viewOrg.admin?.last_name?.[0] || ''}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#0C335C]">
                                            {viewOrg.admin?.first_name} {viewOrg.admin?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">{viewOrg.admin?.email}</p>
                                    </div>
                                    {viewOrg.admin?.email_verified && (
                                        <Badge text="Verified" color="green" />
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 mb-2">
                                <div className="p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col gap-1 items-start">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Supervisors</h4>
                                    <p className="text-2xl font-bold text-blue-600 text-center">{viewOrg.supervisors_count || 0}</p>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col gap-1 items-start">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Agents</h4>
                                    <p className="text-2xl font-bold text-gray-700 text-center">{viewOrg.agents_count || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </VLModal>
        </div>
    );
}
