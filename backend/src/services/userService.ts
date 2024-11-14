import { Request, Response } from 'express';
import User from '../models/userModel';

export const  userService = { 
    signUp: async (req: Request, res: Response): Promise<void> => {
        const { body, file } = req;
        if (!body.name || !body.email || !body.password || !body.phone) {
            res.status(400).json({
              acknowledgement: false,
              message: "Error",
              description: "All required fields must be provided",
            });
            return
          }
          
        const user = new User({
            name: body.name,
            email: body.email,
            password: body.password,
            phone: body.phone,
        });
        // Uncomment and modify this section if you want to handle file uploads
        // if (file) {
        //     user.avatar = {
        //         url: file.path,
        //         public_id: file.filename
        //     };
        // }

        try {
            // console.log('User:', user);
            await user.save();
            res.status(201).json({
                acknowledgement: true,
                message: "Created",
                description: 'User created successfully'
            });
            return;
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                acknowledgement: false,
                message: "Error",
                description: "User creation failed"
            });
            return;
        }
    }
};