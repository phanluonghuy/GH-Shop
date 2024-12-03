import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {dashboardController} from "../controllers/dashboardController";


const dashboardRouter = express.Router();

dashboardRouter.get('/get-total-purchases', verify, authorize("admin"), dashboardController.getTotalPurchase);
dashboardRouter.get('/get-revenue/:period', verify, authorize("admin"), dashboardController.getRevenue);


export default dashboardRouter;