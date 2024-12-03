import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {categoryController} from "../controllers/categoryController";


const categoryRouter = express.Router();

categoryRouter.post('/add-category', verify, authorize("admin", "seller"), upload.single("thumbnail"), categoryController.addCategory);

categoryRouter.get('/get-categories', categoryController.getCategories);

categoryRouter.get('/get-category/:id', categoryController.getCategory);

categoryRouter.patch('/update-category/:id', verify, authorize("admin", "seller"), upload.single("thumbnail"), categoryController.updateCategory);

categoryRouter.delete('/delete-category/:id', verify, authorize("admin", "seller"), categoryController.updateCategory);

export default categoryRouter;