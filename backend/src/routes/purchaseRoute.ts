import express from "express";

import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {purchaseController} from "../controllers/purchaseController";

const purchaseRouter = express.Router();

purchaseRouter.get('/get-all-purchases', verify, authorize('admin'), purchaseController.getAllPurchases);

purchaseRouter.patch('/update-purchase-status/:id', verify, authorize('admin'), purchaseController.updatePurchaseStatus);

export default purchaseRouter;