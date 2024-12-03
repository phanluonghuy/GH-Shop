"use client";

import Plus from "@/components/icons/Plus";
import Minus from "@/components/icons/Minus";
import Dashboard from "@/components/shared/layouts/Dashboard";
import {useUpdateUserMutation,} from "@/services/user/userApi";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {useSelector} from "react-redux";

const Page = () => {
    const userInfo = useSelector((state) => state.auth.user);
    const [user, setUser] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [updateUserInformation, {isLoading, data, error}] =
        useUpdateUserMutation();
    const [addresses, setAddresses] = useState([]);


    useEffect(() => {
        setUser(userInfo);
        setAddresses(userInfo.address);
        if (isLoading) {
            toast.loading("Updating user...", {id: "updateUserInformation"});
        }

        if (data) {
            toast.success(data?.description, {id: "updateUserInformation"});
        }

        if (error?.data) {
            toast.error(error?.data?.description, {id: "updateUserInformation"});
        }
    }, [userInfo, isLoading, data, error]);

    const handleAvatarPreview = (e) => {
        setAvatar(e.target.files[0]);

        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAddAddress = () => {
        setAddresses([
            ...addresses,
            {
                city: "",
                district: "",
                street: "",
                zipCode: "",
                contactNumber: "",
            },
        ]);
    };

    const handleRemoveAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const handleAddressChange = (index, field, value) => {
        const updatedAddresses = addresses.map((address, i) =>
            i === index ? {...address, [field]: value} : address
        );
        setAddresses(updatedAddresses);
    };


    function handleEditProfile(event) {
        event.preventDefault();

        const updatedUser = {
            name: event.target.name.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            role: event.target.role.value,
        };


        // Initialize FormData
        const formData = new FormData();

        // Append basic user information
        Object.entries(updatedUser).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Append avatar if available
        if (avatarPreview !== null) {
            formData.append("avatar", avatar);
        }

        // Append each address as a JSON string (server should handle parsing)
        addresses.forEach((address, index) => {
            formData.append(`addresses[${index}]`, JSON.stringify(address));
        });

        for (const address of addresses) {
            if (!/^\d{6}$/.test(address.zipCode)) {
                toast.error("Zip code must be 6 digits long.");
                return;
            }
            const zipCodePattern = /^(1\d{5}|7\d{5}|55\d{4})$/;
            if (!zipCodePattern.test(address.zipCode)) {
                return toast.error('Zip code is invalid, only support Ha Noi, HCM, DN with start 1xxxxx,7xxxxx,55xxxxx', {id: 'address'});
            }

            if (!address.city || !address.district || !address.street || !address.zipCode || !address.contactNumber) {
                toast.error("All address fields are required.");
                return;
            }
        }

        // Update user information
        updateUserInformation(formData);
    }


    return (
        <Dashboard>
            <section className="flex flex-col gap-y-4">
                <form
                    action=""
                    className="w-full flex flex-col gap-y-4"
                    onSubmit={handleEditProfile}
                >
                    {/* avatar */}
                    <div className="w-fit flex flex-col gap-y-4 p-4 border rounded">
                        <Image
                            src={avatarPreview || user?.avatar?.url}
                            alt={user?.avatar?.public_id || "avatar"}
                            width={96}
                            height={96}
                            className="w-full h-24 object-cover rounded"
                        />

                        <label
                            htmlFor="avatar"
                            className="w-full flex flex-col gap-y-1 relative"
                        >
                            <span className="text-sm cursor-pointer">Choose Avatar</span>
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer z-50"
                                accept=".jpg, .jpeg, .png"
                                multiple={false}
                                onChange={handleAvatarPreview}
                            />
                        </label>
                    </div>

                    {/* name & email */}
                    <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
                        {/* name */}
                        <label htmlFor="name" className="w-full flex flex-col gap-y-1">
                            <span className="text-sm">Name</span>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={user.name}
                                onChange={(e) => setUser({...user, name: e.target.value})}
                            />
                        </label>

                        {/* email */}
                        <label htmlFor="email" className="w-full flex flex-col gap-y-1">
                            <span className="text-sm">Email</span>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                            />
                        </label>
                    </div>

                    {/* phone, role & address */}
                    <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
                        {/* phone */}
                        <label htmlFor="phone" className="w-full flex flex-col gap-y-1">
                            <span className="text-sm">Phone</span>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={user.phone}
                                onChange={(e) => setUser({...user, phone: e.target.value})}
                            />
                        </label>
                        <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
                            <label htmlFor="addresses" className="w-full flex flex-col gap-y-4">
                                <p className="text-sm flex flex-row justify-between items-center">
                                    Addresses*
                                    <button
                                        type="button"
                                        className="p-0.5 border rounded-secondary bg-green-500 text-white"
                                        onClick={handleAddAddress}
                                    >
                                        <Plus/>
                                    </button>
                                </p>

                                {addresses?.map((address, index) => (
                                    <div key={index} className="w-full flex flex-col gap-y-2 p-2 border rounded">
                                        <p className="text-sm flex flex-row justify-between items-center">
                                            Address {index + 1}
                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    className="p-0.5 border rounded-secondary bg-red-500 text-white"
                                                    onClick={() => handleRemoveAddress(index)}
                                                >
                                                    <Minus/>
                                                </button>
                                            )}
                                        </p>

                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            className="w-full p-2 border rounded"
                                            value={address.city}
                                            onChange={(event) =>
                                                handleAddressChange(index, "city", event.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            name="district"
                                            placeholder="District"
                                            className="w-full p-2 border rounded"
                                            value={address.district}
                                            onChange={(event) =>
                                                handleAddressChange(index, "district", event.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            name="street"
                                            placeholder="Street"
                                            className="w-full p-2 border rounded"
                                            value={address.street}
                                            onChange={(event) =>
                                                handleAddressChange(index, "street", event.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="Zip Code"
                                            className="w-full p-2 border rounded"
                                            value={address.zipCode}
                                            onChange={(event) =>
                                                handleAddressChange(index, "zipCode", event.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            placeholder="Contact Number"
                                            className="w-full p-2 border rounded"
                                            value={address.contactNumber}
                                            onChange={(event) =>
                                                handleAddressChange(index, "contactNumber", event.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                            </label>
                        </div>


                        {/* role */}
                        <label htmlFor="role" className="w-full flex flex-col gap-y-1">
                            <span className="text-sm">Role</span>
                            <select
                                name="role"
                                id="role"
                                value={user.role}
                                onChange={(e) => setUser({...user, role: e.target.value})}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </label>
                    </div>

                    {/* submit button */}
                    <input
                        type="submit"
                        value="Update Profile"
                        className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer text-sm"
                    />
                </form>

                {/* <DeleteUser /> */}
            </section>
        </Dashboard>
    );
};

// function DeleteUser() {
//   const [isOpen, setIsOpen] = useState(false);
//   const user = useSelector((state) => state.auth.user);
//   const [deleteUser, { isLoading, data, error }] = useDeleteUserMutation();

//   useEffect(() => {
//     if (isLoading) {
//       toast.loading("Deleting User...", { id: "deleteUser" });
//     }

//     if (data) {
//       toast.success(data?.description, { id: "deleteUser" });
//     }

//     if (error) {
//       toast.error(error?.data?.description, { id: "deleteUser" });
//     }
//   }, [isLoading, data, error]);

//   return (
//     <>
//       <button
//         type="button"
//         className="py-2 border border-black rounded bg-red-900 hover:bg-red-900/90 text-white transition-colors drop-shadow cursor-pointer text-sm"
//         onClick={() => setIsOpen(true)}
//       >
//         Delete User
//       </button>

//       {isOpen && (
//         <Modal
//           isOpen={isOpen}
//           onClose={() => setIsOpen(false)}
//           className="p-4 lg:w-1/5"
//         >
//           <article className="flex flex-col gap-y-4">
//             <p className="text-xs bg-yellow-500/50 text-black px-2 py-0.5 rounded-sm text-center">
//               Account will be deleted permanently!
//             </p>
//             <div className="flex flex-col gap-y-2">
//               <h1 className="text-xl">Are you sure?</h1>
//               <p className="text-sm flex flex-col gap-y-2">
//                 You are about to lost following:
//                 <p className="flex flex-col gap-y-1.5">
//                   <span className="flex flex-row gap-x-1 items-center text-xs">
//                     <Inform /> {user?.cart?.length} products from cart
//                   </span>
//                   <span className="flex flex-row gap-x-1 items-center text-xs">
//                     <Inform /> {user?.favorites?.length} products from favorites
//                   </span>
//                   <span className="flex flex-row gap-x-1 items-center text-xs">
//                     <Inform /> {user?.purchases?.length} purchases records
//                   </span>
//                   <span className="flex flex-row gap-x-1 items-center text-xs">
//                     <Inform /> {user?.products?.length} products all time records
//                   </span>
//                 </p>
//               </p>
//             </div>
//             <div className="flex flex-row gap-x-4">
//               <button
//                 className="text-white bg-slate-500 px-3 py-1.5 rounded text-sm"
//                 onClick={() => setIsOpen(false)}
//               >
//                 No, cancel
//               </button>
//               <button
//                 className="flex flex-row gap-x-2 items-center text-white bg-red-500 px-3 py-1.5 rounded text-sm"
//                 onClick={() => deleteUser(user?._id)}
//               >
//                 <Trash /> Yes, delete
//               </button>
//             </div>
//           </article>
//         </Modal>
//       )}
//     </>
//   );
// }

export default Page;
