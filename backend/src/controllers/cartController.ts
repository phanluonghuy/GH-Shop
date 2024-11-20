import {NextFunction, Request, Response} from "express";
import {cartService} from "../services/cartService";

export const cartController = {
    addToCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cartService.addToCart(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getFromCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cartService.getFromCart(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    updateCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cartService.updateCart(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cartService.deleteCart(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
}