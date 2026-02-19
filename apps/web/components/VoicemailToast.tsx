"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface VoicemailToastProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function VoicemailToast({ isVisible, onClose }: VoicemailToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    style={{
                        position: "fixed",
                        top: "24px",
                        right: "24px",
                        zIndex: 9999,
                        display: "inline-flex",
                        minWidth: "400px",
                        padding: "16px",
                        alignItems: "center",
                        gap: "16px",
                        borderRadius: "12px",
                        border: "1px solid #FE641F",
                        background: "#FE641F",
                        boxShadow: "0px 4px 12px rgba(254, 100, 31, 0.2)",
                    }}
                >
                    <CheckCircle
                        style={{
                            width: "16px",
                            height: "16px",
                            color: "#FFF",
                        }}
                    />
                    <span
                        style={{
                            color: "#FFF",
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "normal",
                        }}
                    >
                        Sent to voicemail
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
