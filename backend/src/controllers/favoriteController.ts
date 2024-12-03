import {NextFunction, Request, Response} from "express";
import {favoriteService} from "../services/favoriteService";

export const favoriteController = {
    addToFavorite: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await favoriteService.addToFavorite(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getFavorites: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await favoriteService.getFavorites(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteFromFavorite: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await favoriteService.deleteFromFavorite(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}