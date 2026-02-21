"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCallStore } from "@/store/useCallStore";
import axios from "axios";

interface User {
    user_id: string;
    first_name?: string;
    last_name?: string;
    email: string;
    role: string;
    organization_id?: string;
    email_verified?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isInitialized: boolean;
    loginError: string | null;
    login: (email: string, password: string, rememberMe: boolean, organizationSlug?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Hydrate user from localStorage on mount
        const storedUser = localStorage.getItem("user");
        const sessionExpiryStr = localStorage.getItem("sessionExpiry");

        if (storedUser) {
            const now = new Date().getTime();
            const sessionExpiry = sessionExpiryStr ? parseInt(sessionExpiryStr, 10) : 0;

            if (sessionExpiry > 0 && now > sessionExpiry) {
                // Session expired
                logout();
            } else {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Failed to parse user from localStorage", error);
                    logout();
                }
            }
        }
        setIsInitialized(true);
    }, [router]);

    const login = async (email: string, password: string, rememberMe: boolean, organizationSlug?: string) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            // Call the real backend: POST /auth/login
            const response = await axios.post("https://api.vocalabstech.com/auth/login", {
                email,
                password,
                organization_slug: organizationSlug || "",
            });

            const data = response.data;

            if (!data.access_token) {
                throw new Error("No access token received from server");
            }

            // Build user object from response
            const newUser: User = {
                user_id: data.user_id,
                email,
                role: data.role,
                organization_id: data.organization_id,
                email_verified: data.email_verified,
            };

            // Calculate expiry
            // 90 days if rememberMe, otherwise let's say 1 day (or session duration)
            const expiryDays = rememberMe ? 90 : 1;
            const expiryTime = new Date().getTime() + expiryDays * 24 * 60 * 60 * 1000;

            // Store in localStorage (token + user details + expiry)
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(newUser));
            localStorage.setItem("sessionExpiry", expiryTime.toString());

            setUser(newUser);

            // Initialize Twilio Device immediately after login
            // Small delay to ensure localStorage is written before store reads it
            setTimeout(() => {
                useCallStore.getState().initializeDevice();
            }, 100);

            // Role-based routing
            if (newUser.role === "PLATFORM_ADMIN") {
                router.push("/admin/platform");
            } else if (newUser.role === "ORG_ADMIN") {
                router.push("/admin/org");
            } else {
                // AGENT and SUPERVISOR map to the Dialer, which is now "/dialer"
                router.push("/dialer");
            }
        } catch (err: any) {
            const detail = err?.response?.data?.detail;
            const message = detail || err.message || "Login failed";
            console.error("Login failed:", message);
            setLoginError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Destroy Twilio Device before clearing auth safely
        try {
            const callStore = useCallStore.getState();
            if (callStore && typeof callStore.destroyDevice === 'function') {
                callStore.destroyDevice();
            }
        } catch (e) {
            console.warn("Could not destroy Twilio device during logout", e);
        }

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("sessionExpiry");
        setUser(null);
        setLoginError(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isInitialized, loginError, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
