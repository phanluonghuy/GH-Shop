"use client";

import Inform from "@/components/icons/Inform";
import Pencil from "@/components/icons/Pencil";
import Trash from "@/components/icons/Trash";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";
import {setStore, setStores} from "@/features/store/storeSlice";
import {useDeleteCouponMutation, useGetCouponsQuery} from "@/services/coupon/couponApi";
import Link from "next/link";
import React, {useEffect, useMemo, useState} from "react";
import {toast} from "react-hot-toast";
import {useDispatch} from "react-redux";

const ListCoupons = () => {
    const {
        data: couponsData,
        error: couponsError,
        isLoading: couponsLoading,
    } = useGetCouponsQuery();
    const coupons = useMemo(() => couponsData?.data || [], [couponsData]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (couponsLoading) {
            toast.loading("Fetching Coupons...", {id: "couponsData"});
        }

        if (couponsData) {
            toast.success(couponsData?.description, {id: "couponsData"});
        }

        if (couponsError) {
            toast.error(couponsError?.data?.description, {id: "couponsData"});
        }

        dispatch(setStores(coupons));
    }, [couponsError, couponsData, couponsLoading, dispatch, coupons]);

    return (
        <Dashboard>
            {coupons?.length === 0 ? (
                <p className="text-sm flex flex-row gap-x-1 items-center justify-center">
                    <Inform/> No Coupons Found!
                </p>
            ) : (
                <section className="w-full h-full">
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-slate-100">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Code
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Discount Type
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Discount Value
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Start Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    End Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Usage Limit
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Active
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    Action
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {coupons.map((coupon) => (
                                <tr
                                    key={coupon?._id}
                                    className="odd:bg-white even:bg-gray-100 hover:odd:bg-gray-100"
                                >
                                    <td className="px-6 py-4">
                                        <td className="px-6 py-4">
                                                <span
                                                    className="whitespace-nowrap overflow-x-auto block scrollbar-hide text-sm">
                                                    {coupon?.code}
                                                </span>
                                        </td>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span
                                                className="whitespace-nowrap overflow-x-auto block scrollbar-hide text-sm">
                                                {coupon?.discountType}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="whitespace-nowrap scrollbar-hide text-sm">
                                                {coupon?.discountValue}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="whitespace-nowrap scrollbar-hide text-sm">
                                                {coupon?.startDate
                                                    ? new Date(coupon.startDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                    })
                                                    : "N/A"}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="whitespace-nowrap scrollbar-hide text-sm">
                                                {coupon?.endDate
                                                    ? new Date(coupon.endDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                    })
                                                    : "N/A"}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="whitespace-nowrap scrollbar-hide text-sm">
                                                {coupon?.usageLimit}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span
                                                className={`whitespace-nowrap scrollbar-hide text-sm ${coupon?.isActive ? "text-green-500" : "text-red-500"
                                                }`}
                                            >
                                                {coupon?.isActive ? "Yes" : "No"}
                                            </span>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex flex-row gap-x-2 justify-end">
                                            <DeleteCoupon coupon={coupon}/>
                                            <Link
                                                href={`/dashboard/admin/update-coupon?id=${coupon?._id}`}
                                                className="bg-green-50 border border-green-900 p-0.5 rounded-secondary text-green-900"
                                            >
                                                <Pencil/>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </Dashboard>
    );
};

function DeleteCoupon({coupon}) {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteCoupon, {isLoading, data, error}] = useDeleteCouponMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoading) {
            toast.loading("Deleting Coupon...", {id: "deleteCoupon"});
        }

        if (data) {
            toast.success(data?.description, {id: "deleteCoupon"});
        }

        if (error) {
            toast.error(error?.data?.description, {id: "deleteCoupon"});
        }
    }, [isLoading, data, error]);

    return (
        <>
            <button
                type="submit"
                className="bg-red-50 border border-red-900 p-0.5 rounded-secondary text-red-900"
                onClick={() => {
                    setIsOpen(true);
                    dispatch(setStore(coupon));
                }}
            >
                <Trash/>
            </button>

            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="p-4 lg:w-1/5"
                >
                    <article className="flex flex-col gap-y-4">
                        <p className="text-xs bg-yellow-500/50 text-black px-2 py-0.5 rounded-sm text-center">
                            Coupon will be deleted permanently!
                        </p>
                        <div className="flex flex-col gap-y-2 items-start">
                            <h1 className="text-xl">Are you sure?</h1>
                            <p className="text-sm flex flex-col gap-y-2">
                                You are DELETE Coupon:
                                <span className="flex flex-row gap-x-1 items-center text-xs">
                      <Inform/> {coupon?.code}
                    </span>
                            </p>
                        </div>
                        <div className="flex flex-row gap-x-4">
                            <button
                                className="text-white bg-slate-500 px-3 py-1.5 rounded text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                No, cancel
                            </button>
                            <button
                                className="flex flex-row gap-x-2 items-center text-white bg-red-500 px-3 py-1.5 rounded text-sm"
                                onClick={() => deleteCoupon(coupon?._id)}
                            >
                                <Trash/> Yes, delete
                            </button>
                        </div>
                    </article>
                </Modal>
            )}
        </>
    );
}

export default ListCoupons;