import {NextFunction, Request, Response} from "express";
import {brandService} from "../services/brandService";

export const brandController = {
    addBrand: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await brandService.addBrand(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getBrands: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await brandService.getBrands(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getBrand: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await brandService.getBrand(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    updateBrand: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await brandService.updateBrand(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteBrand: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await brandService.deleteBrand(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}