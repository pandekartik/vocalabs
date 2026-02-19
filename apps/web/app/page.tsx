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
    }
  }, [user, router]);

  if (!user) return null; // Or a loading spinner

  return (
    <DashboardLayout>
      <DashboardClient />
    </DashboardLayout>
  );
}
