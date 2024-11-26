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
    },

    getProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.getProducts(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.getProduct(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.updateProduct(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.deleteProduct(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getFilteredProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.getFilteredProducts(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    restockProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.restockProduct(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    sellProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.sellProduct(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getStockDetails: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.getStockDetails(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
}