import { Request, Response} from 'express';
import Brand from "../models/brandModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import remove from "../utils/removeUtil";

interface CustomRequest extends Request {
    user?: any;
}

export const brandService = {
    addBrand: async (req: CustomRequest, res: Response): Promise<void> => {
        const { body, file } = req;

        const brand = new Brand({
            title: body.title,
            description: body.description,
            logo: {
                url: file?.path,
                public_id: file?.filename,
            },
            keynotes: JSON.parse(body.keynotes),
            tags: JSON.parse(body.tags),
            creator: "6735d601f65ae42edef791c9", // hard code for test :)))
            // creator: req.user._id,
        });

        const result = await brand.save();

        await User.findByIdAndUpdate(result.creator, {
            $set: { brand: result._id },
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Created",
            description: "Brand created successfully",
        });
    },

    getBrands: async (res: Response): Promise<void> => {
        const brands = await Brand.find().populate([
            "creator",
            {
                path: "products",
                populate: ["category", "brand", "store"],
            },
        ]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Brands fetched successfully",
            data: brands,
        });
    },

    getBrand: async (req: Request, res: Response): Promise<void> => {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            res.status(404).json({
                acknowledgement: false,
                message: "Not Found",
                description: "Brand not found",
            });
        }

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Brand fetched successfully",
            data: brand,
        });
    },

    updateBrand: async (req: CustomRequest, res: Response): Promise<void> => {
        const brand: any = await Brand.findById(req.params.id);
           let updatedBrand = req.body;

        if (!req.body.logo && req.file) {
            await remove(brand.logo.public_id);

            updatedBrand.logo = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        updatedBrand.keynotes = JSON.parse(req.body.keynotes);
        updatedBrand.tags = JSON.parse(req.body.tags);

        await Brand.findByIdAndUpdate(req.params.id, updatedBrand);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Brand updated successfully",
        });
    },

    deleteBrand: async (req: CustomRequest, res: Response): Promise<void> => {
        const brand: any = await Brand.findByIdAndDelete(req.params.id);
        await remove(brand.logo.public_id);

        await Product.updateMany({ brand: req.params.id }, { $unset: { brand: "" } });
        await User.findByIdAndUpdate(brand.creator, {
            $unset: { brand: "" },
        });

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Brand deleted successfully",
        });
    },
}