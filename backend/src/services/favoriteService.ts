import {Request, Response} from 'express';
import Favorite from "../models/favoriteModel";
import User from "../models/userModel";

interface CustomRequest extends Request {
    user?: any;
}

export const favoriteService = {
    addToFavorite: async (req: CustomRequest, res: Response): Promise<void> => {
        const user: any = await User.findById(req.user._id);
        const {product} = req.body;

        const favorite = await Favorite.create({
            user: user._id,
            product: product,
        });

        await User.findByIdAndUpdate(user._id, {
            $push: {favorites: favorite._id},
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Ok",
            description: "Product added to favorite successfully",
        });
    },

    getFavorites: async (res: Response): Promise<void> => {
        const favorites = await Favorite.find().populate(["product", "user"]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Favorite retrieved successfully",
            data: favorites,
        });
    },

    deleteFromFavorite: async (req: CustomRequest, res: Response): Promise<void> => {
        const favorite: any = await Favorite.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(favorite.user, {
            $pull: {favorites: favorite._id},
        });

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Product deleted from favorite successfully",
        });
    }
}