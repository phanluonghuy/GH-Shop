import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {cartController} from "../controllers/cartController";


const cartRouter = express.Router();

// cartRouter.post('/add-to-cart', verify, authorize("buyer"), cartController.addToCart);
cartRouter.post('/add-to-cart', cartController.addToCart);

// cartRouter.get('/get-from-cart', verify, authorize("admin"), cartController.getFromCart);
cartRouter.get('/get-from-cart', cartController.getFromCart);

// cartRouter.patch('/update-cart/:id', verify, authorize("buyer"), cartController.updateCart);
cartRouter.patch('/update-cart/:id', cartController.updateCart);

// cartRouter.delete('/delete-cart/:id', verify, authorize("buyer"), cartController.deleteCart);
cartRouter.delete('/delete-cart/:id', cartController.deleteCart);

export default cartRouter;