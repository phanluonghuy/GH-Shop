
const { canimApi } = require("../canim");

const paymentApi = canimApi.injectEndpoints({
  endpoints: (build) => ({
    // create payment
    createPayment: build.mutation({
      query: ({ result, address, phone, name, coupon }) => ({
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
          coupon
        }
      }),
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentApi;
