import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {brandController} from "../controllers/brandController";


const brandRouter = express.Router();

// brandRouter.get('/add-brand',verify, authorize("admin", "seller"),upload.single("logo"), brandController.addBrand);
brandRouter.post('/add-brand', upload.single("logo"), brandController.addBrand);

brandRouter.get('/get-brands', brandController.getBrands);

brandRouter.get('/get-brand/:id', brandController.getBrand);

// brandRouter.patch('/update-brand/:id', verify, authorize("admin", "seller"), upload.single("logo"),brandController.updateBrand);
brandRouter.patch('/update-brand/:id', upload.single("logo"), brandController.updateBrand);

// brandRouter.delete('/delete-brand/:id', verify, authorize("admin", "seller"), brandController.deleteBrand);
brandRouter.delete('/delete-brand/:id', brandController.deleteBrand);

export default brandRouter;