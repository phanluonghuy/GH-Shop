import {NextFunction, Request, Response} from "express";
import {storeService} from "../services/storeService";


export const storeController = {
    addStore: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await storeService.addStore(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getStores: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await storeService.getStores(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getStore: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await storeService.getStore(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    updateStore: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await storeService.updateStore(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteStore: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await storeService.deleteStore(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
}