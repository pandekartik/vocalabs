"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";
import CallControlButton from "@/components/dashboard/CallControlButton";

interface IncomingCallPopupProps {
    callerName?: string;
    callerImage?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    isVisible: boolean;
    onClose: () => void;
}

const IncomingCallPopup: React.FC<IncomingCallPopupProps> = ({
    callerName = "John Doe",
    callerImage,
    onAccept,
    onDecline,
    isVisible = true,
    onClose,
}) => {
    useEffect(() => {
        console.log("IncomingCallPopup Mounted");
    }, []);

    console.log("IncomingCallPopup Rendering. isVisible:", isVisible);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        zIndex: 9999,
                        width: "360px",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        borderRadius: "24px",
                        border: "1px solid #FE641F",
                        background: "#FFF",
                        boxShadow: "0px 4px 34px 0px rgba(254, 100, 31, 0.30)",
                        backdropFilter: "blur(17px)",
                    }}
                >
                    {/* Header */}
                    <div className="flex w-full justify-between items-center">
                        <span style={{ color: "#0C335C", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: "16px", fontWeight: 500 }}>
                            Incoming Call
                        </span>
                        <button onClick={onClose} className="text-[#111] hover:opacity-70 transition-opacity">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Phone Number Display */}
                    <div
                        style={{
                            display: "flex",
                            padding: "16px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "16px",
                            border: "1px solid rgba(17, 17, 17, 0.05)",
                            background: "linear-gradient(109.5deg, rgba(17, 17, 17, 0.05) 4.1%, rgba(17, 17, 17, 0.02) 105.6%)",
                            backdropFilter: "blur(42px)",
                        }}
                    >
                        <span style={{ color: "#111", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: "16px", fontWeight: 500 }}>
                            {callerName || "+1-555-0456"}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full gap-3">
                        <CallControlButton
                            variant="call"
                            onClick={onAccept}
                            className="w-full justify-center"
                        >
                            <Phone size={20} fill="currentColor" className="mr-2" />
                            <span>Answer Call</span>
                        </CallControlButton>

                        <CallControlButton
                            variant="end"
                            onClick={onDecline}
                            className="w-full justify-center"
                        >
                            <div className="rotate-[135deg] mr-2">
                                <Phone size={20} fill="currentColor" />
                            </div>
                            <span>Send to Voicemail</span>
                        </CallControlButton>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IncomingCallPopup;
