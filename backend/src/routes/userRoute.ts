import express from "express";
import upload from "../middleware/uploadMiddleware";
import {userController} from "../controllers/userController";

const userRouter = express.Router();


userRouter.post('/sign-up', upload.single("avatar"), userController.signUp);
userRouter.get('/sign-up', (req, res) => {
    res.send('Hello from TypeScript + Node.js');
  });


export default userRouter;