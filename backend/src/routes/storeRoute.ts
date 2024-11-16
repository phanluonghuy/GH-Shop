import express from "express";

import upload from "../middleware/uploadMiddleware";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import restrict from "../middleware/restrictMiddleware";
import {storeController} from "../controllers/storeController";



const storeRouter = express.Router();

// storeRouter.post('/add-store',verify, authorize("admin", "seller"), restrict, upload.single("thumbnail"), storeController.addStore);
storeRouter.post('/add-store', upload.single("thumbnail"), storeController.addStore);

storeRouter.get('/get-stores', storeController.getStores);

storeRouter.get('/get-store/:id', storeController.getStore);

// storeRouter.post('/update-store/:id',verify, authorize("admin", "seller"), upload.single("thumbnail"), storeController.updatestore);
storeRouter.patch('/update-store/:id', upload.single("thumbnail"), storeController.updateStore);

// storeRouter.post('/delete-store/:id',verify, authorize("admin", "seller"), storeController.updatestore);
storeRouter.delete('/delete-store/:id', storeController.deleteStore);

export default storeRouter;