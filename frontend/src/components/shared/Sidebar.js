"use client";

import React, {useState} from "react";
import Down from "../icons/Down";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useSelector} from "react-redux";
import {ChevronLeft, Home} from 'lucide-react'

const Sidebar = () => {
    const pathname = usePathname();
    const user = useSelector((state) => state.auth.user);
    const [openIndices, setOpenIndices] = useState([]);

    const toggleAccordion = (index) => {
        if (openIndices.includes(index)) {
            setOpenIndices(openIndices.filter((i) => i !== index)); // Close if already open
        } else {
            setOpenIndices([...openIndices, index]); // Open if closed
        }
    };
    let routes = [];

    if (user?.role === "buyer") {
        routes = [
            {
                name: "My Profile",
                paths: [
                    {
                        name: "View Profile",
                        path: "/dashboard/buyer/my-profile",
                    },
                    {
                        name: "View Purchases",
                        path: "/dashboard/buyer/my-purchases",
                    },
                    {
                        name: "Change Password",
                        path: "/dashboard/buyer/change-password",
                    }
                ],
            },
            {
                name: "My Cart",
                paths: [
                    {
                        name: "View Cart",
                        path: "/dashboard/buyer/my-cart",
                    },
                    {
                        name: "View Wishlist",
                        path: "/dashboard/buyer/my-wishlist",
                    },
                ],
            },
            {
                name: "My Reviews",
                paths: [
                    {
                        name: "View Reviews",
                        path: "/dashboard/buyer/my-reviews",
                    },
                ],
            },
        ];
    }

    if (user?.role === "admin") {
        routes = [
            {
                name: "Dashboard",
                paths: [
                    {
                        name: "View Dashboard",
                        path: "/dashboard/admin/dashboard",
                    },
                ],
            },
            {
                name: "My Profile",
                paths: [
                    {
                        name: "View Profile",
                        path: "/dashboard/admin/my-profile",
                    },
                ],
            },
            {
                name: "Product Manager",
                paths: [
                    {
                        name: "List Brands",
                        path: "/dashboard/admin/list-brands",
                    },
                    {
                        name: "List Categories",
                        path: "/dashboard/admin/list-categories",
                    },
                    {
                        name: "List Stores",
                        path: "/dashboard/admin/list-stores",
                    },
                    {
                        name: "List Products",
                        path: "/dashboard/admin/list-products",
                    },
                ],
            },
            {
                name: "Account Features",
                paths: [
                    {
                        name: "List Favorites",
                        path: "/dashboard/admin/list-favorites",
                    },
                    {
                        name: "List Cart",
                        path: "/dashboard/admin/list-cart",
                    },
                    {
                        name: "List Purchases",
                        path: "/dashboard/admin/list-purchases",
                    },
                ],
            },
            {
                name: "Account Manager",
                paths: [
                    {
                        name: "List Users",
                        path: "/dashboard/admin/list-users",
                    }
                ],
            },
            {
                name: "My Assets",
                paths: [
                    {
                        name: "Add brand",
                        path: "/dashboard/admin/my-brand",
                    },
                    {
                        name: "Add Category",
                        path: "/dashboard/admin/my-category",
                    },
                    {
                        name: "Add Store",
                        path: "/dashboard/admin/my-store",
                    },
                ],
            },
            {
                name: "My Products",
                paths: [
                    {
                        name: "Add Product",
                        path: "/dashboard/admin/add-product",
                    },
                    // {
                    //   name: "Update Products",
                    //   path: "/dashboard/admin/update-product",
                    // },
                ],
            },
            {
                name: "My Coupons",
                paths: [
                    {
                        name: "List Coupons",
                        path: "/dashboard/admin/list-coupons",
                    },
                    {
                        name: "Add Coupon",
                        path: "/dashboard/admin/update-coupon",
                    },
                ],
            },
        ];
    }

    return (
        <section
            className="md:col-span-3 col-span-12 overflow-hidden bg-white z-50 min-w-full max-w-lg px-2 overflow-y-auto md:block hidden">
            <div className="w-full h-full flex flex-col gap-y-4">
                {routes.map((route, index) => (
                    <div
                        key={index}
                        className="bg-slate-50/50 p-2 rounded flex flex-col"
                    >
                        <h2
                            className="flex flex-row justify-between items-center cursor-pointer"
                            onClick={() => toggleAccordion(index)}
                        >
                            {route.name}
                            {/*<Down*/}
                            {/*    className={`transition-transform ${*/}
                            {/*        openIndices.includes(index) ? "rotate-180" : ""*/}
                            {/*    }`}*/}
                            {/*/>*/}
                            <ChevronLeft
                                className={`transform transition-transform duration-200 ${openIndices.includes(index) ? '-rotate-90' : ''}`}/>

                        </h2>

                        {openIndices.includes(index) && (
                            <div className="flex flex-col gap-y-2 text-sm p-2 bg-slate-100/50 rounded">
                                {route.paths.map((path, idx) => (
                                    <Link
                                        href={path.path}
                                        key={idx}
                                        className={
                                            "p-1 rounded flex flex-row gap-x-2" +
                                            " " +
                                            (pathname === path.path
                                                ? "bg-purple-500 text-white"
                                                : "bg-slate-200/50 text-black")
                                        }
                                    >
                                        <span></span>
                                        {path.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <Link
                    href="/"
                    className="text-sm bg-slate-50/50 p-2 rounded mt-auto flex flex-row gap-x-1 items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                    Go to Home
                </Link>
            </div>
        </section>
    );
};

export default Sidebar;
