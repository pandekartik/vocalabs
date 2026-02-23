"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Plus, Search, Loader2 } from "lucide-react";
import { VLModal } from "@/components/ui/VLModal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Supervisor {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
    created_at: string;
}

export default function SupervisorsScreen() {
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [createForm, setCreateForm] = useState({
        email: "",
        first_name: "",
        last_name: ""
    });

    const [currentPage, setCurrentPage] = useState(1);

    const fetchSupervisors = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const decoded: any = jwtDecode(token);
            if (!decoded.organization_id) return;

            const res = await axios.get(`https://api.vocalabstech.com/admin/organizations/${decoded.organization_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const orgUsers = res.data.users || [];
            const sups = orgUsers.filter((u: any) => u.role?.toLowerCase() === "supervisor");
            setSupervisors(sups);
        } catch (err) {
            console.error("Failed to fetch supervisors:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError("");

        try {
            const token = localStorage.getItem("token") || "";
            const queryParams = new URLSearchParams({
                email: createForm.email,
                first_name: createForm.first_name,
                last_name: createForm.last_name
            }).toString();

            await axios.post(`https://api.vocalabstech.com/admin/supervisors?${queryParams}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsCreateModalOpen(false);
            setCreateForm({ email: "", first_name: "", last_name: "" });
            fetchSupervisors();
        } catch (err: any) {
            setFormError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Failed to create supervisor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: TableColumn<Supervisor>[] = [
        {
            key: "name", label: "Supervisor", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {u.first_name ? u.first_name[0] : (u.email ? u.email.substring(0, 1).toUpperCase() : "?")}
                        {u.last_name ? u.last_name[0] : ""}
                    </div>
                    <div>
                        <p className="font-medium text-[#0C335C] text-sm">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                </div>
            )
        },
        { key: "created", label: "Date Added", width: "w-[120px]", render: (u) => <span className="text-sm text-gray-600">{new Date(u.created_at).toLocaleDateString()}</span> },
        {
            key: "actions", label: "Actions", width: "w-[120px]", fixedRight: true, render: () => (
                <div className="flex gap-1 justify-center">
                    <button className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">View</button>
                </div>
            )
        },
    ];

    const filtered = supervisors.filter(u => {
        const s = search.toLowerCase();
        const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
        return !search || fullName.includes(s) || (u.email || "").toLowerCase().includes(s);
    });

    return (
        <>
            <TableCard
                title="Supervisors"
                breadcrumbs={[{ label: "Org Admin", href: "/admin/org" }, { label: "Supervisors" }]}
                primaryAction={<button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"><Plus size={16} /> Add Supervisor</button>}
                searchPlaceholder="Search supervisors..."
                searchValue={search}
                onSearchChange={setSearch}
                stats={[
                    { label: "Total Supervisors", value: loading ? "-" : supervisors.length.toString(), valueColorClass: "text-[#0C335C]" },
                ]}
                columns={columns}
                data={filtered}
                keyExtractor={(u) => u.id}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
            />

            {/* Create Supervisor Modal */}
            <VLModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Supervisor">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    {formError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{formError}</div>}
                    <div>
                        <label className="block text-sm font-medium text-[#0C335C] mb-1">Email <span className="text-red-500">*</span></label>
                        <input required type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-[#0C335C] mb-1">First Name <span className="text-red-500">*</span></label>
                            <input required type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.first_name} onChange={e => setCreateForm({ ...createForm, first_name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#0C335C] mb-1">Last Name</label>
                            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.last_name} onChange={e => setCreateForm({ ...createForm, last_name: e.target.value })} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#FE641F] rounded-lg hover:bg-[#e55a1b] disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Add Supervisor"}
                        </button>
                    </div>
                </form>
            </VLModal>
        </>
    );
}
