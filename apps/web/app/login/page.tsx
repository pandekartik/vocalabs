"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { useAuth } from "@/context/AuthContext";

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
            await login(email, password);
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 bg-[linear-gradient(180deg,#FFE0D1_0%,#DCEDFF_100%)]"
            style={{ minHeight: "812px" }}
        >
            <div className="bg-white rounded-[32px] shadow-xl w-full max-w-[480px] p-8 md:p-12 flex flex-col items-center">
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="w-full space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                                Email
                            </label>
                            <InputWithIcon
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                icon={<Mail size={20} />}
                                className="border-gray-200 bg-[#F5F6FA] text-black"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2 pl-1">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-orange-500 hover:text-orange-600">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <InputWithIcon
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    icon={<LockKeyhole size={20} />}
                                    className="border-gray-200 bg-[#F5F6FA] text-black pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Remember Me & Submit */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                Remember me for 90 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#E65A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
