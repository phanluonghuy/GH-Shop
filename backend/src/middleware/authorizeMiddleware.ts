import { Request, Response, NextFunction, RequestHandler } from 'express';

// Define a type for the request with user information
interface IRequest extends Request {
  user?: {
    role: string;
  };
}

// Middleware to authorize user based on role
const authorize = (...roles: string[]): RequestHandler => {
  return (req: IRequest, res: Response, next: NextFunction): void => {
    // Check if user role is available
    if (!req.user || !req.user.role) {
      res.status(403).json({
        acknowledgement: false,
        message: "Forbidden",
        description: "You're not applicable to access this page and features",
      });
      return; // Ensure the function returns void after sending a response
    }

    // Match the user role
    const userRole = req.user.role;

    // Revoke access based on role
    if (!roles.includes(userRole)) {
      res.status(403).json({
        acknowledgement: false,
        message: "Forbidden",
        description: "You're not applicable to access this page and features",
      });
      return; // Ensure the function returns void after sending a response
    }

    // If the role matches, proceed to the next middleware
    next();
  };
};

export default authorize;