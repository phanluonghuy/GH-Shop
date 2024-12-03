import {NextFunction} from "express";
import {dashboardService} from "../services/dashboardService";
import { Request, Response } from "express";

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