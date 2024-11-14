import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {productController} from "../controllers/productController";


const productRouter = express.Router();

productRouter.get('/', (req, res) => {
    res.json({code: 0, message: 'home product'})
})

// productRouter.post('/add-product', verify, authorize("admin", "seller"), upload.fields([
//     {name: "thumbnail", maxCount: 1},
//     {name: "gallery", maxCount: 5},
// ]), productController.addProduct)

productRouter.post('/add-product', upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "gallery", maxCount: 5},
]), productController.addProduct)

productRouter.get("/get-products", productController.getProducts);

productRouter.get("/get-product/:id", productController.getProduct);

// productRouter.patch('/update-product', verify, authorize("admin", "seller"), upload.fields([
//     {name: "thumbnail", maxCount: 1},
//     {name: "gallery", maxCount: 5},
// ]), productController.updateProduct)

productRouter.patch('/update-product/:id', upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "gallery", maxCount: 5},
]), productController.updateProduct)

// productRouter.delete('/delete-product/:id',verify, authorize("admin", "seller"), productController.deleteProduct)
productRouter.delete('/delete-product/:id', productController.deleteProduct)

productRouter.get('/filtered-products', productController.getFilteredProducts)

export default productRouter;