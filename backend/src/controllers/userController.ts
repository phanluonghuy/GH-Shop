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
  }
}
