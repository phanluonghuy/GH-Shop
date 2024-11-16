/**
 * Title: Write a program using JavaScript on Page
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
 * Date: 14, January 2024
 */

"use client";

import Inform from "@/components/icons/Inform";
import Trash from "@/components/icons/Trash";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";
import {

    useUpdatePasswordMutation,
} from "@/services/user/userApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const userInfo = useSelector((state) => state.auth.user);
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updatePasswordInformation, { isLoading, data, error }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    setUser(userInfo);

    if (isLoading) {
      toast.loading("Updating user...", { id: "updateUserInformation" });
    }

    if (data) {
      toast.success(data?.description, { id: "updateUserInformation" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "updateUserInformation" });
    }
  }, [userInfo, isLoading, data, error]);


  function handleUpdatePassword(event) {
    event.preventDefault();

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/;

    if (!user.currentPassword.match(passwordRegex)) {
      toast.error(
        "Password must have at least 1 uppercase, 1 lowercase, 1 symbol, and 1 number. Password length should be between 8 and 20 characters."
      );
      return;
    }

    if (!user.newPassword.match(passwordRegex)) {
        toast.error(
            "New password must have at least 1 uppercase, 1 lowercase, 1 symbol, and 1 number. Password length should be between 8 and 20 characters."
          );
          return;
    }

    if (newPassword.value !== confirmPassword.value) {
        toast.error(
            "Password and confirm password must be same."
          );
          return;
  
    }

    const updatedUser = {
        currentPassword: user.currentPassword,
        newPassword: user.newPassword,
        confirmPassword: user.confirmPassword,
    };
    user.currentPassword = "";
    user.newPassword = "";
    user.confirmPassword = "";
    updatePasswordInformation(updatedUser);
  }

  return (
    <Dashboard>
      <section className="flex flex-col gap-y-4">
        <form
          action=""
          className="w-full flex flex-col gap-y-4"
          onSubmit={handleUpdatePassword}
        >
          {/* avatar */}
          <div className="w-fit flex items-center gap-y-4 p-4 justify-center border rounded">
            <Image
              src={avatarPreview || user?.avatar?.url}
              alt={user?.avatar?.public_id || "avatar"}
              width={96}
              height={96}
              className="h-full h-24 object-cover rounded"
            />
            <div className="flex flex-col gap-y-4 p-4">{user?.name}</div>
          </div>

          {/* current password, new password & confirm password */}
          <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
            {/* current password */}
            <label
              htmlFor="currentPassword"
              className="w-full flex flex-col gap-y-1"
            >
              <span className="text-sm">Current Password</span>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={user.currentPassword}
                onChange={(e) =>
                  setUser({ ...user, currentPassword: e.target.value })
                }
              />
            </label>

            {/* new password */}
            <label
              htmlFor="newPassword"
              className="w-full flex flex-col gap-y-1"
            >
              <span className="text-sm">New Password</span>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={user.newPassword}
                onChange={(e) =>
                  setUser({ ...user, newPassword: e.target.value })
                }
              />
            </label>

            {/* confirm password */}
            <label
              htmlFor="confirmPassword"
              className="w-full flex flex-col gap-y-1"
            >
              <span className="text-sm">Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
              />
            </label>
          </div>

          {/* submit button */}
          <input
            type="submit"
            value="Change Password"
            className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer text-sm"
          />
        </form>
      </section>
    </Dashboard>
  );
};

export default Page;
