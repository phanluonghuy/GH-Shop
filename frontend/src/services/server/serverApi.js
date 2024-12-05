const {canimApi} = require("../canim");

const serverApi = canimApi.injectEndpoints({
    endpoints: (builder) => ({

        getServer: builder.query({
            query: () => ({
                url: `/test`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetServerQuery
} = serverApi;
