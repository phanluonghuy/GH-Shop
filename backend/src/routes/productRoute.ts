import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {productController} from "../controllers/productController";


const productRouter = express.Router();

productRouter.get('/', (req, res) => {
    res.json({code: 0, message: 'home product'})
})

productRouter.post('/add-product', verify, authorize("admin", "seller"), upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "gallery", maxCount: 5},
]), productController.addProduct)

productRouter.get('/add-product', (req, res) => {
    res.json({code: 0, message: 'add product GET'})
})


export default productRouter;