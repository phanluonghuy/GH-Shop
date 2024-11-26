import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import { couponController } from "../controllers/couponController";



const couponRouter = express.Router();

couponRouter.get('/get-coupons', couponController.getCoupons);

couponRouter.get('/get-coupon/:id', couponController.getCoupon);

couponRouter.get('/apply-coupon/:id', couponController.getCouponCode);

couponRouter.post('/add-coupon', couponController.addCoupon);

couponRouter.patch('/update-coupon/:id', couponController.updateCoupon);

couponRouter.delete('/delete-coupon/:id', couponController.deleteCoupon);




export default couponRouter;