import express from "express";
import upload from "../middleware/uploadMiddleware";
import {userController} from "../controllers/userController";
import verify from "../middleware/verifyMiddleware";

const userRouter = express.Router();

userRouter.post('/sign-up', upload.single("avatar"), userController.signUp);
userRouter.post('/sign-in', userController.signIn);
userRouter.get('/me', userController.persistLogin);
userRouter.patch('/forgot-password', userController.forgotPassword);
userRouter.patch('/reset-password', userController.resetPassword);
userRouter.patch('/change-password-token', userController.resetPasswordToken);
userRouter.patch('/update-information',verify,upload.single("avatar"), userController.updateInfo);
userRouter.post('/send-reset-email', userController.sendResetEmail);

export default userRouter;