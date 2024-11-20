import express from "express";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";
import {favoriteController} from "../controllers/favoriteController";

const favoriteRouter = express.Router();

favoriteRouter.post('/add-to-favorite', verify, authorize('buyer'), favoriteController.addToFavorite);

favoriteRouter.get('/get-favorites', verify, authorize('admin'), favoriteController.getFavorites);

favoriteRouter.delete('/delete-from-favorite/:id', verify, authorize('admin'), favoriteController.deleteFromFavorite)

export default favoriteRouter;