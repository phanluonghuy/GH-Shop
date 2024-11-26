/**
 * Title: Write a program using JavaScript on StoreApi
 * Author: Hasibul Islam
 * Portfolio: https://devhasibulislam.vercel.app
 * Linkedin: https://linkedin.com/in/devhasibulislam
 * GitHub: https://github.com/devhasibulislam
 * Facebook: https://facebook.com/devhasibulislam
 * Instagram: https://instagram.com/devhasibulislam
 * Twitter: https://twitter.com/devhasibulislam
 * Pinterest: https://pinterest.com/devhasibulislam
 * WhatsApp: https://wa.me/8801906315901
 * Telegram: devhasibulislam
 * Date: 11, November 2023
 */

const { canimApi } = require("../canim");

const couponApi = canimApi.injectEndpoints({
  endpoints: (builder) => ({
    // add new store
    addCoupon: builder.mutation({
      query: (body) => ({
        url: "/coupon/add-coupon",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Coupon", "User"],
    }),

    // get all stores
    getCoupons: builder.query({
      query: () => ({
        url: "/coupon/get-coupons",
        method: "GET",
      }),

      providesTags: ["Coupon"],
    }),

    // update store
    updateCoupon: builder.mutation({
      query: ({ id, body }) => ({
        url: `/coupon/update-coupon/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Coupon", "User"],
    }),

    // get a store
    getCoupon: builder.query({
      query: (id) => ({
        url: `/coupon/get-coupon/${id}`,
        method: "GET",
      }),

      providesTags: ["Coupon"],
    }),

    // delete store
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/delete-coupon/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      invalidatesTags: ["Coupon", "User"],
    }),
  }),
});

export const {
  useAddCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
  useGetCouponQuery,
  useDeleteCouponMutation,
} = couponApi;
