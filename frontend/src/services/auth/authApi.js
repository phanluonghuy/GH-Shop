

const { canimApi } = require("../canim");

const authApi = canimApi.injectEndpoints({
  endpoints: (builder) => ({
    // signUp
    signUp: builder.mutation({
      query: (body) => ({
        url: "/user/sign-up",
        method: "POST",
        body,
      }),

      invalidatesTags: ["User"],
    }),

    // signIn
    signIn: builder.mutation({
      query: (body) => ({
        url: "/user/sign-in",
        method: "POST",
        body,
      }),
    }),

    // forgot password
    forgotPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/user/forgot-password",
        method: "PATCH",
        body: userInfo,
      }),
    }),
    changePasswordToken: builder.mutation({
      query: (body) => ({
        url: "/user/change-password-token",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("resetToken")}`,
        },
        body,
      }),
    }),
    // persist login
    persistLogin: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useForgotPasswordMutation,
  useChangePasswordTokenMutation,
  usePersistLoginQuery,
} = authApi;
