import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DialerPage() {
    return (
        <DashboardLayout>
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Dialer</h1>
                    <p className="text-gray-500">Welcome to the Dialer interface.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
