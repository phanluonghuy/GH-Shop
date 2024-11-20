import {NextFunction, Request, Response} from "express";
import {reviewService} from "../services/reviewService";

export const reviewController = {
    addReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await reviewService.addReview(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    getReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await reviewService.getReviews(res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    updateReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await reviewService.updateReview(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },

    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await reviewService.deleteReview(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
}