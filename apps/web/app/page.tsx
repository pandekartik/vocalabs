"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Slight delay to allow context to hydration
    if (!user) {
      // Check localStorage directly to avoid flicker if context is slow
      if (!localStorage.getItem("user")) {
        router.push("/login");
      }
    } else {
      // If user is logged in, ensure they are on the right default page for their role
      if (user.role === "PLATFORM_ADMIN") {
        router.push("/admin/platform");
      } else if (user.role === "ORG_ADMIN") {
        router.push("/admin/org");
      }
      // AGENT and SUPERVISOR stay on root ("/") for the Dialer.
    }
  }, [user, router]);

  if (!user) return null; // Or a loading spinner

  return (
    <DashboardLayout>
      <DashboardClient />
    </DashboardLayout>
  );
}
