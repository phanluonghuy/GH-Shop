import {Request, Response} from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import Store from '../models/storeModel';
import Brand from '../models/brandModel';
import remove from '../utils/removeUtil';
import Review from "../models/reviewModel";
import User from '../models/userModel';

export const productService = {
    addProduct: async (req: Request, res: Response): Promise<void> => {
        const {features, campaign, variations, ...otherInformation} = req.body;
        let thumbnail = null;
        let gallery = [];
        let files: any = req.files

        const parsedFeatures: any = JSON.parse(features);
        const parsedCampaign: any = JSON.parse(campaign);
        const parsedVariations: any = JSON.parse(variations);

        if (files.thumbnail.length) {
            thumbnail = {
                url: files.thumbnail[0].path,
                public_id: files.thumbnail[0].filename,
            };
        }

        if (files.gallery.length) {
            gallery = files.gallery.map((file: any) => ({
                url: file.path,
                public_id: file.filename,
            }));
        }

        const product = await Product.create({
            ...otherInformation,
            features: parsedFeatures,
            campaign: parsedCampaign,
            variations: parsedVariations,
            thumbnail,
            gallery,
            stock: {
                total: 0,
                variations: []
            },
        });

        // add product id to category, brand and store
        await Category.findByIdAndUpdate(product.category, {
            $push: {products: product._id},
        });
        await Brand.findByIdAndUpdate(product.brand, {
            $push: {products: product._id},
        });
        await Store.findByIdAndUpdate(product.store, {
            $push: {products: product._id},
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Created",
            description: "Product created successfully",
        });
    },

    getProducts: async (res: Response): Promise<void> => {
        const products: any = await Product.find().populate([
            "category",
            "brand",
            "store",
            {
                path: "reviews",
                options: {sort: {updatedAt: -1}},
                populate: [
                    "reviewer",
                    {
                        path: "product",
                        populate: ["brand", "category", "store"],
                    },
                ],
            },
            "buyers",
        ]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Products fetched successfully",
            data: products,
        });
    },

    getProduct: async (req: Request, res: Response): Promise<void> => {
        const product = await Product.findById(req.params.id).populate([
            "category",
            "brand",
            "store",
            {
                path: "reviews",
                options: {sort: {updatedAt: -1}},
                populate: [
                    "reviewer",
                    {
                        path: "product",
                        populate: ["brand", "category", "store"],
                    },
                ],
            },
        ]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Product fetched successfully",
            data: product,
        });
    },

    updateProduct: async (req: Request, res: Response): Promise<void> => {
        const product: any = await Product.findById(req.params.id);
        const updatedProduct = req.body;
        let files: any = req.files

        if (!req.body.thumbnail && req.files && files.thumbnail?.length > 0) {
            remove(product.thumbnail.public_id);

            updatedProduct.thumbnail = {
                url: files.thumbnail[0].path,
                public_id: files.thumbnail[0].filename,
            };
        }

        if (
            !(req.body.gallery?.length > 0) &&
            files &&
            files.gallery?.length > 0
        ) {
            for (let i = 0; i < product.gallery.length; i++) {
                await remove(product.gallery[i].public_id);
            }

            updatedProduct.gallery = files.gallery.map((file: any) => ({
                url: file.path,
                public_id: file.filename,
            }));
        }

        updatedProduct.features = JSON.parse(req.body.features);
        updatedProduct.campaign = JSON.parse(req.body.campaign);
        updatedProduct.variations = JSON.parse(req.body.variations);

        await Product.findByIdAndUpdate(req.params.id, {$set: updatedProduct});

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Product updated successfully",
        });
    },

    deleteProduct: async (req: Request, res: Response): Promise<void> => {
        const product: any = await Product.findByIdAndDelete(req.params.id);

        // delete product thumbnail & gallery
        if (product.thumbnail) {
            await remove(product.thumbnail.public_id);
        }

        if (product.gallery && product.gallery.length > 0) {
            for (let i = 0; i < product.gallery.length; i++) {
                await remove(product.gallery[i].public_id);
            }
        }

        // also delete from category, brand & store
        await Category.findByIdAndUpdate(product.category, {
            $pull: {products: product._id},
        });
        await Brand.findByIdAndUpdate(product.brand, {
            $pull: {products: product._id},
        });
        await Store.findByIdAndUpdate(product.store, {
            $pull: {products: product._id},
        });

        // delete this product from users products array
        await User.updateMany(
            {products: product._id},
            {$pull: {products: product._id}}
        );

        // delete reviews that belong to this product also remove those reviews from users reviews array
        await Review.deleteMany({product: product._id});
        await User.updateMany(
            {reviews: {$in: product.reviews}},
            {$pull: {reviews: {$in: product.reviews}}}
        );

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Product deleted successfully",
        });
    },

    getFilteredProducts: async (req: Request, res: Response): Promise<void> => {
        try {
            let filter: any = {};

            if (req.query.category != "null") {
                filter.category = req.query.category;
            }

            if (req.query.brand != "null") {
                filter.brand = req.query.brand;
            }

            if (req.query.store != "null") {
                filter.store = req.query.store;
            }

            const products: any = await Product.find(filter).populate([
                "category",
                "brand",
                "store",
            ]);

            res.status(200).json({
                acknowledgement: true,
                message: "Ok",
                description: "Filtered products fetched successfully",
                data: products,
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                acknowledgement: false,
                message: "Internal Server Error",
                description: "Failed to fetch filtered products",
                error: error.message,
            });
        }
    },

    /* Restock inventory */
    restockProduct: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const {variations} = req.body;

        try {
            const product: any = await Product.findById(id);
            if (!product) res.status(404).json({message: "Product not found"});

            // Update stock for the specified variations
            for (const variation of variations) {
                const stockVariant: any = product.stock.variations.find(
                    (v: any) => v.color === variation.color && v.size === variation.size
                );
                if (stockVariant) {
                    stockVariant.quantity += variation.quantity;
                } else {
                    product.stock.variations.push(variation);
                }
            }

            // Recalculate total stock
            product.stock.total = product.stock.variations.reduce((acc: number, v: any) => acc + v.quantity, 0);

            await product.save();

            res.status(200).json({
                acknowledgement: true,
                message: "Ok",
                description: "Product restocked successfully",
                data: product.stock,
            });
        } catch (error: any) {
            res.status(500).json({
                acknowledgement: false,
                message: "Internal Server Error",
                description: "Failed to restock product",
                error: error.message,
            });
        }
    },

    /* Reduce stock after sale */
    sellProduct: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const {variations} = req.body;

        try {
            const product: any = await Product.findById(id);
            if (!product) res.status(404).json({message: "Product not found"});

            // Update stock for the specified variations
            for (const variation of variations) {
                const stockVariant = product.stock.variations.find(
                    (v: any) => v.color === variation.color && v.size === variation.size
                );
                if (stockVariant) {
                    stockVariant.quantity -= variation.quantity;
                    if (stockVariant.quantity < 0) {
                        res.status(400).json({
                            acknowledgement: false,
                            message: "Insufficient stock",
                            description: `Not enough stock for color: ${variation.color}, size: ${variation.size}`,
                        });
                    }
                } else {
                    res.status(400).json({
                        acknowledgement: false,
                        message: "Variant not found",
                        description: `Variant with color: ${variation.color}, size: ${variation.size} not found`,
                    });
                }
            }

            // Recalculate total stock
            product.stock.total = product.stock.variations.reduce((acc: number, v: any) => acc + v.quantity, 0);

            await product.save();

            res.status(200).json({
                acknowledgement: true,
                message: "Ok",
                description: "Product sold successfully",
                data: product.stock,
            });
        } catch (error: any) {
            res.status(500).json({
                acknowledgement: false,
                message: "Internal Server Error",
                description: "Failed to update product stock",
                error: error.message,
            });
        }
    },

    /* Get stock details */
    getStockDetails: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;

        try {
            const product: any = await Product.findById(id);
            if (!product) res.status(404).json({message: "Product not found"});

            res.status(200).json({
                acknowledgement: true,
                message: "Ok",
                description: "Product stock details fetched successfully",
                data: product.stock,
            });
        } catch (error: any) {
            res.status(500).json({
                acknowledgement: false,
                message: "Internal Server Error",
                description: "Failed to fetch product stock details",
                error: error.message,
            });
        }
    },
}