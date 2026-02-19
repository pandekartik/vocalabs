import { TopBar } from "@/components/layout/TopBar";
import { SideNav } from "@/components/layout/SideNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
            <TopBar />
            <div className="flex flex-1 pt-6">
                <SideNav />
                <main className="flex-1 pl-[241px] pr-4 pb-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
