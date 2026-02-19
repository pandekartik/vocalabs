import { Card } from "@/components/ui/card";
import { Phone, Clock } from "lucide-react";

interface AgentInfoCardProps {
    status?: "LIVE" | "ON CALL";
}

export default function AgentInfoCard({ status = "LIVE" }: AgentInfoCardProps) {
    const isLive = status === "LIVE";

    return (
        <Card title="Agent Information">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#fe641f]/5 bg-gradient-to-br from-[#fe641f]/20 to-[#fe641f]/10 text-xs text-[#111]">
                        K.P.
                    </div>
                    <div>
                        <p className="font-medium text-[#111]">Kartik Pande</p>
                        <p className="text-sm text-[#111]">+91 7722010666</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white ${isLive ? "bg-[#22c55e]" : "bg-[#fe641f]"}`}>
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    {status}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div
                    className="flex flex-1 items-center justify-between gap-2 rounded-2xl border border-[#1111110d] p-3 backdrop-blur-[42px]"
                    style={{
                        background:
                            "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)",
                    }}
                >
                    <div>
                        <p className="text-xs text-muted-foreground">Call Time (Today)</p>
                        <p className="text-sm font-medium text-[#111]">05 HR 19 MIN</p>
                    </div>
                    <Clock className="h-5 w-5 text-[#111]" />
                </div>
                <div
                    className="flex flex-1 items-center justify-between gap-2 rounded-2xl border border-[#1111110d] p-3 backdrop-blur-[42px]"
                    style={{
                        background:
                            "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)",
                    }}
                >
                    <div>
                        <p className="text-xs text-muted-foreground">No. of Calls (Today)</p>
                        <p className="text-sm font-medium text-[#111]">47</p>
                    </div>
                    <Phone className="h-5 w-5 text-[#111]" />
                </div>
            </div>
        </Card>
    );
}
