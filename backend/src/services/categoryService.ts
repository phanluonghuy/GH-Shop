import {Request, Response} from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import User from "../models/userModel";
import remove from "../utils/removeUtil";

interface CustomRequest extends Request {
    user?: any;
}

export const categoryService = {
    addCategory: async (req: CustomRequest, res: Response): Promise<void> => {
        const { body, file } = req;

        const category = new Category({
            title: body.title,
            description: body.description,
            thumbnail: {
                url: file?.path,
                public_id: file?.filename,
            },
            keynotes: JSON.parse(body.keynotes),
            tags: JSON.parse(body.tags),
            creator: req.user._id,
        });

        const result = await category.save();

        await User.findByIdAndUpdate(result.creator, {
            $set: {
                category: result._id,
            },
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Created",
            description: "Category created successfully",
        });
    },

    getCategories: async ( res: Response): Promise<void> => {
        const categories = await Category.find().populate([
            "creator",
            {
                path: "products",
                populate: ["category", "brand", "store"],
            },
        ]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Categories fetched successfully",
            data: categories,
        });
    },

    getCategory: async (req: CustomRequest, res: Response): Promise<void> => {
        const category = await Category.findById(req.params.id);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Category fetched successfully",
            data: category,
        });
    },

    updateCategory: async (req: CustomRequest, res: Response): Promise<void> => {
        const category: any = await Category.findById(req.params.id);
        let updatedCategory = req.body;

        if (!req.body.thumbnail && req.file) {
            await remove(category.thumbnail.public_id);

            updatedCategory.thumbnail = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        updatedCategory.keynotes = JSON.parse(req.body.keynotes);
        updatedCategory.tags = JSON.parse(req.body.tags);

        await Category.findByIdAndUpdate(req.params.id, updatedCategory);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Category updated successfully",
        });
    },

    deleteCategory: async (req: CustomRequest, res: Response): Promise<void> => {
        const category: any = await Category.findByIdAndDelete(req.params.id);
        await remove(category.thumbnail.public_id);

        await Product.updateMany(
            { category: req.params.id },
            { $unset: { category: "" } }
        );
        await User.findByIdAndUpdate(category.creator, {
            $unset: { category: "" },
        });

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Category deleted successfully",
        });
    },
}