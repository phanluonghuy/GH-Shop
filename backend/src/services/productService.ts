import { Request, Response} from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import Store from '../models/storeModel';
import Brand from '../models/brandModel';
import remove from '../utils/removeUtil';
import Review from '../models/reviewModel';
import User from '../models/userModel';

export const productService = {
    addProduct: async (req: Request, res: Response): Promise<void> => {
        const { features, campaign, variations, ...otherInformation } = req.body;
        let thumbnail = null;
        let gallery = [];
        let files: any = req.files

        const parsedFeatures = JSON.parse(features);
        const parsedCampaign = JSON.parse(campaign);
        const parsedVariations = JSON.parse(variations);

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
        });

        // add product id to category, brand and store
        await Category.findByIdAndUpdate(product.category, {
            $push: { products: product._id },
        });
        await Brand.findByIdAndUpdate(product.brand, {
            $push: { products: product._id },
        });
        await Store.findByIdAndUpdate(product.store, {
            $push: { products: product._id },
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Created",
            description: "Product created successfully",
        });
    }
}