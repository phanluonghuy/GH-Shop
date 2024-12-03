"use client";

import Inform from "@/components/icons/Inform";
import View from "@/components/icons/View";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";
import {setPurchases} from "@/features/purchase/purchaseSlice";
import {
    useGetAllPurchasesQuery,
    useUpdatePurchaseStatusMutation,
} from "@/services/purchase/purchaseApi";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useMemo, useState} from "react";
import {toast} from "react-hot-toast";
import {useDispatch} from "react-redux";
import {Button, IconButton, Typography} from "@material-tailwind/react";
import {ArrowRightIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";

const Page = () => {
    const {isLoading, data, error} = useGetAllPurchasesQuery();
    const purchases = useMemo(() => data?.data || [], [data]);
    const [filter, setFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [timeRange, setTimeRange] = useState("all");
    const itemsPerPage = 10; // Adjust the number of items per page as needed
    const dispatch = useDispatch();
    const filteredPurchases = useMemo(() => {
        let filtered = purchases;

        if (filter === "pending") {
            filtered = purchases.filter((purchase) => purchase?.status === "pending");
        } else if (filter === "delivered") {
            filtered = purchases.filter((purchase) => purchase?.status === "delivered");
        }

        const now = new Date();
        if (timeRange !== "all") {
            filtered = filtered.filter((purchase) => {
                const purchaseDate = new Date(purchase.updatedAt);
                if (timeRange === "today") {
                    return purchaseDate.toDateString() === now.toDateString();
                }
                if (timeRange === "thisWeek") {
                    let d = new Date();
                    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                    const startOfWeek = new Date(d.setDate(diff));
                    console.log(startOfWeek);
                    console.log(purchaseDate);
                    return purchaseDate >= startOfWeek;
                }
                if (timeRange === "thisMonth") {
                    var date = new Date();
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    return purchaseDate >= firstDay && purchaseDate <= lastDay;
                }
                return true;
            });
        }

        // Clone and sort to avoid mutation of original array
        return [...filtered].sort((a, b) => {
            return sortOrder === "newest"
                ? new Date(b.updatedAt) - new Date(a.updatedAt)
                : new Date(a.updatedAt) - new Date(b.updatedAt);
        });
    }, [purchases, filter, sortOrder, timeRange]);


    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
    const paginatedPurchases = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPurchases.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPurchases, currentPage, itemsPerPage]);

    useEffect(() => {
        if (isLoading) {
            toast.loading("Fetching Purchases...", {id: "purchases"});
        }

        if (data) {
            toast.success(data?.description, {id: "purchases"});
        }

        if (error?.data) {
            toast.error(error?.data?.description, {id: "purchases"});
        }

        dispatch(setPurchases(purchases));
    }, [isLoading, data, error, dispatch, purchases]);

    return (
        <Dashboard>


            <section className="w-full h-full flex flex-col gap-y-6">
                <div className="flex flex-row gap-x-2">
                    <button
                        type="button"
                        className={`text-sm bg-purple-50 border border-purple-900 rounded-secondary text-purple-900 px-4 py-1 ${
                            filter === "all" && "bg-purple-900 !text-white"
                        }`}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`text-sm bg-red-50 border border-red-900 rounded-secondary text-red-900 px-4 py-1 ${
                            filter === "pending" && "bg-red-900 !text-white"
                        }`}
                        onClick={() => setFilter("pending")}
                    >
                        Pending
                    </button>
                    <button
                        type="button"
                        className={`text-sm bg-green-50 border border-green-900 rounded-secondary text-green-900 px-4 py-1 ${
                            filter === "delivered" && "bg-green-900 !text-white"
                        }`}
                        onClick={() => setFilter("delivered")}
                    >
                        Delivered
                    </button>
                    <div className="flex flex-row gap-x-2">
                        <button
                            type="button"
                            className={`text-sm bg-gray-50 border border-gray-900 rounded-secondary px-4 py-1 ${
                                sortOrder === "newest" && "bg-gray-900 !text-white"
                            }`}
                            onClick={() => setSortOrder("newest")}
                        >
                            Newest
                        </button>
                        <button
                            type="button"
                            className={`text-sm bg-gray-50 border border-gray-900 rounded-secondary px-4 py-1 ${
                                sortOrder === "oldest" && "bg-gray-900 !text-white"
                            }`}
                            onClick={() => setSortOrder("oldest")}
                        >
                            Oldest
                        </button>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center">
                        <label htmlFor="timeRange" className="text-sm text-gray-700">
                            Filter by Time:
                        </label>
                        <select
                            id="timeRange"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="text-sm bg-gray-50 border border-gray-900 rounded-secondary px-4 py-1 text-gray-900"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className=" bg-slate-100">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Customer ID
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Order ID
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Avatar
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Total Amount
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                Action
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                            >
                                <span className="sr-only">Action</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedPurchases.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-sm text-center p-4">
                                    No Purchases Found!
                                </td>
                            </tr>
                        ) : (
                            paginatedPurchases.map((purchase) => (
                                <tr
                                    key={purchase?._id}
                                    className="odd:bg-white even:bg-gray-100 hover:odd:bg-gray-100"
                                >
                                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap w-20 overflow-x-auto block scrollbar-hide text-sm">
                        {purchase?.customerId}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap w-20 overflow-x-auto block scrollbar-hide text-sm">
                        {purchase?.orderId}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Image
                                            src={purchase?.customer?.avatar?.url}
                                            alt={purchase?.customer?.avatar?.public_id}
                                            height={30}
                                            width={30}
                                            className="h-[30px] w-[30px] rounded-secondary border border-green-500/50 object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap text-sm">
                        {purchase?.customer?.name}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {purchase?.totalAmount / 100}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {new Date(purchase?.updatedAt).toLocaleDateString('en-US')}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {purchase?.status === "pending" && (
                                            <span
                                                className="bg-red-50 border border-red-900 px-2 rounded-secondary text-red-900 text-xs uppercase">
                          {purchase?.status}
                        </span>
                                        )}
                                        {purchase?.status === "delivered" && (
                                            <span
                                                className="bg-green-50 border border-green-900 px-2 rounded-secondary text-green-900 text-xs uppercase">
                          {purchase?.status}
                        </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <ModifyStatus
                                            id={purchase?._id}
                                            status={purchase?.status}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <ViewProducts products={purchase?.products}/>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-4">
                    <Button
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/> Previous
                    </Button>
                    <span className="text-sm"><Typography color="gray" className="font-normal">
                Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
                        <strong className="text-gray-900">{totalPages}</strong>
              </Typography>
                </span>
                    <Button
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
                    </Button>
                </div>
            </section>

        </Dashboard>
    );
};

function ModifyStatus({
                          id, status
                      }) {
    const [updatePurchaseStatus, {isLoading, data, error}] =
        useUpdatePurchaseStatusMutation();

    useEffect(() => {
        if (isLoading) {
            toast.loading("Updating Status...", {id: "updateStatus"});
        }
        if (data) {
            toast.success(data?.description, {id: "updateStatus"});
        }
        if (error) {
            toast.error(error?.data?.description, {id: "updateStatus"});
        }
    }, [isLoading, data, error]);

    return (
        <select
            name="status"
            id="status"
            className="text-xs uppercase"
            defaultValue={status}
            onChange={(e) =>
                updatePurchaseStatus({id: id, body: {status: e.target.value}})
            }
        >
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
        </select>
    );
}

function ViewProducts({
                          products
                      }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className="text-sm bg-cyan-50 border border-cyan-900 rounded-secondary text-cyan-900 p-1"
                onClick={() => setIsOpen(!isOpen)}
            >
                <View/>
            </button>

            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="p-6 lg:w-1/3 md:w-3/4 w-full max-h-96 overflow-y-auto scrollbar-hide"
                >
                    <div className="flex flex-col gap-y-4">
                        {products?.map(({product, quantity, _id}) => (
                            <div key={_id} className="flex flex-row gap-x-2 items-start">
                                <Image
                                    src={product?.thumbnail?.url}
                                    alt={product?.thumbnail?.public_id}
                                    height={40}
                                    width={40}
                                    className="w-[40px] h-[40px] object-cover rounded"
                                />
                                <div className="flex flex-col">
                                    <p className="text-base line-clamp-1 font-semibold">
                                        {product?.title}
                                    </p>
                                    <p className="text-sm line-clamp-2">{product?.summary}</p>
                                    <p className="text-xs mt-2">
                                        QTY: {quantity} • Price: ${product?.price} • Total Price: $
                                        {product?.price * quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Page;
