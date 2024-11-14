import {NextFunction, Request, Response} from "express";
import {productService} from "../services/productService";

export const productController = {
    addProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.addProduct(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}