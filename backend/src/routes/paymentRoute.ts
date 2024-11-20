import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {paymentController} from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment", verify, authorize("buyer"), paymentController.createPayment);

export default paymentRouter;