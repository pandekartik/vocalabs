"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User } from "lucide-react";

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
                    {/* Header / Top Section */}
                    <div className="flex w-full justify-between items-center mb-2">
                        <div
                            style={{
                                color: "#0C335C",
                                fontFamily: '"IBM Plex Sans", sans-serif',
                                fontSize: "16px",
                                fontWeight: 500,
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
                        {/* Frame 36: Answer Button */}
                        <button
                            onClick={onAccept}
                            className="w-full flex items-center justify-center gap-2 text-white font-semibold transition-transform active:scale-95"
                            style={{
                                /* Frame 36 CSS */
                                display: "flex",
                                padding: "10px 16px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                alignSelf: "stretch",
                                borderRadius: "10px",
                                background: "#1DB013",
                                boxShadow: "0px 4px 14px 0px rgba(254, 100, 31, 0.30)",
                                fontFamily: '"IBM Plex Sans", sans-serif'
                            }}
                        >
                            <Phone size={20} fill="currentColor" />
                            Answer Call
                        </button>

                        {/* Frame 66: Voicemail Button */}
                        <button
                            onClick={onDecline}
                            className="w-full flex items-center justify-center gap-2 text-white font-semibold transition-colors"
                            style={{
                                /* Frame 66 CSS */
                                display: "flex",
                                padding: "10px 16px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                alignSelf: "stretch",
                                borderRadius: "10px",
                                background: "#B01313",
                                boxShadow: "0px 4px 14px 0px rgba(254, 100, 31, 0.30)",
                                fontFamily: '"IBM Plex Sans", sans-serif'
                            }}
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
                            Send to Voicemail
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IncomingCallPopup;
