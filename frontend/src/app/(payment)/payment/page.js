"use client";

import Container from "@/components/shared/Container";
import Main from "@/components/shared/layouts/Main";
import Link from "next/link";
import Image from 'next/image';
import {Accordion, AccordionBody, AccordionHeader,} from "@material-tailwind/react";
import {useGetCouponCodeQuery} from "@/services/coupon/couponApi";
import {useGetShippingFeeQuery} from "@/services/shipping/shippingApi";
import React, {useEffect, useState} from "react";
import {useCreatePaymentMutation} from "@/services/payment/paymentApi";
import {toast} from "react-hot-toast";
import {useSelector} from "react-redux";

const Payment = () => {
    const {user} = useSelector((state) => state.auth);
    const [cardNumber, setCardNumber] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('success');
    const [open, setOpen] = useState(0);
    const [promoCode, setPromoCode] = useState('');
    const [point, setPoint] = useState('');
    const [code, setCode] = useState('');
    const [address, setAddress] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [phone, setPhone] = useState(user?.phone || '');
    const [name, setName] = useState(user?.name || '');
    // const [zipCode, setZipCode] = useState(user?.address[0]?.zipCode || 0);
    const [zipCode, setZipCode] = useState('');
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState({
        contactNumber: '',
        street: '',
        district: '',
        city: '',
        zipCode: ''
    });

    const handleCheckboxChange = (index) => {
        setSelectedOptionIndex(index);
        setShippingFee(shippingData.data[index].total_fee);
    };

    const [shippingData, setShippingData] = useState({code: 0, status: '', data: []});

    const [cartInfo, setCartInfo] = useState({
        length: user?.cart?.length || 0,
        total: user?.cart?.reduce((acc, {product, quantity}) => acc + product?.price * quantity, 0) || 0,
        tax: 0,
        sumary: 0,
        discount: 0,
        shippingFee: 0,
    });

    const {
        data: fetchApplyCouponData,
        isLoading: fetchingApplyCoupon,
        error: fetchApplyCouponError
    } = useGetCouponCodeQuery(code, {skip: !code});
    const {
        data: fetchShippingFeeData,
        isLoading: fetchingShippingFee,
        error: fetchShippingFeeError
    } = useGetShippingFeeQuery(zipCode, {skip: !zipCode});


    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    const calculateCartSummary = (total, tax, discount, shippingFee) => {
        return total + tax - discount + shippingFee;
    };

    const handleApplyPromoCode = () => {
        setCode(promoCode);
        if (point < 100) {
            toast.error("Your point is not enough to use, must be greater than 100", {id: "point"});
        }
        if (point > user?.loyaltyPoints ?? false) {
            toast.error("Your point is not enough to use", {id: "point"});
        }
    };

    function checkPoint(point) {
        if (point < 100) {
            return false;
        }
        return !(point > user?.loyaltyPoints ?? false);

    }

    const handleEditClick = () => {
        if (!isEditing) {
            setNewAddress(address[selectedAddressIndex]);
            setAddress([]);
        } else {
            setAddress([newAddress])
        }

        setIsEditing(!isEditing);
    }

    const handleAddressChange = (event) => {
        const selectedIndex = event.target.value;
        setSelectedAddressIndex(selectedIndex);
        setZipCode(address[selectedIndex].zipCode);
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();

        const {contactNumber, street, district, city, zipCode} = newAddress;
        if (!contactNumber || !street || !district || !city || !zipCode) {
            return toast.error('Please fill in all fields', {id: 'address'});
        }
        if (zipCode.length !== 6) {
            return toast.error('Zip code must be 6 digits', {id: 'address'});
        }
        const zipCodePattern = /^(1\d{5}|7\d{5}|55\d{4})$/;
        if (!zipCodePattern.test(zipCode)) {
            return toast.error('Zip code is invalid, only support Ha Noi, HCM, DN with start 1xxxxx,7xxxxx,55xxxxx', {id: 'address'});
        }

        setAddress([newAddress]);
        // Reset form and exit edit mode
        setNewAddress({
            contactNumber: '',
            street: '',
            district: '',
            city: '',
            zipCode: ''
        });
        setIsEditing(false);
    };

    useEffect(() => {
        setAddress(user.address);
        if (user.address.length > 0) {
            setZipCode(user.address[0].zipCode);
        }
    }, [user.address]);

    useEffect(() => {
        if (fetchingShippingFee) {
            toast.loading("Calculating Shipping Fee...", {id: "shipping"});
        }
        if (fetchingApplyCoupon) {
            toast.loading("Applying Coupon...", {id: "coupon"});
        }

        const tax = cartInfo.total * 0.1;
        let discount = 0;

        if (fetchApplyCouponData && !fetchApplyCouponError) {
            discount = cartInfo.total * fetchApplyCouponData.data.discountValue / 100;
            toast.success("Your Coupon has been applied", {id: "coupon"});
        } else if (fetchApplyCouponError) {
            toast.error("Your Coupon can't apply", {id: "coupon"});
        }

        if (fetchShippingFeeData) {
            setShippingData(fetchShippingFeeData.fee);
            toast.success("Shipping Fee Calculated", {id: "shipping"});
        }

        const newCartInfo = {
            ...cartInfo,
            tax,
            discount,
            shippingFee,
            sumary: calculateCartSummary(cartInfo.total, tax, discount, shippingFee) - point / 10,
        };

        setCartInfo(newCartInfo);
    }, [point, setSelectedAddressIndex, shippingData, shippingFee, zipCode, code, fetchingApplyCoupon, fetchApplyCouponData, fetchApplyCouponError, fetchShippingFeeData, fetchShippingFeeError]);


    return (
        <Main>
            <Container>
                <div className="bg-gray-100 min-h-screen">
                    <div className="container mx-auto px-4 py-8">
                        {/* Breadcrumb */}
                        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                            <Link href="#" className="hover:text-gray-700">Review your order</Link>
                            <span>&gt;</span>
                            <Link href="#" className="hover:text-gray-700">Delivery</Link>
                            <span>&gt;</span>
                            <span className="text-gray-700 font-medium">Payment</span>
                        </nav>

                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <h1 className="text-2xl font-semibold mb-6">Order Confirmation</h1>
                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-medium">Contact Information:</h2>
                                        <a
                                            href="/dashboard/buyer/my-profile"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Manage Address
                                        </a>
                                    </div>

                                    <div className="w-full flex flex-col gap-y-2 p-2 border rounded">
                                        {/* {address.length> 0 ? ( */}

                                        <div className="w-full flex flex-row justify-between items-center gap-x-2 p-2">
                                            <p className="text-sm">Select Address</p>
                                            <button
                                                onClick={() => handleEditClick()} // Toggle the editing mode
                                                className="text-blue-600 hover:underline"
                                            >
                                                {isEditing ? 'Save' : 'Edit'}
                                            </button>

                                        </div>


                                        {address.length > 0 ? (
                                            <select
                                                className="w-full p-2 border rounded"
                                                value={selectedAddressIndex || ''}
                                                onChange={(event) => handleAddressChange(event)}
                                            >
                                                <option value="0">Select an address</option>
                                                {address.map((addr, index) => (
                                                    <option key={index} value={index}>
                                                        {addr.contactNumber}, {addr.street}, {addr.district}, {addr.city},{' '}
                                                        {addr.zipCode}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <form onSubmit={handleAddressSubmit} className="w-full p-4 border rounded">
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Contact Number"
                                                        className="w-full p-2 border rounded"
                                                        value={newAddress?.contactNumber}
                                                        onChange={(e) =>
                                                            setNewAddress({
                                                                ...newAddress,
                                                                contactNumber: e.target.value
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Street"
                                                        className="w-full p-2 border rounded"
                                                        value={newAddress?.street}
                                                        onChange={(e) =>
                                                            setNewAddress({...newAddress, street: e.target.value})
                                                        }
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="District"
                                                        className="w-full p-2 border rounded"
                                                        value={newAddress?.district}
                                                        onChange={(e) =>
                                                            setNewAddress({...newAddress, district: e.target.value})
                                                        }
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="City"
                                                        className="w-full p-2 border rounded"
                                                        value={newAddress?.city}
                                                        onChange={(e) =>
                                                            setNewAddress({...newAddress, city: e.target.value})
                                                        }
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Zip Code"
                                                        className="w-full p-2 border rounded"
                                                        value={newAddress?.zipCode}
                                                        onChange={(e) =>
                                                            setNewAddress({...newAddress, zipCode: e.target.value})
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full px-8 py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow flex flex-row gap-x-2 items-center justify-center"
                                                >
                                                    Save Address
                                                </button>
                                            </form>
                                        )

                                        }
                                        <p className="text-sm">Select Shipping</p>
                                        <div className="shipping-options">
                                            <div className="options-list">
                                                {shippingData.data.length > 0 && selectedAddressIndex !== 0 ? (
                                                    shippingData.data.map((option, index) => (
                                                        <div key={index}
                                                             className="option-card border p-4 rounded mb-4 flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`shipping-option-${index}`}
                                                                checked={selectedOptionIndex === index}
                                                                onChange={() => handleCheckboxChange(index)}
                                                                className="mr-4"
                                                            />
                                                            <img src={option.carrier_logo} alt={option.carrier_name}
                                                                 className="h-14 w-14 mr-4"/>
                                                            <label htmlFor={`shipping-option-${index}`}>
                                                                <div className="option-details">
                                                                    <h3 className="text-md font-semibold">Carrier: {option.carrier_name}</h3>
                                                                    <p className="text-sm">Service: {option.service}</p>
                                                                    <p className="text-sm">Expected
                                                                        Time: {option.expected}</p>
                                                                    <p className="text-lg font-bold">${option.total_fee.toLocaleString()}</p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="no-options text-center p-4">
                                                        <p className="text-sm text-gray-500">Không có lựa chọn giao hàng
                                                            nào.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                {/* Payment Method */}
                                <div className="mb-6">
                                    <h2 className="font-medium mb-4">CHOOSE A PAYMENT METHOD</h2>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                                        <input type="radio" id="demo" name="payment" checked readOnly/>
                                        <label htmlFor="demo" className="flex items-center">
                                            <span>Demo</span>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-4 w-4 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                            </svg>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="font-medium mb-4">Order Summary</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            {/* <CartAccordion cartInfo={cartInfo} user={user} /> */}
                                            <Accordion open={open === 2} icon={<Icon id={2} open={open}/>}>
                                                <AccordionHeader onClick={() => handleOpen(2)}>
                                                    <span className="text-gray-600">{cartInfo.length} item(s)</span>
                                                </AccordionHeader>
                                                <AccordionBody>
                                                    <div
                                                        className="bg-white border border-gray-200 rounded-md shadow-md mt-2 w-full p-2 z-10">
                                                        {user?.cart?.length > 0 ? (
                                                            user.cart.map(({product, quantity, _id}) => (
                                                                <div
                                                                    key={_id}
                                                                    className="transition-all border border-transparent p-2 rounded hover:border-black group relative"
                                                                >
                                                                    {/* Accordion Item */}
                                                                    <div
                                                                        className="flex flex-row justify-between items-center">
                                                                        <div className="flex flex-row gap-x-2">
                                                                            <Image
                                                                                src={product?.thumbnail?.url}
                                                                                alt={product?.thumbnail?.public_id}
                                                                                width={50}
                                                                                height={50}
                                                                                className="rounded h-[50px] w-[50px] object-cover"
                                                                            />
                                                                            <article className="flex flex-col gap-y-2">
                                                                                <div
                                                                                    className="flex flex-col gap-y-0.5">
                                                                                    <h2 className="text-base line-clamp-1">
                                                                                        {product?.title || 'Unknown Product'}
                                                                                    </h2>
                                                                                    <p className="text-xs line-clamp-2">
                                                                                        {`Quantity : ${quantity}`}
                                                                                    </p>
                                                                                </div>
                                                                            </article>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-center text-gray-500">Your cart is
                                                                empty.</p>
                                                        )}
                                                    </div>
                                                </AccordionBody>
                                            </Accordion>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Becoming money</span>
                                            <span>{cartInfo.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span>{cartInfo.tax.toFixed(2)}</span>
                                        </div>
                                        {
                                            cartInfo.discount > 0 && (<div className="flex justify-between">
                                                <span className="text-gray-600">Voucher</span>
                                                <span>{cartInfo.discount}</span>
                                            </div>)
                                        }
                                        {
                                            cartInfo.shippingFee > 0 && (<div className="flex justify-between">
                                                <span className="text-gray-600">Shipping Fee</span>
                                                <span>{cartInfo?.shippingFee}</span>
                                            </div>)
                                        }
                                        {
                                            checkPoint(point) > 0 && (<div className="flex justify-between">
                                                <span className="text-gray-600">Using point</span>
                                                <span>{(Number(point) || 0) / 10}</span>
                                            </div>)
                                        }
                                        <hr className="my-2"/>
                                        <div className="flex justify-between font-medium">
                                            <div className="flex justify-center items-center font-medium gap-x-4">
                                                <span>Your point: {(user?.loyaltyPoints) ?? 0}</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Enter your point"
                                                className="flex justify-center items-center w-1/2 p-2 border rounded-md"
                                                value={point}
                                                onChange={(e) => setPoint(e.target.value)}
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Enter promo code"
                                            className="w-full p-2 border rounded-md"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <div className="flex justify-between font-medium">
                                            <span>Sum</span>
                                            <span>{cartInfo?.sumary.toFixed(2)}</span>
                                        </div>
                                        <button
                                            className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                                            onClick={handleApplyPromoCode}
                                        >
                                            Apply
                                        </button>
                                        {selectedAddressIndex !== 0 ? (
                                            <Purchase
                                                cart={user.cart}
                                                address={address[selectedAddressIndex]}
                                                phone={phone}
                                                name={name}
                                                coupon={code}
                                                point={point}
                                            />
                                        ) : (
                                            <p className="text-red-500">Please select an address to proceed with the
                                                purchase.</p>
                                        )}
                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">or</span>
                                            <Link href="/" className="block text-blue-600 hover:underline mt-2">
                                                Back to cart
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Main>
    );
};

function Icon({id, open}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
    );
}

function Purchase({cart, address, phone, name, coupon, point}) {
    const [createPayment, {isLoading, data, error}] =
        useCreatePaymentMutation();
    useEffect(() => {
        if (isLoading) {
            toast.loading("Creating payment...", {id: "createPayment"});
        }

        if (data) {
            toast.success(data?.description, {id: "createPayment"});
            window.open(data?.url, "_blank");
        }

        if (error?.data) {
            toast.error(error?.data?.description, {id: "createPayment"});
        }
    }, [isLoading, data, error]);
    if (!cart) return null;
    const result = cart.map(
        ({
             product: {title, thumbnail, price, summary, _id: pid},
             quantity,
             _id: cid,
         }) => ({
            name: title,
            quantity,
            price,
            thumbnail: thumbnail?.url,
            description: summary,
            pid,
            cid,
        })
    );


    return (
        <>
            <button
                type="button"
                className="w-full  px-8 py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow flex flex-row gap-x-2 items-center justify-center"
                onClick={() => createPayment({result, address, phone, name, coupon, point})}
            >
                Purchase
            </button>
        </>
    );
}

export default Payment;
