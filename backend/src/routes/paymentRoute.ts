import express from "express";
import verify from "../middleware/verifyMiddleware";
import {paymentController} from "../controllers/paymentController";

const paymentRouter = express.Router();

// paymentRouter.post("/create-payment", verify, authorize("buyer"), paymentController.createPayment);
paymentRouter.post("/create-payment", verify, paymentController.createPayment);

paymentRouter.get("/get-shipping-fee/:zipCode", paymentController.getShippingFee);

export default paymentRouter;