"use client";

import Inform from "@/components/icons/Inform";
import Trash from "@/components/icons/Trash";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";
import Minus from "@/components/icons/Minus";
import Plus from "@/components/icons/Plus";
import {
  useGetBrandQuery,
  useUpdateBrandMutation,
} from "@/services/brand/brandApi";
import { useUpdateCouponMutation, useAddCouponMutation, useGetCouponQuery } from "@/services/coupon/couponApi";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

const Page = () => {
  // Get query parameter (id) for editing an existing coupon
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [updateCoupon] = useUpdateCouponMutation();
  const [addCoupon, { isLoading, data, error }] = useAddCouponMutation();
  const { data: fetchCouponData, isLoading: fetchingCoupon,error:fetchCouponError } = useGetCouponQuery(id,{skip: !id});
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Adding coupon...", { id: "coupon" });
    }

    if (data) {
      toast.success(data?.description, { id: "coupon" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "coupon" });
    }
  }, [isLoading, data, error, router]);

  // Initialize state for the form (edit mode or add mode)
  const [coupon, setCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    usageLimit: 0,
    isActive: true,
  });

  // Set initial state if editing a coupon
  useEffect(() => {
    if (fetchCouponData) {
      setCoupon({
        code: fetchCouponData.data.code,
        discountType: fetchCouponData.data.discountType,
        discountValue: fetchCouponData.data.discountValue,
        startDate: new Date(fetchCouponData.data.startDate).toISOString().split("T")[0],
        endDate: new Date(fetchCouponData.data.endDate).toISOString().split("T")[0],
        usageLimit: fetchCouponData.data.usageLimit,
        isActive: fetchCouponData.data.isActive,
      });
    }
    if (fetchingCoupon) {
      toast.loading("Fetching Brand...", { id: "fetchCoupon" });
    }

    if (fetchCouponData) {
      toast.success(fetchCouponData?.description, { id: "fetchCoupon" });
    }

    if (fetchCouponError?.data) {
      toast.error(fetchCouponError?.data?.description, { id: "fetchCoupon" });
    }
  }, [fetchCouponData,fetchingCoupon,fetchCouponError]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCoupon({
      ...coupon,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const couponData = {
      code: event.target.code.value,
      discountType: event.target.discountType.value,
      discountValue: event.target.discountValue.value,
      startDate: event.target.startDate.value,
      endDate: event.target.endDate.value,
      usageLimit: event.target.usageLimit.value,
      isActive: event.target.isActive.checked,
    };

    // Validation logic
    if (!couponData.code) {
      toast.error("Code is required.");
      return;
    }

    if (couponData.discountValue <= 0) {
      toast.error("Discount value must be greater than 0.");
      return;
    }

    if (!couponData.startDate || !couponData.endDate) {
      toast.error("Both start and end dates are required.");
      return;
    } else if (new Date(couponData.startDate) >= new Date(couponData.endDate)) {
      toast.error("End date must be after start date.");
      return;
    }

    if (couponData.usageLimit <= 0) {
      toast.error("Usage limit must be greater than 0.");
      return;
    }

    // If id exists, update the coupon
    if (id) {
      updateCoupon({ id, body: couponData });
    } else {
      // Otherwise, add a new coupon
      addCoupon(couponData);
    }

    // Reset form after submission
    setCoupon({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      usageLimit: 0,
      isActive: true,
    });

    event.target.reset();
  };

  return (
    <Dashboard>
      <section className="flex flex-col gap-y-4">
        <form
          className="w-full flex flex-col gap-y-4"
          onSubmit={handleSubmit}
        >
          {/* title & description */}
          <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
            {/* Code */}
            <label className="w-full flex flex-col gap-y-1">
              <span className="text-sm">Code*</span>
              <input
                type="text"
                name="code"
                value={coupon.code}
                onChange={handleInputChange}
                maxLength="100"
                required
                className="border rounded px-3 py-2"
              />
            </label>

            {/* Discount Type */}
            <label className="w-full flex flex-col gap-y-1">
              <span className="text-sm">Discount Type*</span>
              <select
                name="discountType"
                value={coupon.discountType}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </label>

            {/* Discount Value */}
            <label className="w-full flex flex-col gap-y-1">
              <span className="text-sm">Discount Value*</span>
              <input
                type="number"
                name="discountValue"
                value={coupon.discountValue}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2"
                min="0"
              />
            </label>

            {/* Start Date */}
            <label className="w-full flex flex-col gap-y-1">
              <span className="text-sm">Start Date*</span>
              <input
                type="date"
                name="startDate"
                value={coupon.startDate}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2"
              />
            </label>

            {/* End Date */}
            <label className="w-full flex flex-col gap-y-1">
              <span className="text-sm">End Date*</span>
              <input
                type="date"
                name="endDate"
                value={coupon.endDate}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2"
              />
            </label>

            {/* Usage Limit */}
            <label className="w-full flex flex-col gap-y-1">
              <span className="text-sm">Usage Limit*</span>
              <input
                type="number"
                name="usageLimit"
                value={coupon.usageLimit}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2"
                min="1"
              />
            </label>

            {/* Is Active */}
            <label className="w-full flex items-center gap-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={coupon.isActive}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <span className="text-sm">Is Active</span>
            </label>
          </div>

          {/* Submit button */}
          <input
            type="submit"
            value={id ? "Update Coupon" : "Add Coupon"}
            className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer text-sm"
          />
        </form>
      </section>
    </Dashboard>
  );
};

export default Page;