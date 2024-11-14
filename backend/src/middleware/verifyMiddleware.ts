import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";

interface CustomRequest extends Request {
    user?: any;
  }

async function verify(req: CustomRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> {
  try {
    // catch the token from user header
    const token = req.headers?.authorization?.split(" ")[1];

    // no token explicitly give error
    if (!token) {
      return res.status(401).json({
        acknowledgement: false,
        message: "Unauthorized",
        description: "No token found to persist an existing user for long time",
      });
    }

    // fetching token set the user on request
    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      acknowledgement: false,
      message: "Unauthorized",
      description: "Sign in your account to continue",
    });
  }
}

/* export token verification */
export default verify;