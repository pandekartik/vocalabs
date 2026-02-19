"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "Platform Admin" | "Org Admin" | "Supervisor" | "Agent";

export interface User {
    email: string;
    name: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem("voca_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string) => {
        let role: UserRole = "Agent"; // Default
        let name = "User";

        // Mock Logic for Roles
        if (email.includes("platform")) {
            role = "Platform Admin";
            name = "Platform Admin";
        } else if (email.startsWith("admin")) {
            role = "Org Admin";
            name = "Org Admin";
        } else if (email.startsWith("supervisor")) {
            role = "Supervisor";
            name = "Supervisor";
        } else if (email.startsWith("agent")) {
            role = "Agent";
            name = "Agent";
        }

        const newUser: User = { email, name, role };
        setUser(newUser);
        localStorage.setItem("voca_user", JSON.stringify(newUser));

        // Redirect based on role
        if (role === "Platform Admin" || role === "Org Admin") {
            router.push("/dashboard");
        } else {
            router.push("/dialer");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("voca_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
