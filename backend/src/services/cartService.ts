import Cart from "../models/cartModel";
import User from "../models/userModel";
import e, {Request, Response} from "express";
import token, { verifyandget_id } from "../utils/tokenUtil";
import { access } from "fs";

interface CustomRequest extends Request {
    user?: any;
}

export const cartService = {
    addToCart: async (req: CustomRequest, res: Response): Promise<void> => {
        let _id = null;
        try {
         _id = verifyandget_id(req.headers.authorization?.split(" ")[1] as string);
        } catch (error) {
        }
        let user: any = null;
        let tokenGuest = null;
        console.log("id", _id);
        if (!_id) {
            const id = "" + Math.floor(Math.random() * 100000000);
            user = await User.create(
                {
                    name: `Guest${id}`,
                    email: "Guest" + id +"@gmail.com",
                    password: "Guest@123123",
                    role: "guest",
                }
            );
            tokenGuest = token({
                _id : user._id,
                role : user.role,
                name : user.name,
                email : user.email,
                status : user.status
            });
        } else {
            user = await User.findById(_id);
        }
       
        const { product, quantity } = req.body;

        // console.log("token", tokenGuest);

        // console.log("product", product);
        // console.log("quantity", quantity);

        const cart: any = await Cart.create({
            user: user._id,
            product: product,
            quantity: quantity,
        });

        await User.findByIdAndUpdate(user._id, {
            $push: { cart: cart._id },
        });
        if (tokenGuest) {
            res.status(201).json({
                acknowledgement: true,
                message: "Ok",
                description: "Product added to cart successfully",
                accessToken: tokenGuest,
            });
     
        } else {
            res.status(201).json({
                acknowledgement: true,
                message: "Ok",
                description: "Product added to cart successfully"
            });
        }
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