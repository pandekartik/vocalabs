"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { INTELICONVOAPI } from "@/lib/axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        try {
            await INTELICONVOAPI.post("/auth/forgot-password", { email });
            setSubmitted(true);
        } catch (err: any) {
            // Always show success message for security (don't reveal if email exists)
            // The backend already handles this, but just in case
            setSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 bg-[linear-gradient(180deg,#FFE0D1_0%,#DCEDFF_100%)]"
            style={{
                minHeight: "812px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="flex flex-col items-center w-full max-w-[480px]">
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

                {/* Card */}
                <div className="bg-white rounded-[32px] shadow-xl w-full p-8 md:p-12 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    {submitted ? (
                        <div className="text-center mt-4">
                            <p className="text-gray-600 text-sm mb-6">
                                If an account exists for <span className="font-semibold text-gray-900">{email}</span>, we&apos;ve sent a password reset link to your email.
                            </p>
                            <Link href="/" className="text-sm font-semibold text-[#FF6B00] hover:text-[#E65A00]">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-500 text-sm text-center mb-8">
                                Enter your email address. If it&apos;s in our system, we&apos;ll send you a link to reset your password.
                            </p>

                            <form className="w-full space-y-6" onSubmit={handleSubmit}>
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

                                {errorMsg && (
                                    <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#E65A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "Sending..." : "Reset Password"}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
