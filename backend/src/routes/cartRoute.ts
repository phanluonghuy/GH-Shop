import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {cartController} from "../controllers/cartController";


const cartRouter = express.Router();

cartRouter.post('/add-to-cart', verify, authorize("buyer"), cartController.addToCart);

cartRouter.get('/get-from-cart', verify, authorize("admin"), cartController.getFromCart);

cartRouter.patch('/update-cart/:id', verify, authorize("buyer"), cartController.updateCart);

cartRouter.delete('/delete-cart/:id', verify, authorize("buyer"), cartController.deleteCart);

export default cartRouter;