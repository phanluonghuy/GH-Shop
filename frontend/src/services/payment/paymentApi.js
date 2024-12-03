const {canimApi} = require("../canim");

const paymentApi = canimApi.injectEndpoints({
    endpoints: (build) => ({
        // create payment
        createPayment: build.mutation({
            query: ({result, address, phone, name, coupon, point}) => ({
                url: "/payment/create-payment",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: {
                    result,
                    address,
                    phone,
                    name,
                    coupon,
                    point
                }
            }),
        }),
    }),
});

export const {useCreatePaymentMutation} = paymentApi;
