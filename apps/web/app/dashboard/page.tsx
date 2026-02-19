import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminDashboard() {
    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome to the VocaLabs Admin Portal.</p>
                {/* Add admin-specific widgets here later */}
            </div>
        </DashboardLayout>
    );
}
