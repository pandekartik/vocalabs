
import { useCallStore } from "@/store/useCallStore";
import { Button } from "@repo/ui/button";

export default function DebugCallControl() {
    const { setMockState } = useCallStore();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 p-4 bg-black/80 rounded-lg text-white text-xs">
            <h3 className="font-bold border-b border-white/20 pb-1 mb-1">Dev: Mock States</h3>
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => setMockState({ device: null, callStatus: 'idle', errorMessage: null })}
                    className="px-2 py-1 bg-orange-600 rounded hover:bg-orange-700 text-left"
                >
                    State: Initializing (No Device)
                </button>
                <button
                    onClick={() => setMockState({ device: {} as any, callStatus: 'idle', errorMessage: null })}
                    className="px-2 py-1 bg-green-600 rounded hover:bg-green-700 text-left"
                >
                    State: Connected (Device Ready)
                </button>
                <button
                    onClick={() => setMockState({ device: null, callStatus: 'idle', errorMessage: "Connection Failed" })}
                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-left"
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
                    className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-left"
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
                    className="px-2 py-1 bg-purple-600 rounded hover:bg-purple-700 text-left"
                >
                    State: Incoming Call
                </button>
                <button
                    onClick={() => setMockState({ callStatus: 'idle', phoneNumber: '', duration: 0, errorMessage: null })}
                    className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700 text-left mt-2"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
