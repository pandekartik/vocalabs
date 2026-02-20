"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, ChevronDown, ChevronUp, FileUp, XCircle, AlertCircle } from "lucide-react";
import { VLModal, VLButton, VLCard } from "@/components/ui/vl";

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type UploadState = "idle" | "uploading" | "validating" | "results";

const MOCK_ERRORS = [
    { row: 12, error: "Invalid phone number format" },
    { row: 28, error: "Missing required field: Email" },
    { row: 31, error: "Role must be Inbound, Outbound, or Both" },
];

export function BulkUploadModal({ isOpen, onClose, onSuccess }: BulkUploadModalProps) {
    const [state, setState] = useState<UploadState>("idle");
    const [isDragging, setIsDragging] = useState(false);
    const [showTemplate, setShowTemplate] = useState(false);
    const [results, setResults] = useState({ total: 0, passed: 0, failed: 0 });
    const fileRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (!file.name.endsWith(".csv")) { alert("Please upload a CSV file"); return; }
        setState("uploading");
        setTimeout(() => {
            setState("validating");
            setTimeout(() => {
                setResults({ total: 45, passed: 42, failed: 3 });
                setState("results");
            }, 1500);
        }, 1000);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const f = e.dataTransfer.files[0]; if (f) processFile(f);
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (f) processFile(f);
    };
    const handleImport = () => { setState("idle"); onSuccess(); onClose(); };
    const reset = () => { setState("idle"); setResults({ total: 0, passed: 0, failed: 0 }); };

    const isProcessing = state === "uploading" || state === "validating";

    const footerContent = (
        <>
            <VLButton
                variant="ghost"
                disabled={isProcessing}
                onClick={state === "results" ? reset : onClose}
            >
                {state === "results" ? "Cancel Import" : "Cancel"}
            </VLButton>
            <VLButton
                variant="primary"
                disabled={isProcessing || (state === "results" && results.passed === 0)}
                onClick={state === "results" ? handleImport : () => fileRef.current?.click()}
            >
                {state === "results" ? `Import ${results.passed} Agents` : "Select File"}
            </VLButton>
        </>
    );

    return (
        <VLModal
            isOpen={isOpen}
            onClose={isProcessing ? () => { } : onClose}
            dismissible={!isProcessing}
            title="Bulk Import Agents"
            subtitle="Upload a CSV file to add multiple agents at once."
            size="md"
            footer={footerContent}
        >
            {/* IDLE — Drag & Drop + Template */}
            {state === "idle" && (
                <div className="flex flex-col gap-5">
                    <div
                        className={`border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${isDragging ? "border-brand bg-brand/5" : "border-vl-gray-2 bg-vl-gray-1/50"
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                    >
                        <div className="w-16 h-16 bg-white rounded-pill flex items-center justify-center shadow-vl-sm mb-4">
                            <UploadCloud className={isDragging ? "text-brand" : "text-navy"} size={32} />
                        </div>
                        <p className="text-vl-md font-semibold text-navy mb-1">Drag & drop your CSV here</p>
                        <p className="text-vl-sm text-vl-gray-3 mb-5">or click to browse from your computer</p>
                        <VLButton variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                            Browse Files
                        </VLButton>
                        <input type="file" accept=".csv" className="hidden" ref={fileRef} onChange={handleFileSelect} />
                    </div>

                    <VLCard variant="solid" radius="md" className="!p-0 overflow-hidden shadow-vl-sm">
                        <button
                            onClick={() => setShowTemplate(!showTemplate)}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-vl-gray-1 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-navy" />
                                <span className="text-vl-sm font-medium text-navy">CSV Template Requirements</span>
                            </div>
                            {showTemplate ? <ChevronUp size={18} className="text-vl-gray-3" /> : <ChevronDown size={18} className="text-vl-gray-3" />}
                        </button>
                        {showTemplate && (
                            <div className="px-5 pb-5 pt-2 border-t border-vl-gray-4">
                                <p className="text-vl-sm text-vl-gray-3 mb-3">Required columns (exact order):</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {["firstName", "lastName", "email", "phone", "role", "dailyLimit"].map(h => (
                                        <span key={h} className="px-2 py-1 bg-vl-gray-1 rounded border border-vl-gray-2 text-vl-xs font-mono text-vl-gray-3">{h}</span>
                                    ))}
                                </div>
                                <button className="text-brand text-vl-sm font-medium hover:underline flex items-center gap-1.5">
                                    <FileUp size={14} /> Download Sample Template
                                </button>
                            </div>
                        )}
                    </VLCard>
                </div>
            )}

            {/* PROCESSING */}
            {isProcessing && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 border-4 border-vl-gray-4 rounded-full" />
                        <div className="absolute inset-0 border-4 border-brand rounded-full border-t-transparent animate-spin" />
                        <UploadCloud size={30} className="text-brand" />
                    </div>
                    <p className="text-vl-lg font-bold text-navy mb-1">
                        {state === "uploading" ? "Uploading File..." : "Validating Rows..."}
                    </p>
                    <p className="text-vl-sm text-vl-gray-3">Please wait, this may take a moment.</p>
                </div>
            )}

            {/* RESULTS */}
            {state === "results" && (
                <div className="flex flex-col gap-5">
                    <VLCard variant="solid" radius="md" className="!bg-navy !border-navy shadow-vl-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-vl-md font-semibold text-white">Validation Complete</p>
                                <p className="text-vl-sm text-white/60 mt-1">Processed {results.total} rows from your file.</p>
                            </div>
                            <CheckCircle className="text-green-400" size={28} />
                        </div>
                    </VLCard>

                    <div className="grid grid-cols-2 gap-4">
                        <VLCard variant="solid" radius="md" className="!border-green-200 !bg-green-50">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-vl-sm font-semibold text-green-800">Ready</span>
                            </div>
                            <span className="text-vl-2xl font-bold text-green-700">{results.passed}</span>
                            <span className="text-vl-sm text-green-600 ml-1">agents</span>
                        </VLCard>
                        <VLCard variant="solid" radius="md" className="!border-red-200 !bg-red-50">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle size={16} className="text-red-600" />
                                <span className="text-vl-sm font-semibold text-red-800">Skipped</span>
                            </div>
                            <span className="text-vl-2xl font-bold text-red-700">{results.failed}</span>
                            <span className="text-vl-sm text-red-600 ml-1">rows</span>
                        </VLCard>
                    </div>

                    {results.failed > 0 && (
                        <VLCard variant="solid" radius="md" className="!p-0 overflow-hidden">
                            <div className="flex items-center gap-2 bg-vl-gray-1 px-4 py-3 border-b border-vl-gray-4">
                                <AlertCircle size={14} className="text-danger" />
                                <span className="text-vl-sm font-medium text-navy">Row Errors</span>
                            </div>
                            <div className="max-h-36 overflow-y-auto">
                                {MOCK_ERRORS.map((err, i) => (
                                    <div key={i} className="flex gap-4 px-4 py-2.5 border-b border-vl-gray-4 last:border-0 hover:bg-vl-gray-1">
                                        <span className="font-mono text-vl-xs text-vl-gray-3 w-12 shrink-0">Row {err.row}</span>
                                        <span className="text-vl-xs text-danger">{err.error}</span>
                                    </div>
                                ))}
                            </div>
                        </VLCard>
                    )}
                </div>
            )}
        </VLModal>
    );
}
