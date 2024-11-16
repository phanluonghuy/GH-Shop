import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {categoryController} from "../controllers/categoryController";


const categoryRouter = express.Router();

// categoryRouter.post('/add-category',verify, authorize("admin", "seller"), upload.single("thumbnail"), categoryController.addCategory);
categoryRouter.post('/add-category', upload.single("thumbnail"), categoryController.addCategory);

categoryRouter.get('/get-categories', categoryController.getCategories);

categoryRouter.get('/get-category/:id', categoryController.getCategory);

// categoryRouter.post('/update-category/:id',verify, authorize("admin", "seller"), upload.single("thumbnail"), categoryController.updateCategory);
categoryRouter.patch('/update-category/:id', upload.single("thumbnail"), categoryController.updateCategory);

// categoryRouter.post('/delete-category/:id',verify, authorize("admin", "seller"), categoryController.updateCategory);
categoryRouter.delete('/delete-category/:id', categoryController.deleteCategory);

export default categoryRouter;