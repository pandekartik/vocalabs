"use client";

import { motion, AnimatePresence } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Clock, Phone, User, Calendar, Bell, Pencil, Check } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/button";

interface PostCallDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    callData?: {
        callerName?: string;
        phoneNumber?: string;
        duration?: string;
        callId?: string;
        time?: string;
        disconnectedBy?: string;
        tags?: string[];
        notes?: string;
    };
}

export default function PostCallDrawer({ isOpen, onClose, callData }: PostCallDrawerProps) {
    // Mock data if not provided
    const data = {
        callerName: callData?.callerName || "Unknown",
        phoneNumber: callData?.phoneNumber || "+1-555-0456",
        duration: callData?.duration || "30 Mins",
        callId: callData?.callId || "C789012",
        time: callData?.time || "2023-10-01 15:00",
        disconnectedBy: callData?.disconnectedBy || "Agent",
        tags: callData?.tags || ["TAG-0012", "TAG-0012", "TAG-0012", "TAG-0012", "TAG-0012", "TAG-0012"],
        notes: callData?.notes || "Customer interested in premium plan. Price concern discussed. Follow-up needed on features."
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#111] z-[9998]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-[517px] bg-white/90 backdrop-blur-[42px] border-l border-white/10 shadow-2xl z-[9999] rounded-l-[24px] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#111]/5">
                            <h2 className="text-[#0C335C] font-sans font-medium text-lg">Post-Call Review</h2>
                            <button onClick={onClose} className="text-[#111] hover:text-[#0C335C] transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

                            {/* Phone Number Display */}
                            <div className="flex items-center justify-center p-4 rounded-2xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                <span className="text-[#111] font-sans font-medium text-lg">{data.phoneNumber}</span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <InfoItem label="Call ID" value={data.callId} />
                                <InfoItem label="Call Duration" value={data.duration} />
                                <InfoItem label="Disconnected by" value={data.disconnectedBy} />
                                <InfoItem label="Time" value={data.time} />
                            </div>

                            {/* Call Recording Player */}
                            <div className="flex items-center justify-between p-3 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 font-sans text-xs">Recording</span>
                                    <span className="text-[#111] font-sans font-medium text-sm">Successful</span>
                                </div>
                                <button className="flex items-center justify-center w-8 h-8 rounded-2xl border border-[#cbcbcb] bg-transparent hover:bg-black/5 transition-colors">
                                    <Play size={12} fill="currentColor" />
                                </button>
                            </div>

                            {/* Tagging IDs */}
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-sans text-xs">Tagging IDs</span>
                                <div className="p-3 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px] flex flex-wrap gap-2">
                                    {data.tags.map((tag, i) => (
                                        <div key={i} className="px-2 py-1 bg-white rounded-lg border border-[#111]/5 flex items-center justify-center">
                                            <span className="text-[#111] font-sans font-medium text-sm">{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-sans text-xs">Notes</span>
                                <div className="p-3 rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
                                    <p className="text-[#111] font-sans font-medium text-sm whitespace-pre-wrap">
                                        {data.notes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-[#111]/5 flex items-center justify-between mt-auto">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)] bg-white border border-[#111]/5 hover:bg-gray-50 transition-colors">
                                <Bell size={16} />
                                <span className="text-[#111] font-sans font-semibold text-sm">Set Reminder</span>
                            </button>

                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)] bg-white border border-[#fe641f] hover:bg-orange-50 transition-colors">
                                    <Pencil size={16} />
                                    <span className="text-[#111] font-sans font-semibold text-sm">Edit</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] shadow-[0px_4px_14px_0px_rgba(254,100,31,0.3)] bg-[#fe641f] hover:bg-[#e55a1b] transition-colors">
                                    <Check size={16} className="text-white" />
                                    <span className="text-white font-sans font-semibold text-sm">Save</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col justify-center px-3 py-2 h-[54px] rounded-xl border border-[#111]/5 bg-gradient-to-br from-[#111]/5 to-[#111]/[0.02] backdrop-blur-[42px]">
            <span className="text-slate-500 font-sans text-xs">{label}</span>
            <span className="text-[#111] font-sans font-medium text-sm text-right">{value}</span>
        </div>
    );
}
