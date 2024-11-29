import {NextFunction, Request, Response} from "express";
import { paymentService } from "../services/paymentService";



export const paymentController = {
    createPayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await paymentService.createPayment(req, res);
        } catch (err) {
            next(err);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
    getShippingFee: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await paymentService.getShippingFee(req, res);
        } catch (err) {
            next(err);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}