import { useState } from "react";
import { useCallStore } from "@/store/useCallStore";
import { Bug, ChevronDown, ChevronUp } from "lucide-react";

export default function DebugCallControl() {
    const { setMockState } = useCallStore();
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[9999] p-3 bg-black/80 rounded-full text-white hover:bg-black transition-colors shadow-lg"
                title="Open Debug Controls"
            >
                <Bug size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 p-4 bg-black/90 rounded-lg text-white text-xs shadow-xl w-64 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
                <div className="flex items-center gap-2 font-bold">
                    <Bug size={16} />
                    <h3>Dev: Mock States</h3>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded"
                >
                    <ChevronDown size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={() => setMockState({ device: null, callStatus: 'idle', errorMessage: null })}
                    className="px-3 py-2 bg-orange-600/80 hover:bg-orange-600 rounded text-left transition-colors"
                >
                    State: Initializing (No Device)
                </button>
                <button
                    onClick={() => setMockState({ device: {} as any, callStatus: 'idle', errorMessage: null })}
                    className="px-3 py-2 bg-green-600/80 hover:bg-green-600 rounded text-left transition-colors"
                >
                    State: Connected (Device Ready)
                </button>
                <button
                    onClick={() => setMockState({ device: null, callStatus: 'idle', errorMessage: "Connection Failed" })}
                    className="px-3 py-2 bg-red-600/80 hover:bg-red-600 rounded text-left transition-colors"
                >
                    State: Disconnected (Error)
                </button>
                <button
                    onClick={() => setMockState({
                        device: {} as any,
                        callStatus: 'in-progress',
                        errorMessage: null,
                        phoneNumber: '+1234567890',
                        duration: 12
                    })}
                    className="px-3 py-2 bg-blue-600/80 hover:bg-blue-600 rounded text-left transition-colors"
                >
                    State: Active Call
                </button>
                <button
                    onClick={() => setMockState({
                        incomingCall: {
                            parameters: { From: '+1-555-0123' },
                            accept: () => console.log('Mock Accept'),
                            reject: () => console.log('Mock Reject'),
                            on: () => { }
                        } as any
                    })}
                    className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 rounded text-left transition-colors"
                >
                    State: Incoming Call
                </button>
                <button
                    onClick={() => setMockState({ callStatus: 'idle', phoneNumber: '', duration: 0, errorMessage: null })}
                    className="px-3 py-2 bg-gray-600/80 hover:bg-gray-600 rounded text-left mt-2 transition-colors font-medium border border-white/20"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
