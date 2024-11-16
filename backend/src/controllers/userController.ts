import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService'; 

export const userController = {
  signUp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
       await userService.signUp(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  persistLogin : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      await userService.persistLogin(req, res);
      // const token = req.headers.authorization?.split(' ')[1];
      // console.log('Token:', token);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  signIn: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.signIn(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  forgotPassword : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.forgotPassword(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  resetPassword : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.resetPassword(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  updateInfo : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.updateInfo(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  sendResetEmail : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.sendResetEmail(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  resetPasswordEmail : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.resetPasswordEmail(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  },
  resetPasswordToken : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.resetPasswordToken(req, res);
    } catch (error) {
      next(error);
    } finally {
      console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
  }
}
