import {NextFunction, Request, Response} from "express";
import {dashboardService} from "../services/dashboardService";

export const dashboardController = {
    getTotalPurchase: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await dashboardService.getTotalPurchase(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
    getRevenue: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await dashboardService.getRevenue(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}