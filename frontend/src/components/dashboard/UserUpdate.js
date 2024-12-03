import { useUpdateUserMutation } from "@/services/user/userApi";
import React, { useEffect } from "react";
import Spinner from "../shared/Spinner";
import User from "../icons/User";

const UserUpdate = ({ user }) => {
  const [
    updateUser,
    {
      isLoading: userUpdating,
      data: updateUserResponse,
      error: updateUserResponseError,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    if (updateUserResponse) {
      alert(updateUserResponse?.description);
    }
    if (updateUserResponseError?.data) {
      alert(updateUserResponseError?.data?.description);
    }
  }, [updateUserResponse, updateUserResponseError]);

  return (
    <button
      className="bg-red-50 border border-green-900 p-0.5 rounded-secondary text-green-900"
      onClick={() =>
        updateUser({
          id: user?._id,
          body: {
            role:
              (user?.role === "buyer" && "seller") ||
              (user?.role === "seller" && "admin"),
          },
        })
      }
    >
      {(user?.role === "buyer" || user?.role === "seller") &&
        (userUpdating ? <Spinner /> : <User />)}
    </button>
  );
};

export default UserUpdate;
