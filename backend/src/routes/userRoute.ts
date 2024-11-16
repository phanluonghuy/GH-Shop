import express from "express";
import upload from "../middleware/uploadMiddleware";
import {userController} from "../controllers/userController";
import verify from "../middleware/verifyMiddleware";
import authorize from "../middleware/authorizeMiddleware";

const userRouter = express.Router();

userRouter.post('/sign-up', upload.single("avatar"), userController.signUp);
userRouter.post('/sign-in', userController.signIn);
userRouter.get('/me', userController.persistLogin);
userRouter.patch('/forgot-password', userController.forgotPassword);
userRouter.patch('/reset-password', userController.resetPassword);
userRouter.patch('/change-password-token', userController.resetPasswordToken);
userRouter.patch('/update-information',verify,upload.single("avatar"), userController.updateInfo);
userRouter.post('/send-reset-email', userController.sendResetEmail);
userRouter.get('/all-users',verify,authorize("admin"), userController.getAllUser);
userRouter.get('/get-user/:id',verify,authorize("admin"), userController.getUserById);
userRouter.patch('/update-user/:id',verify,upload.single("avatar"),authorize("admin"), userController.updateUser);
userRouter.delete('/delete-user/:id',verify,authorize("admin"), userController.deleteUser);

export default userRouter;