"use client";

import React, { useState } from "react";
import IncomingCallPopup from "@/components/IncomingCallPopup";

export default function PopupDemo() {
    const [showPopup, setShowPopup] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Anti-Gravity Toast / Popup Demo</h1>
                <p className="text-white/80 text-lg">
                    Click the button below to simulate an incoming call with the glassmorphism design.
                </p>
            </div>

            <button
                onClick={() => setShowPopup(true)}
                className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
                Simulate Incoming Call
            </button>

            {/* The Popup Component */}
            <IncomingCallPopup
                isVisible={true}
                onClose={() => console.log("Close clicked")}
                callerName="Alice Wonderland"
                onAccept={() => alert("Call Accepted!")}
                onDecline={() => console.log("Decline clicked")}
            />

            {/* Background elements to demonstrate blur */}
            <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="fixed top-1/3 right-1/4 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
    );
}
