import {NextFunction, Request, Response} from "express";
import {createPayment} from "../services/paymentService";

export const paymentController = {
    createPayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await createPayment(req, res);
        } catch (err) {
            next(err);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}