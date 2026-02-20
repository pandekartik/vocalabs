"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { VLButton, VLInput } from "@/components/ui/vl";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        try {
            await login(email, password, rememberMe);
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4"
            style={{ background: "var(--background)", minHeight: "812px" }}>

            <div className="bg-white rounded-xl w-full max-w-[480px] p-8 md:p-12 flex flex-col items-center shadow-vl-md">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/Logo.png"
                        alt="Voca Labs"
                        width={180}
                        height={50}
                        className="h-auto w-auto"
                        priority
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-vl-xl font-bold text-navy mb-1">Welcome back</h1>
                    <p className="text-vl-sm text-vl-gray-3">Please enter your details to sign in.</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="w-full mb-5 p-3 rounded-sm bg-red-50 border border-red-200 text-danger text-vl-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
                    <VLInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        icon={<Mail size={16} />}
                        variant="filled"
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-vl-sm font-medium text-navy">Password <span className="text-danger">*</span></label>
                            <Link href="/forgot-password" className="text-vl-xs font-semibold text-brand hover:text-brand-hover">
                                Forgot Password?
                            </Link>
                        </div>
                        <VLInput
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            icon={<LockKeyhole size={16} />}
                            variant="filled"
                            rightAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-vl-gray-3 hover:text-ink focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            }
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-vl-gray-2 accent-brand focus:ring-brand"
                        />
                        <label htmlFor="remember-me" className="text-vl-sm text-vl-gray-3 cursor-pointer">
                            Remember me for 90 days
                        </label>
                    </div>

                    <VLButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full justify-center mt-1"
                    >
                        Sign In
                    </VLButton>
                </form>
            </div>
        </div>
    );
}
