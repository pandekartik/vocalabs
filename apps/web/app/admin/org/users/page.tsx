"use client";
import React, { useState, useEffect } from "react";
import { TableCard, TableColumn } from "@/components/TableCard/TableCard";
import { Download, Plus, Loader2 } from "lucide-react";
import { VLModal } from "@/components/ui/VLModal";

interface Agent {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    is_active: boolean;
    created_at: string;
}

export default function UserManagementScreen() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [orgName, setOrgName] = useState("");

    // Create Agent Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        email: "",
        agent_name: "",
        agent_id: "",
        calling_type: "inbound",
        inbound_enabled: true,
        outbound_enabled: true,
        area_code: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Bulk Import Modal state
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState("");
    const [importResult, setImportResult] = useState<any>(null);

    const fetchAgents = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("token") || "";
            if (userStr && token) {
                const userData = JSON.parse(userStr);
                if (userData.organization_id) {
                    const res = await fetch(`https://api.vocalabstech.com/admin/organizations/${userData.organization_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setOrgName(data.name || "");
                        const users = data.users || [];
                        const agentUsers = users.filter((u: any) => u.role?.toLowerCase() === 'agent');
                        setAgents(agentUsers);
                    }
                }
            }
        } catch (err) {
            console.error("Fetch org data error", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleOpenCreateModal = () => {
        const initials = orgName ? orgName.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 3) : "AGT";
        const date = new Date();
        const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
        const nn = Math.floor(Math.random() * 90 + 10);
        const defaultAgentId = `${initials}${yyyymmdd}${nn}`;

        setCreateForm({
            email: "",
            agent_name: "",
            agent_id: defaultAgentId,
            calling_type: "inbound",
            inbound_enabled: true,
            outbound_enabled: true,
            area_code: ""
        });
        setFormError("");
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError("");
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("https://api.vocalabstech.com/agents/create", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(createForm)
            });
            if (response.ok) {
                setIsCreateModalOpen(false);
                setCreateForm({ email: "", agent_name: "", agent_id: "", calling_type: "inbound", inbound_enabled: true, outbound_enabled: true, area_code: "" });
                fetchAgents();
            } else {
                const data = await response.json();
                setFormError(data?.detail?.[0]?.msg || data.detail || "Error creating agent.");
            }
        } catch (err) {
            setFormError("A network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) {
            setImportError("Please select a file.");
            return;
        }
        setIsImporting(true);
        setImportError("");
        setImportResult(null);

        try {
            const token = localStorage.getItem("token") || "";
            const formData = new FormData();
            formData.append("file", importFile);

            const response = await fetch("https://api.vocalabstech.com/agents/bulk-import", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setImportResult(data);
                fetchAgents();
                // We keep modal open to show results
            } else {
                const data = await response.json();
                setImportError(data?.detail?.[0]?.msg || data.detail || "Error importing agents.");
            }
        } catch (err) {
            setImportError("A network error occurred.");
        } finally {
            setIsImporting(false);
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

    const columns: TableColumn<Agent>[] = [
        {
            key: "name", label: "Agent", sortable: true, width: "w-[220px]", render: (u) => (
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-medium text-[#0C335C]">
                        {u.first_name ? u.first_name.charAt(0).toUpperCase() : (u.email ? u.email.charAt(0).toUpperCase() : "?")}
                        {u.last_name ? u.last_name.charAt(0).toUpperCase() : ""}
                    </div>
                    <div>
                        <p className="font-medium text-[#0C335C] text-sm">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                </div>
            )
        },
        { key: "role", label: "Role", sortable: true, width: "w-[120px]", render: (u) => <span className="text-sm text-gray-600 capitalize">{u.role}</span> },
        { key: "status", label: "Status", sortable: true, width: "w-[100px]", render: (u) => <Badge text={u.is_active ? "Active" : "Inactive"} color={u.is_active ? "green" : "gray"} /> },
        { key: "created", label: "Created", width: "w-[110px]", render: (u) => <span className="text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()}</span> }
    ];

    const filtered = agents.filter(u => {
        const s = search.toLowerCase();
        const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
        return (!search || fullName.includes(s) || (u.email || "").toLowerCase().includes(s)) &&
            (statusFilter === "all" || (u.is_active ? "active" : "inactive") === statusFilter);
    });

    return (
        <>
            <TableCard
                title="Agents"
                breadcrumbs={[{ label: "Org Admin", href: "/admin/org" }, { label: "Users" }]}
                primaryAction={<button onClick={handleOpenCreateModal} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FE641F] shadow-[0_4px_14px_0_rgba(254,100,31,0.30)] text-white font-bold text-sm hover:bg-[#e55a1b]"><Plus size={16} /> Add Agent</button>}
                secondaryAction={<button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[#0C335C] font-medium text-sm hover:bg-gray-50"><Download size={16} /> Bulk Import</button>}
                searchPlaceholder="Search by name or email..."
                searchValue={search}
                onSearchChange={setSearch}
                onClearFilters={search || statusFilter !== "all" ? () => { setSearch(""); setStatusFilter("all"); } : undefined}
                filters={[
                    { key: "status", label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
                ]}
                stats={[
                    { label: "Total Agents", value: agents.length.toString(), valueColorClass: "text-[#0C335C]" },
                    { label: "Active", value: agents.filter(u => u.is_active).length.toString(), valueColorClass: "text-green-600" },
                ]}
                columns={columns}
                data={filtered}
                keyExtractor={(u) => u.id}
                selectable
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                pagination={{ currentPage, itemsPerPage: 10, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / 10) || 1, onPageChange: setCurrentPage }}
            />

            {/* Create Modal */}
            <VLModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Agent">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    {formError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{formError}</div>}
                    <div>
                        <label className="block text-sm font-medium text-[#0C335C] mb-1">Email <span className="text-red-500">*</span></label>
                        <input required type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#0C335C] mb-1">Agent Name <span className="text-red-500">*</span></label>
                        <input required type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.agent_name} onChange={e => setCreateForm({ ...createForm, agent_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#0C335C] mb-1">Agent ID <span className="text-red-500">*</span></label>
                        <input required type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.agent_id} onChange={e => setCreateForm({ ...createForm, agent_id: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#0C335C] mb-1">Calling Type <span className="text-red-500">*</span></label>
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" value={createForm.calling_type} onChange={e => setCreateForm({ ...createForm, calling_type: e.target.value })}>
                            <option value="inbound">Inbound</option>
                            <option value="outbound">Outbound</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <label className="text-sm font-medium text-[#0C335C]">Inbound Enabled</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={createForm.inbound_enabled} onChange={e => setCreateForm(prev => ({ ...prev, inbound_enabled: e.target.checked }))} />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FE641F]"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between pb-2">
                        <label className="text-sm font-medium text-[#0C335C]">Outbound Enabled</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={createForm.outbound_enabled} onChange={e => setCreateForm(prev => ({ ...prev, outbound_enabled: e.target.checked }))} />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FE641F]"></div>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#FE641F] rounded-lg hover:bg-[#e55a1b] disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Create Agent"}
                        </button>
                    </div>
                </form>
            </VLModal>

            {/* Bulk Import Modal */}
            <VLModal isOpen={isImportModalOpen} onClose={() => { setIsImportModalOpen(false); setImportResult(null); setImportFile(null); setImportError(""); }} title="Bulk Import Agents">
                {!importResult ? (
                    <form onSubmit={handleImportSubmit} className="space-y-4">
                        {importError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{importError}</div>}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-[#0C335C]">Select CSV File <span className="text-red-500">*</span></label>
                                <button type="button" onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8,agent_name,agent_id,calling_type,allow_inbound,allow_outbound,area_code,email,password\nJohn Doe,AGT001,inbound,true,false,212,john.doe@example.com,SecurePass123\nJane Smith,AGT002,outbound,false,true,415,jane.smith@example.com,SecurePass456\nMike Wilson,AGT003,inbound,true,true,312,mike.wilson@example.com,SecurePass789";
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "agent_import_template.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }} className="text-sm font-semibold text-[#FE641F] hover:underline">Download Template</button>
                            </div>
                            <input required type="file" accept=".csv" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#FE641F]" onChange={e => setImportFile(e.target.files?.[0] || null)} />
                            <p className="mt-1 text-xs text-gray-500">File must match the template schema.</p>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
                            <button type="submit" disabled={isImporting || !importFile} className="px-4 py-2 text-sm font-medium text-white bg-[#FE641F] rounded-lg hover:bg-[#e55a1b] disabled:opacity-50 flex items-center gap-2">
                                {isImporting ? <Loader2 size={16} className="animate-spin" /> : "Upload File"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <ImportResultsView result={importResult} onClose={() => { setIsImportModalOpen(false); setImportResult(null); setImportFile(null); }} />
                )}
            </VLModal>
        </>
    );
}

function ImportResultsView({ result, onClose }: { result: any; onClose: () => void }) {
    const [page, setPage] = useState(1);
    const size = 5;

    // Compute Stats
    const totalProcessed = (result.created?.length || 0) + (result.failed?.length || 0);
    const inboundAgents = (result.created || []).filter((a: any) => a.calling_type === 'inbound').length;
    const outboundAgents = (result.created || []).filter((a: any) => a.calling_type === 'outbound').length;
    const errorAgents = result.failed?.length || 0;

    // Build unified rows for table (Failed first, then successful)
    const unifiedRows = [
        ...(result.failed || []).map((f: any) => ({ ...f, status: 'error', reason: f.error })),
        ...(result.created || []).map((c: any) => ({ ...c, status: 'success', reason: 'Created successfully' }))
    ];

    const totalPages = Math.ceil(unifiedRows.length / size) || 1;
    const pageRows = unifiedRows.slice((page - 1) * size, page * size);

    const handleDownloadReport = () => {
        let csvBody = "agent_name,agent_id,email,status,reason\n";
        unifiedRows.forEach(row => {
            csvBody += `"${row.agent_name || ''}","${row.agent_id || ''}","${row.email || ''}","${row.status}","${row.reason || ''}"\n`;
        });
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvBody);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bulk_import_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 font-medium">Total Processed</p>
                    <p className="text-xl font-bold text-[#0C335C] mt-1">{totalProcessed}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">Inbound</p>
                    <p className="text-xl font-bold text-blue-700 mt-1">{inboundAgents}</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600 font-medium">Outbound</p>
                    <p className="text-xl font-bold text-purple-700 mt-1">{outboundAgents}</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-red-600 font-medium">Errors</p>
                    <p className="text-xl font-bold text-red-700 mt-1">{errorAgents}</p>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#0C335C]">Import Log</h3>
                    <button onClick={handleDownloadReport} className="text-xs font-medium text-[#FE641F] flex items-center gap-1 hover:underline">
                        <Download size={14} /> Download Report
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-gray-100 text-xs font-semibold text-gray-500">
                            <tr>
                                <th className="px-4 py-2">Row</th>
                                <th className="px-4 py-2">Agent Name</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 w-full">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {pageRows.map((r, i) => (
                                <tr key={i} className={r.status === 'error' ? 'bg-red-50/50' : ''}>
                                    <td className="px-4 py-2 text-gray-500">{r.row || '-'}</td>
                                    <td className="px-4 py-2 font-medium text-[#0C335C]">{r.agent_name || 'Unknown'}</td>
                                    <td className="px-4 py-2">
                                        {r.status === 'success' ? (
                                            <span className="inline-flex py-0.5 px-2 rounded-full bg-green-100 text-green-700 text-xs font-medium">Success</span>
                                        ) : (
                                            <span className="inline-flex py-0.5 px-2 rounded-full bg-red-100 text-red-700 text-xs font-medium">Failed</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-xs truncate max-w-[200px]" title={r.reason}>
                                        <span className={r.status === 'error' ? 'text-red-600' : 'text-green-600'}>{r.reason}</span>
                                    </td>
                                </tr>
                            ))}
                            {pageRows.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">No records to display.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="text-xs font-medium text-gray-600 hover:text-[#0C335C] disabled:opacity-50">Previous</button>
                        <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="text-xs font-medium text-gray-600 hover:text-[#0C335C] disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>

            <div className="pt-2 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-[#FE641F] rounded-lg hover:bg-[#e55a1b]">Done</button>
            </div>
        </div>
    );
}
