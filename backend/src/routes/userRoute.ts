import express from "express";
import upload from "../middleware/uploadMiddleware";
import {userController} from "../controllers/userController";
import verify from "../middleware/verifyMiddleware";

const userRouter = express.Router();

userRouter.post('/sign-up', upload.single("avatar"), userController.signUp);
userRouter.post('/sign-in', userController.signIn);
userRouter.get('/me', userController.persistLogin);




userRouter.get('/sign-up', (req, res) => {
    res.send('Hello from TypeScript + Node.js');
  });


export default userRouter;