import Signup from "@/components/icons/Signup";
import Link from "next/link";
import React, {useState} from "react";
import OutsideClick from "../OutsideClick";
import User from "@/components/icons/User";
import Signin from "@/components/icons/Signin";
import ForgotPassword from "@/components/icons/ForgotPassword";
import {useSelector} from "react-redux";
import Image from "next/image";
import {CgProfile} from "react-icons/cg";

import {FiLogOut} from "react-icons/fi";

import {FaCrown, FaMedal, FaStar, FaGem, FaTrophy} from "react-icons/fa";

const getRank = (loyaltyPoints) => {
    if (loyaltyPoints >= 10000) {
        return {rank: "Diamond", icon: <FaGem className="text-blue-500"/>};
    } else if (loyaltyPoints >= 5000) {
        return {rank: "Platinum", icon: <FaCrown className="text-gray-500"/>};
    } else if (loyaltyPoints >= 2500) {
        return {rank: "Gold", icon: <FaTrophy className="text-yellow-500"/>};
    } else if (loyaltyPoints >= 1000) {
        return {rank: "Silver", icon: <FaMedal className="text-gray-400"/>};
    } else {
        return {rank: "Bronze", icon: <FaStar className="text-orange-500"/>};
    }
};

const Auth = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useSelector((state) => state.auth);
    const {rank, icon} = getRank(user.loyaltyPoints);

    return (
        <>
            <button
                className="p-2 rounded-secondary hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <User className="h-6 w-6"/>
            </button>
            {isOpen && (
                <OutsideClick
                    onOutsideClick={() => setIsOpen(false)}
                    className="absolute top-full right-0 w-80 h-fit bg-white border rounded p-2 flex flex-col gap-y-2.5"
                >
                    {Object.keys(user).length === 0 || user.role === "guest" ? (
                        <>
                            <Link
                                href="/auth/signup"
                                className="w-full flex flex-row items-start gap-x-2 p-2 border border-transparent hover:border-black rounded"
                            >
                <span className="bg-sky-500/5 p-1 rounded">
                  <Signup/>
                </span>
                                <article className="whitespace-normal">
                                    <h2 className="text-sm">Sign Up</h2>
                                    <p className="text-xs">Register as a new user</p>
                                </article>
                            </Link>
                            <Link
                                href="/auth/signin"
                                className="w-full flex flex-row items-start gap-x-2 p-2 border border-transparent hover:border-black rounded"
                            >
                <span className="bg-sky-500/5 p-1 rounded">
                  <Signin/>
                </span>
                                <article className="whitespace-normal">
                                    <h2 className="text-sm">Sign In</h2>
                                    <p className="text-xs">Login as an existing user</p>
                                </article>
                            </Link>
                            <Link
                                href="/auth/forgot-password"
                                className="w-full flex flex-row items-start gap-x-2 p-2 border border-transparent hover:border-black rounded"
                            >
                <span className="bg-sky-500/5 p-1 rounded">
                  <ForgotPassword/>
                </span>
                                <article className="whitespace-normal">
                                    <h2 className="text-sm">Forgot Password</h2>
                                    <p className="text-xs">Reset your account credentials</p>
                                </article>
                            </Link>
                        </>
                    ) : (
                        <Link href={user?.role === "admin" ? "/dashboard" : "/dashboard/buyer/my-profile"}
                              className="flex flex-col gap-y-2">
                            <div className="flex flex-row gap-x-2 p-4">
                                <Image
                                    src={user?.avatar?.url}
                                    alt={user?.avatar?.public_id}
                                    height={50}
                                    width={50}
                                    className="rounded object-cover h-[50px] w-[50px]"
                                />
                                <article className="flex flex-col">
                                    <h2 className="line-clamp-1">{user?.name}</h2>
                                    <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                        {user?.email}
                                    </p>
                                    <p className="flex flex-row gap-x-2 mt-1.5">
                    <span
                        className="px-2 border border-purple-900 text-purple-900 bg-purple-50 rounded-primary text-xs w-fit">
                      {user?.role}
                    </span>
                                        <span className="flex items-center gap-x-1 text-xs">
                            {icon} {rank} {user?.loyaltyPoints}
                     </span>
                                        {user?.status === "inactive" && (
                                            <span
                                                className="bg-red-50 border border-red-900 px-2 rounded-secondary text-red-900 text-xs lowercase w-fit">
                        in review
                      </span>
                                        )}
                                    </p>
                                </article>
                            </div>
                            <hr/>
                            <div
                                className="w-full flex flex-row items-center gap-x-2 p-2 border border-transparent hover:border-black rounded cursor-pointer">
                <span className="bg-transparent p-1 rounded">
                <CgProfile className="h-8 w-8"/>
                </span>
                                <article
                                    className="whitespace-nowrap"
                                    onClick={() => {
                                        user?.role === "admin"
                                            ? window.open("/dashboard/admin/dashboard", "_self")
                                            : window.open("/dashboard/buyer/my-profile", "_self");
                                    }}
                                >
                                    <h2 className="text-sm">Profile</h2>
                                    <p className="text-xs">Management your profile</p>
                                </article>
                            </div>
                            <div
                                className="w-full flex flex-row items-center gap-x-2 p-2 border border-transparent hover:border-black rounded cursor-pointer">
                <span className="bg-transparent p-1 rounded">
                <FiLogOut className="h-8 w-8"/>
                </span>
                                <article
                                    className="whitespace-nowrap"
                                    onClick={() => {
                                        localStorage.removeItem("accessToken");
                                        // window.open("/", "_self");
                                        window.location.href = '/';
                                    }}
                                >
                                    <h2 className="text-sm">Logout</h2>
                                    <p className="text-xs">Clear your current activities</p>
                                </article>
                            </div>
                        </Link>
                    )}
                </OutsideClick>
            )}
        </>
    );
};

export default Auth;
