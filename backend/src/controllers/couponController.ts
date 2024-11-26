import {NextFunction, Request, Response} from "express";
import {couponService} from "../services/couponService";

export const couponController = {
    addCoupon: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await couponService.addCoupon(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
    getCoupons: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await couponService.getCoupons(req,res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
    getCoupon: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await couponService.getCoupon(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
    ,
    deleteCoupon: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await couponService.deleteCoupon(req, res);
        } catch (error) {
            next(error);
        } finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    },
    updateCoupon : async (req: Request, res: Response, next: NextFunction) => {
        try {
            await couponService.updateCoupon(req, res);
        } catch (error) {
            next(error);
        }
        finally {
            console.log(`Route: ${req.url} || Method: ${req.method}`);
        }
    }
}