import { TopBar } from "@/components/layout/TopBar";
import { SideNav } from "@/components/layout/SideNav";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
                <TopBar />
                <div className="flex flex-1 min-h-0 overflow-hidden pt-6">
                    <SideNav />
                    <main className="flex-1 overflow-y-auto pl-[241px] pr-4 pb-4">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
