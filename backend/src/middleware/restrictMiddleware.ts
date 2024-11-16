import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

// Define a type for the request with user information
interface IRequest extends Request {
  user?: {
    _id: string;
  };
}

// Middleware to restrict creating a store if the user already has one
const restrict: any = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user?._id);
    
    // Check if the user has a store
    if (user && user.store) {
      return res.status(405).json({
        acknowledgement: false,
        message: "Not Allowed",
        description: "Already having store is not allowed to create another store",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    next(error);
  }
};

export default restrict;