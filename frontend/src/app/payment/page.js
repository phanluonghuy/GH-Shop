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
 * Date: 22, October 2023
 */

"use client";

import Container from "@/components/shared/Container";
import { Purchase } from "@/components/shared/header/MyCart";
import Main from "@/components/shared/layouts/Main";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Payment = () => {
    const { user } = useSelector((state) => state.auth);
    const [cardNumber, setCardNumber] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('success');
    const [promoCode, setPromoCode] = useState('');
    const cartInfo = {
        length: user?.cart?.length || 0,
        total: user?.cart?.reduce((acc, { product, quantity, _id }) => acc + product?.price * quantity, 0) || 0,
        tax: 0,
        sumary: 0,
        giam: 0
    };
    cartInfo.tax = cartInfo.total * 0.1;
    cartInfo.giam = promoCode === 'DISCOUNT' ? cartInfo.total * 0.1 : 0;
    cartInfo.sumary = cartInfo.total + cartInfo.tax -  cartInfo.giam;
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };
    return (
        <Main>
            <Container>
                <div className="bg-gray-100 min-h-screen">
                    <div className="container mx-auto px-4 py-8">
                        {/* Breadcrumb */}
                        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                            <Link href="#" className="hover:text-gray-700">Xem lại đơn hàng</Link>
                            <span>&gt;</span>
                            <Link href="#" className="hover:text-gray-700">Giao hàng</Link>
                            <span>&gt;</span>
                            <span className="text-gray-700 font-medium">Thanh toán</span>
                        </nav>

                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <h1 className="text-2xl font-semibold mb-6">Xác nhận đơn hàng</h1>

                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-medium">Thanh toán:</h2>
                                        <button className="text-blue-600 hover:underline">Chỉnh sửa</button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Hải Sơn, E0807, Quảng Trị, TP Hồ Chí Minh Việt Nam
                                    </p>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6">
                                    <h2 className="font-medium mb-4">CHỌN PHƯƠNG THỨC THANH TOÁN</h2>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                                        <input type="radio" id="demo" name="payment" checked readOnly />
                                        <label htmlFor="demo" className="flex items-center">
                                            <span>Demo</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </label>
                                    </div>
                                </div>

                                {/* Card Details */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
                                            Thông tin thanh toán (dữ liệu kiểm thử)
                                        </label>
                                        <input
                                            type="text"
                                            id="card"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            className="w-full p-2 border rounded-md"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái thanh toán
                                        </label>
                                        <select
                                            id="status"
                                            className="w-full p-2 border rounded-md"
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                        >
                                            <option value="success">Thành công</option>
                                            <option value="failed">Thất bại</option>
                                        </select>
                                    </div>
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="font-medium mb-4">Tóm tắt đơn hàng</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{cartInfo.length} mặt hàng</span>
                                            
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thành tiền</span>
                                            <span>{cartInfo.total}.00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thuế</span>
                                            <span>{cartInfo.tax}</span>
                                        </div>
                                        {
                                            cartInfo.giam > 0 && (<div className="flex justify-between">
                                                <span className="text-gray-600">Voucher</span>
                                                <span>{cartInfo.giam}</span>
                                            </div>)
                                        }
                                        <hr className="my-2" />
                                        <div className="flex justify-between font-medium">
                                            <span>Tổng</span>
                                            <span>{cartInfo.sumary}</span>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Mã giảm giá..."
                                            className="w-full p-2 border rounded-md"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300">
                                            Áp dụng
                                        </button>
                                        {/* <button
                                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
                                            onClick={handleSubmit}
                                        >
                                            Thanh toán ngay
                                        </button> */}
                                        <Purchase cart={user?.cart} />
                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">hoặc</span>
                                            <Link href="#" className="block text-blue-600 hover:underline mt-2">
                                                Quay lại giao hàng
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

export default Payment;
