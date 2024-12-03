import {NextFunction, Request, Response} from "express";
import {categoryService} from "../services/categoryService";

export const categoryController = {
    addCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await categoryService.addCategory(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getCategories: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await categoryService.getCategories(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await categoryService.getCategory(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    updateCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await categoryService.updateCategory(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await categoryService.deleteCategory(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
}