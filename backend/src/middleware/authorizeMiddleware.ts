import { Request, Response, NextFunction } from 'express';

// Define a type for the request with user information
interface IRequest extends Request {
  user?: {
    role: string;
  };
}

// Middleware to authorize user based on role
const authorize = (...roles: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    // Check if user role is available
    if (!req.user || !req.user.role) {
      res.status(403).json({
        acknowledgement: false,
        message: "Forbidden",
        description: "You're not applicable to access this page and features",
      });
    }

    let user: any = req.user;
    const userRole = user.role;

    // Revoke access based on role
    if (!roles.includes(userRole)) {
      res.status(403).json({
        acknowledgement: false,
        message: "Forbidden",
        description: "You're not applicable to access this page and features",
      });
    }

    next();
  };
};

export default authorize;