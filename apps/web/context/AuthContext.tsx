"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
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

    const login = (email: string) => {
        // Mock login logic - in a real app, this would verify credentials
        // For now, we simulate a successful login as an Agent (or based on email)

        let role = "AGENT";
        let firstName = "Kartik";
        let lastName = "Pande";

        if (email.includes("admin")) {
            role = "ORG_ADMIN";
            firstName = "Atharv";
        } else if (email.includes("supervisor")) {
            role = "SUPERVISOR";
            firstName = "Saif";
            lastName = "Khan";
        }

        const newUser = {
            first_name: firstName,
            last_name: lastName,
            email,
            role,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
