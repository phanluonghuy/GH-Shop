import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {couponController} from "../controllers/couponController";


const couponRouter = express.Router();

couponRouter.get('/get-coupons', verify, couponController.getCoupons);

couponRouter.get('/get-coupon/:id', verify, couponController.getCoupon);

couponRouter.get('/apply-coupon/:id', verify, couponController.getCouponCode);

couponRouter.post('/add-coupon', verify, authorize("admin"), couponController.addCoupon);

couponRouter.patch('/update-coupon/:id', verify, authorize("admin"), couponController.updateCoupon);

couponRouter.delete('/delete-coupon/:id', verify, authorize("admin"), couponController.deleteCoupon);


export default couponRouter;