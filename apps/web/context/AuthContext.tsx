"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { INTELICONVOAPI } from "@/lib/axios";
import { useCallStore } from "@/store/useCallStore";

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
    loginError: string | null;
    login: (email: string, password: string, organizationSlug?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Hydrate user from localStorage on mount
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
            }
        }
    }, []);

    const login = async (email: string, password: string, organizationSlug?: string) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            // Call the real backend: POST /auth/login
            const response = await INTELICONVOAPI.post("/auth/login", {
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

            // Store in localStorage (token + user details)
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(newUser));

            setUser(newUser);

            // Initialize Twilio Device immediately after login
            // Small delay to ensure localStorage is written before store reads it
            setTimeout(() => {
                useCallStore.getState().initializeDevice();
            }, 100);

            router.push("/dashboard");
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
        // Destroy Twilio Device before clearing auth
        useCallStore.getState().destroyDevice();

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setLoginError(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginError, login, logout }}>
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
