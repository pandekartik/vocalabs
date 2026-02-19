"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User } from "lucide-react";
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
    React.useEffect(() => {
        console.log("IncomingCallPopup Mounted");
    }, []);

    console.log("IncomingCallPopup Rendering. isVisible:", isVisible);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#111] z-[9998]"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 500 }}
                        style={{
                            /* Figma Design Specs */
                            width: "517px",
                            height: "359px",
                            padding: "24px",
                            gap: "12px",
                            borderRadius: "24px",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            background: "rgba(255, 255, 255, 0.9)", // Kept slightly transparent for glass effect
                            boxShadow: "0 4px 8px 0 rgba(26, 26, 26, 0.12)",
                            backdropFilter: "blur(42px)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            position: "fixed",
                            top: "100px",
                            left: "calc(50% - 258.5px)",
                            zIndex: 9999,
                        }}
                        className="incoming-call-popup"
                    >
                        {/* Header / Top Section */}
                        <div className="flex w-full justify-between items-center mb-2">
                            <div
                                style={{
                                    color: "#0C335C",
                                    fontFamily: '"IBM Plex Sans", sans-serif',
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    textAlign: "right",
                                    fontStyle: "normal",
                                    lineHeight: "normal"
                                }}
                            >
                                Incoming Call
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Frame 71: Phone Number Display */}
                        <div
                            className="flex items-center justify-center w-full flex-grow mb-4"
                            style={{
                                /* Frame 71 CSS */
                                display: "flex",
                                padding: "16px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                flex: "1 0 0",
                                alignSelf: "stretch",
                                borderRadius: "16px",
                                border: "1px solid rgba(17, 17, 17, 0.05)",
                                background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)",
                                backdropFilter: "blur(42px)",
                            }}
                        >
                            <h2
                                className="text-3xl font-bold"
                                style={{
                                    color: "#0C335C",
                                    fontFamily: '"IBM Plex Sans", sans-serif'
                                }}
                            >
                                {callerName || "+1-555-0456"}
                            </h2>
                        </div>

                        {/* Action Buttons - Stacked */}
                        <div className="flex flex-col w-full gap-3">
                            <CallControlButton
                                variant="call"
                                onClick={onAccept}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Phone size={20} fill="currentColor" />
                                <span>Answer Call</span>
                            </CallControlButton>

                            <CallControlButton
                                variant="end"
                                onClick={onDecline}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>Send to Voicemail</span>
                            </CallControlButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default IncomingCallPopup;
