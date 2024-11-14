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
  }
}
