const { canimApi } = require("../canim");

const dashboardApi = canimApi.injectEndpoints({
    endpoints: (builder) => ({
        // get total purchases
        getTotalPurchase: builder.query({
            query: () => ({
                url: "/dashboard/get-total-purchases",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),

            providesTags: ["Dashboard","Purchases"],
        }),
        getRevenue: builder.query({
            query: (period) => ({
                url: `/dashboard/get-revenue/${period}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),

            providesTags: ["Dashboard","Period"],
        }),

    }),
});

export const {
    useGetTotalPurchaseQuery,
    useGetRevenueQuery,
} = dashboardApi;
