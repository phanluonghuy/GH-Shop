import { Request, Response } from "express";
import User from "../models/userModel";
import token from "../utils/tokenUtil";
import { verifyandget_id } from "../utils/tokenUtil";
import { console } from "inspector";

export const userService = {
  signUp: async (req: Request, res: Response): Promise<void> => {
    const { body, file } = req;
    // console.log('Body:', body);
    if (!body.name || !body.email || !body.password || !body.phone) {
      res.status(400).json({
        acknowledgement: false,
        message: "Error",
        description: "All required fields must be provided",
      });
      return;
    }

    const user = new User({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
    });
    // Uncomment and modify this section if you want to handle file uploads
    if (file) {
      user.avatar = {
        url: file.path,
        public_id: file.filename,
      };
    }

    try {
      await user.save();
      res.status(201).json({
        acknowledgement: true,
        message: "Created",
        description: "User created successfully",
      });
      return;
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        acknowledgement: false,
        message: "Error",
        description: "User creation failed",
      });
      return;
    }
  },
  persistLogin: async (req: Request, res: Response): Promise<void> => {
  
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        acknowledgement: false,
        message: "Error",
        description: "No token provided",
      });
      return;
    }
    const _id = verifyandget_id(token as string);

    const user = await User.findById(_id)
    // .populate([
    //   {
    //     path: "cart",
    //     populate: [
    //       { path: "product", populate: ["brand", "category", "store"] },
    //       "user",
    //     ],
    //   },
    //   {
    //     path: "reviews",
    //     populate: ["product", "reviewer"],
    //   },
    //   {
    //     path: "favorites",
    //     populate: [
    //       {
    //         path: "product",
    //         populate: ["brand", "category", "store"],
    //       },
    //       "user",
    //     ],
    //   },
    //   {
    //     path: "purchases",
    //     populate: ["customer", "products.product"],
    //   },
    //   "store",
    //   "brand",
    //   "category",
    //   "products",
    // ]);
  
    if (!user) {
      res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "User not found",
      });
    } else {
      res.status(200).json({
        acknowledgement: true,
        message: "OK",
        description: "Login successful",
        data: user,
      });
    }
  },

  signIn: async (req: Request, res: Response): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        acknowledgement: false,
        message: "Error",
        description: "User not found",
      });
      return;
    } else {
      if (user.comparePassword(req.body.password, user.password)) {
        if (user.status === "inactive") {
          res.status(401).json({
            acknowledgement: false,
            message: "Error",
            description: "User account is inactive",
          });
          return;
        } else {
          const tokenAccess = token({
            _id: user._id as string,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          });
          res.status(200).json({
            acknowledgement: true,
            message: "Success",
            description: "User logged in successfully",
            token: tokenAccess,
          });
          return;
        }
      } else {
        res.status(401).json({
          acknowledgement: false,
          message: "Error",
          description: "Invalid password",
        });
        return;
      }
    }
  },
};
