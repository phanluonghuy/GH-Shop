

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

        getCouponCode: builder.query({
            query: (code) => ({
                url: `/coupon/apply-coupon/${code}`,
                method: "GET",
            }),

            // providesTags: ["Coupon","Code"],
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
    useGetCouponCodeQuery,
    useDeleteCouponMutation,
} = couponApi;
