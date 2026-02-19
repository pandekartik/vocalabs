import { Card } from "@/components/ui/card";
import { Play, FileText } from "lucide-react";

interface RecentCall {
    id: string;
    phoneNumber: string;
    date: string;
    duration: string;
    callId: string;
    tag: string;
}

const recentCalls: RecentCall[] = [
    {
        id: "1",
        phoneNumber: "+1-202-555-0191",
        date: "2023-10-01 14:30",
        duration: "15 minutes",
        callId: "C123456",
        tag: "TAG-001",
    },
    {
        id: "2",
        phoneNumber: "+44-20-7946-0958",
        date: "2023-10-01 15:00",
        duration: "30 minutes",
        callId: "C654321",
        tag: "TAG-002",
    },
    {
        id: "3",
        phoneNumber: "+33-1-70-18-99-00",
        date: "2023-10-01 16:00",
        duration: "10 minutes",
        callId: "C789012",
        tag: "TAG-003",
    },
    {
        id: "4",
        phoneNumber: "+61-2-9876-5432",
        date: "2023-10-01 17:00",
        duration: "45 minutes",
        callId: "C345678",
        tag: "TAG-004",
    },
    {
        id: "5",
        phoneNumber: "+81-3-1234-5678",
        date: "2023-10-01 18:00",
        duration: "20 minutes",
        callId: "C987654",
        tag: "TAG-005",
    },
];

export default function RecentCallsCard() {
    return (
        <Card title="Recent Calls" className="h-full">
            <div className="flex flex-col gap-3 mt-4">
                {recentCalls.map((call) => (
                    <div
                        key={call.id}
                        className="flex items-center justify-between gap-2 rounded-2xl border border-[#1111110d] p-3 backdrop-blur-[42px] transition-colors hover:bg-[#f0f0f0]"
                        style={{
                            background:
                                "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)",
                        }}
                    >
                        <div className="min-w-[140px]">
                            <p className="font-semibold text-[#111]">{call.phoneNumber}</p>
                        </div>

                        <div className="flex flex-col min-w-[120px]">
                            <p className="text-xs font-medium text-[#111]">{call.date}</p>
                            <p className="text-[10px] text-muted-foreground">{call.duration}</p>
                        </div>

                        <div className="flex flex-col min-w-[80px]">
                            <p className="text-xs font-medium text-[#111]">{call.callId}</p>
                            <p className="text-[10px] text-muted-foreground">{call.tag}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-100 bg-white text-[#fe641f] hover:bg-orange-50">
                                <FileText className="h-4 w-4" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-green-100 bg-white text-[#22c55e] hover:bg-green-50">
                                <Play className="h-4 w-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
