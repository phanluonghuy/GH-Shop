import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {brandController} from "../controllers/brandController";


const brandRouter = express.Router();

brandRouter.post('/add-brand', verify, authorize("admin"), upload.single("logo"), brandController.addBrand);

brandRouter.get('/get-brands', brandController.getBrands);

brandRouter.get('/get-brand/:id', brandController.getBrand);

brandRouter.patch('/update-brand/:id', verify, authorize("admin"), upload.single("logo"), brandController.updateBrand);

brandRouter.delete('/delete-brand/:id', verify, authorize("admin"), brandController.deleteBrand);

export default brandRouter;