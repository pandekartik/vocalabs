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
                const userRole = user.role?.toUpperCase();

                if (pathname === "/") {
                    if (userRole === "PLATFORM_ADMIN") {
                        router.push("/admin/platform");
                    } else if (userRole === "ORG_ADMIN") {
                        router.push("/admin/org");
                    } else {
                        setIsChecking(false);
                    }
                } else if (pathname.startsWith("/dashboard")) {
                    if (userRole === "SUPERVISOR" || userRole === "MANAGER") {
                        setIsChecking(false);
                    } else {
                        // Regular agents should go to /call-history
                        router.push("/call-history");
                    }
                } else if (pathname.startsWith("/admin/platform")) {
                    if (userRole === "PLATFORM_ADMIN") {
                        setIsChecking(false);
                    } else {
                        router.push("/");
                    }
                } else if (pathname.startsWith("/admin/org")) {
                    if (userRole === "ORG_ADMIN" || userRole === "PLATFORM_ADMIN") {
                        setIsChecking(false);
                    } else {
                        router.push("/");
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
