import {Request, Response} from "express";
import Product from "../models/productModel";
import Store from "../models/storeModel";
import User from "../models/userModel";
import remove from "../utils/removeUtil";


interface CustomRequest extends Request {
    user?: any;
}

export const storeService = {
    addStore: async (req: CustomRequest, res: Response): Promise<void> => {
        const {body, file} = req;

        const store = new Store({
            title: body.title,
            description: body.description,
            thumbnail: {
                url: file?.path,
                public_id: file?.filename,
            },
            keynotes: JSON.parse(body.keynotes),
            tags: JSON.parse(body.tags),
            owner: req.user._id,
        });

        const result = await store.save();

        await User.findByIdAndUpdate(result.owner, {
            $set: {store: result._id},
        });

        res.status(201).json({
            acknowledgement: true,
            message: "Created",
            description: "Store created successfully",
        });
    },

    getStores: async (res: Response): Promise<void> => {
        const stores = await Store.find().populate([
            "owner",
            {
                path: "products",
                populate: ["category", "brand", "store"],
            },
        ]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Stores fetched successfully",
            data: stores,
        });
    },

    getStore: async (req: CustomRequest, res: Response): Promise<void> => {
        const store = await Store.findById(req.params.id);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Store fetched successfully",
            data: store,
        });
    },

    updateStore: async (req: CustomRequest, res: Response): Promise<void> => {
        const store: any = await Store.findByIdAndUpdate(req.params.id, req.body);
        const updatedStore = req.body;

        if (!req.body.thumbnail && req.file) {
            await remove(store.thumbnail.public_id);

            updatedStore.thumbnail = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        updatedStore.keynotes = JSON.parse(req.body.keynotes);
        updatedStore.tags = JSON.parse(req.body.tags);

        await Store.findByIdAndUpdate(req.params.id, updatedStore);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Store updated successfully",
        });
    },

    deleteStore: async (req: CustomRequest, res: Response): Promise<void> => {
        const store: any = await Store.findByIdAndDelete(req.params.id);
        await remove(store.thumbnail.public_id);

        await Product.updateMany({store: req.params.id}, {$unset: {store: ""}});
        await User.findByIdAndUpdate(store.owner, {
            $unset: {store: ""},
        });

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Store deleted successfully",
        });
    },
}