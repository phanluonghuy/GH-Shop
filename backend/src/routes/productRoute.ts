import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {productController} from "../controllers/productController";


const productRouter = express.Router();

productRouter.post('/add-product', verify, authorize("admin"), upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "gallery", maxCount: 5},
]), productController.addProduct)

productRouter.get("/get-products", productController.getProducts);

productRouter.get("/get-product/:id", productController.getProduct);

productRouter.patch('/update-product/:id', verify, authorize("admin"), upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "gallery", maxCount: 5},
]), productController.updateProduct)

productRouter.delete('/delete-product/:id', verify, authorize("admin"), productController.deleteProduct)

productRouter.get('/filtered-products', productController.getFilteredProducts)

// Inventory management routes
productRouter.post(
    "/restock-product/:id",
    verify,
    authorize("admin"),
    productController.restockProduct
);

productRouter.post(
    "/sell-product/:id",
    verify,
    authorize("admin"),
    productController.sellProduct
);

productRouter.get(
    "/product-stock/:id",
    verify,
    productController.getStockDetails
);

export default productRouter;