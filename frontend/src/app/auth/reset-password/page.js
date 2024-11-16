"use client";

import Spinner from "@/components/shared/Spinner";
import { useChangePasswordTokenMutation } from "@/services/auth/authApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("resetToken");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePasswordToken, { isLoading, data, error }] = useChangePasswordTokenMutation();

    useEffect(() => {
        if (isLoading) {
            toast.loading("Resetting password...", { id: "forgot-password" });
        }

        if (data) {
            toast.success(data?.description, { id: "forgot-password" });
            setTimeout(() => {
                window.open("/auth/signin", "_self");
            }, 1000);
        }
        if (token) {
            localStorage.setItem('resetToken', token);
        }
        if (error?.data) {
            toast.error(error?.data?.description, { id: "forgot-password" });
        }
    }, [data, error, isLoading,token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        // Password validation regex
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/;
        if (!password.match(passwordRegex)) {
            toast.error(
                "Password must have at least 1 uppercase, 1 lowercase, 1 symbol, and 1 number. Password length should be between 8 and 20 characters."
            );
            return;
        }
        if (!confirmPassword.match(passwordRegex)) {
            toast.error(
                "Confirm password must have at least 1 uppercase, 1 lowercase, 1 symbol, and 1 number. Password length should be between 8 and 20 characters."
            );
            return;
        }


        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!token) {
            toast.error("Link is invalid");
            return;
        }

        changePasswordToken({ password });

        // try {
        //     const response = await axios.patch('/api/user/reset-password-token',
        //         { password },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${token}`
        //             }
        //         }
        //     );
        //     toast.success("Password reset successful");
        //     router.push("/auth/signin");
        // } catch (error) {
        //     toast.error(error.response?.data?.description || "Error resetting password");
        // }
    };

    return (
        <section className="w-screen h-screen flex justify-center items-center px-4">
            <div className="max-w-md w-full flex flex-col gap-y-4 border p-8 rounded-primary">
                <div className="flex flex-row items-center gap-x-2">
                    <hr className="w-full" />
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={141}
                        height={40}
                        className="max-w-full cursor-pointer"
                        onClick={() => router.push("/")}
                    />
                    <hr className="w-full" />
                </div>
                <form
                    className="w-full flex flex-col gap-y-4"
                    onSubmit={handleResetPassword}
                >
                    <label htmlFor="password" className="flex flex-col gap-y-1">
                        <span className="text-sm">Enter New Password</span>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="i.e. Admin@123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label htmlFor="confirmPassword" className="flex flex-col gap-y-1">
                        <span className="text-sm">Confirm New Password</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="i.e. Admin@123"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black/50 disabled:cursor-not-allowed flex flex-row justify-center items-center text-sm"
                    >
                        {isLoading ? <Spinner /> : "Reset Password"}
                    </button>
                </form>
                <div className="flex flex-row justify-center items-center gap-x-2 text-xs">
                    <Link href="/auth/signin">Sign In</Link>
                    <span className="h-4 border-l" />
                    <Link href="/auth/signup">Sign Up</Link>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
