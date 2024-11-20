import express from "express";

import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {reviewController} from "../controllers/reviewController";

const reviewRouter = express.Router();

reviewRouter.post('/add-review', verify, authorize('buyer'), reviewController.addReview);

reviewRouter.get('/get-reviews', reviewController.getReviews);

reviewRouter.patch('/update-review/:id', verify, authorize('buyer'), reviewController.updateReview);

reviewRouter.delete('/delete-review/:id', verify, authorize("seller", "admin"), reviewController.deleteReview);

export default reviewRouter;