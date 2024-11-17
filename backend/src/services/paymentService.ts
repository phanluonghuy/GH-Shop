import { Request, Response } from "express";
import Cart from "../models/cartModel";
import Product from "../models/productModel";
import Purchase from "../models/purchaseModel";
import User from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface CustomRequest extends Request {
    user?: any;
}

export const createPayment = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const lineItems: any = req.body.map((item: {
            name: string;
            thumbnail: string;
            description: string;
            pid: string;
            price: number;
            quantity: number;
        }) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: [item.thumbnail],
                        description: item.description,
                        metadata: {
                            id: item.pid,
                        },
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.ORIGIN_URL}`,
            cancel_url: `${process.env.ORIGIN_URL}`,
        });

        // Create purchase for user
        const purchase: any = await Purchase.create({
            // customer: req.user?._id,
            customer: "67398eece3530db4bb181b64", // hard code for test :)))
            customerId: session.id,
            orderId: session.id,
            totalAmount: session.amount_total,
            products: req.body.map((item: { pid: string; quantity: number }) => ({
                product: item.pid,
                quantity: item.quantity,
            })),
        });

        // Update user's purchases, products, and empty cart
        // await User.findByIdAndUpdate(req.user?._id, {
        //     $push: { purchases: purchase._id },
        //     $set: { cart: [] },
        // });
        await User.findByIdAndUpdate("67398eece3530db4bb181b64", {  // hard code for test :)))
            $push: { purchases: purchase._id },
            $set: { cart: [] },
        });

        // Add product IDs to user's products array
        // req.body.forEach(async (item: { pid: string }) => {
        //     await User.findByIdAndUpdate(req.user?._id, {
        //         $push: { products: item.pid },
        //     });
        // });

        req.body.forEach(async (item: { pid: string }) => {
            await User.findByIdAndUpdate("67398eece3530db4bb181b64", {  // hard code for test :)))
                $push: { products: item.pid },
            });
        });

        // Remove carts that match cart IDs
        req.body.forEach(async (cart: { cid: string }) => {
            await Cart.findByIdAndDelete(cart.cid);
        });

        // Add user to products' buyers array
        // req.body.forEach(async (product: { pid: string }) => {
        //     await Product.findByIdAndUpdate(product.pid, {
        //         $push: { buyers: req.user?._id },
        //     });
        // });

        req.body.forEach(async (product: { pid: string }) => {
            await Product.findByIdAndUpdate(product.pid, {
                $push: { buyers: "67398eece3530db4bb181b64" },  // hard code for test :)))
            });
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Ok",
            description: "Payment created successfully",
            url: session.url,
        });
    } catch (error: any) {
        res.status(500).json({
            acknowledgement: false,
            message: "Internal Server Error",
            description: "Failed to create payment",
            error: error.message,
        });
    }
};
