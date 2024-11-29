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
