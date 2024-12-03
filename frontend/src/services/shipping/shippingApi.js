

const { canimApi } = require("../canim");

const shippingApi = canimApi.injectEndpoints({
    endpoints: (builder) => ({

        getShippingFee: builder.query({
            query: (code) => ({
                url: `/payment/get-shipping-fee/${code}`,
                method: "GET",
            }),

            providesTags: ["Shipping","ZipCode"],
        }),
    }),
});

export const {
    useGetShippingFeeQuery
} = shippingApi;
