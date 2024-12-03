import {NextFunction, Request, Response} from "express";
import {purchaseService} from "../services/purchaseService";

export const purchaseController = {
    getAllPurchases: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await purchaseService.getAllPurchases(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
    updatePurchaseStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await purchaseService.updatePurchaseStatus(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
}