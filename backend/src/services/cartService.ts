import Cart from "../models/cartModel";
import User from "../models/userModel";
import {Request, Response} from "express";

interface CustomRequest extends Request {
    user?: any;
}

export const cartService = {
    addToCart: async (req: CustomRequest, res: Response): Promise<void> => {
        const user: any = await User.findById(req.user._id);
        const { product, quantity } = req.body;

        const cart: any = await Cart.create({
            user: user._id,
            product: product,
            quantity: quantity,
        });

        await User.findByIdAndUpdate(user._id, {
            $push: { cart: cart._id },
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Ok",
            description: "Product added to cart successfully",
        });
    },

    getFromCart: async (res: Response): Promise<void> => {
        const cart = await Cart.find().populate(["user", "product"]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Cart fetched successfully",
            data: cart,
        });
    },

    updateCart: async (req: CustomRequest, res: Response): Promise<void> => {
        await Cart.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Cart updated successfully",
        });
    },

    deleteCart: async (req: CustomRequest, res: Response): Promise<void> => {
        const cart: any = await Cart.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(cart.user, {
            $pull: { cart: cart._id },
        });

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Cart deleted successfully",
        });
    },
}