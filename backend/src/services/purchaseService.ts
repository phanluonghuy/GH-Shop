import { Request, Response} from 'express';
import Purchase from "../models/purchaseModel";

export const purchaseService = {
    getAllPurchases: async (res: Response): Promise<void> => {
        const purchases = await Purchase.find().populate([
            "customer",
            "products.product",
        ]);

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Purchases fetched successfully",
            data: purchases,
        });
    },

    updatePurchaseStatus: async (req: Request, res: Response): Promise<void> => {
        await Purchase.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status,
                },
            },
            {
                runValidators: true,
            }
        );

        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Purchase status updated successfully",
        });
    },
}