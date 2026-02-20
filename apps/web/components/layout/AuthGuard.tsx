"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isInitialized } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (isInitialized && !isLoading) {
            if (!user) {
                // If the user isn't authenticated yet, send to login
                router.push("/login?redirect_to=" + encodeURIComponent(pathname));
            } else {
                // Determine if they are allowed on this route
                // If it's a /dashboard route, require supervisor/manager role
                if (pathname.startsWith("/dashboard")) {
                    const r = user.role?.toUpperCase();
                    if (r === "SUPERVISOR" || r === "MANAGER") {
                        setIsChecking(false);
                    } else {
                        // Regular agents should go to /call-history
                        router.push("/call-history");
                    }
                } else {
                    // Regular agent / call-history routes
                    setIsChecking(false);
                }
            }
        }
    }, [user, isLoading, isInitialized, router, pathname]);

    if (!isInitialized || isLoading || isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}
