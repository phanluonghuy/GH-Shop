import {Request, Response} from 'express';
import Review from "../models/reviewModel";
import Product from "../models/productModel";
import User from "../models/userModel";

interface CustomRequest extends Request {
    user?: any;
}

export const reviewService = {
    addReview: async (req: CustomRequest, res: Response): Promise<void> => {
        const user: any = await User.findById(req.user._id);
        const {product, rating, comment} = req.body;

        const productExists = await Product.exists({
            _id: product,
            buyers: user._id,
        });

        if (!productExists) {
            const review = await Review.create({
                reviewer: user._id,
                product: product,
                rating: 1,
                comment: comment,
            });

            await Product.findByIdAndUpdate(product, {
                $push: {reviews: review._id},
            });

            await User.findByIdAndUpdate(user._id, {
                $push: {reviews: review._id},
            });
        } else {
            const review = await Review.create({
                reviewer: user._id,
                product: product,
                rating: rating,
                comment: comment,
            });

            await Product.findByIdAndUpdate(product, {
                $push: {reviews: review._id},
            });

            await User.findByIdAndUpdate(user._id, {
                $push: {reviews: review._id},
            });
        }

        res.status(201).json({
            acknowledgement: true,
            message: "Ok",
            description: "Review added successfully",
        });
    },

    getReviews: async (res: Response): Promise<void> => {
        const reviews = await Review.find().sort({updatedAt: 1});

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Review fetched successfully",
            data: reviews,
        });
    },

    updateReview: async (req: CustomRequest, res: Response): Promise<void> => {
        await Review.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Review updated successfully",
        });
    },

    deleteReview: async (req: CustomRequest, res: Response): Promise<void> => {
        const review: any = await Review.findByIdAndDelete(req.params.id);

        await Product.findByIdAndUpdate(review.product, {
            $pull: {reviews: review._id},
        });

        await User.findByIdAndUpdate(review.reviewer, {
            $pull: {reviews: review._id},
        });

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Review deleted successfully",
        });
    },
}