import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voca Labs | Dashboard",
};

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardClient />
    </DashboardLayout>
  );
}
