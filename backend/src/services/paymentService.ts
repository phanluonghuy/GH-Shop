import { Request, Response } from "express";
import Cart from "../models/cartModel";
import Product from "../models/productModel";
import Purchase from "../models/purchaseModel";
import User from "../models/userModel";
import dotenv from "dotenv";
import { verifyandget_id } from "../utils/tokenUtil";
import Coupon from "../models/couponModel";
import { get } from "http";
import { getZipCodeInfo } from "../utils/shippingUtil";

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const shippingFeeAPI = process.env.SHIPPING_FEE_API || 'https://api.goship.io/api/ext_v1/rates' ;

interface CustomRequest extends Request {
  user?: any;
}

export const paymentService = {
  createPayment: async (req: CustomRequest, res: Response) => {
    try {
      // const coupon = Coupon.findOne({ code: req.body.coupon });
      // if (coupon) {
      //   console.log(coupon.);
      // }
      // console.log(req.body);
      // await Coupon.findOne( { $regex: new RegExp(`^${req.params.id}$`, 'i') }).then((coupon) => {  
      //     console.log(coupon);
      // });
      const coupon = await Coupon.findOne({ 
        code: { $regex: new RegExp(`^${req.body.coupon}$`, 'i') } 
      });
      
      let discount = 1 - (coupon?.discountValue || 0) / 100;
  
      // console.log(discount);
  
      const token = req.headers.authorization?.split(" ")[1];
      const _id = verifyandget_id(token as string);
      const user = await User.findByIdAndUpdate(_id, {
        $set: {
          address: req.body.address,
          phone: req.body.phone,
          name: req.body.name,
        },
      });
      // console.log(user);
      // console.log(req.body.result);
      if (!user) {
        res.status(404).json({
          acknowledgement: false,
          message: "Not Found",
          description: "Error",
        });
        return;
      }
  
      const lineItems: any = req.body.result.map(
        (item: {
          name: string;
          thumbnail: string;
          description: string;
          pid: string;
          price: number;
          quantity: number;
        }) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                images: [item.thumbnail],
                description: item.description,
                metadata: {
                  id: item.pid,
                },
              },
              unit_amount: item.price * 100 ,
            },
            quantity: item.quantity,
          };
        }
      );
  
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.ORIGIN_URL}`,
        cancel_url: `${process.env.ORIGIN_URL}`,
      });
  
      // Create purchase for user
      const purchase: any = await Purchase.create({
          customer: req.user?._id,
          customerId: session.id,
          orderId: session.id,
          totalAmount: session.amount_total,
          automatic_payment_methods: {
              enabled: true,
          },
          products: req.body.result.map((item: { pid: string; quantity: number }) => ({
              product: item.pid,
              quantity: item.quantity,
          })),
      });
  
      // Update user's purchases, products, and empty cart
      await User.findByIdAndUpdate(req.user?._id, {
          $push: { purchases: purchase._id },
          $set: { cart: [] },
      });
  
      // Add product IDs to user's products array
      req.body.result.forEach(async (item: { pid: string }) => {
          await User.findByIdAndUpdate(req.user?._id, {
              $push: { products: item.pid },
          });
      });
  
      // Remove carts that match cart IDs
      req.body.result.forEach(async (cart: { cid: string }) => {
          await Cart.findByIdAndDelete(cart.cid);
      });
  
      // Add user to products' buyers array
      req.body.result.forEach(async (product: { pid: string }) => {
          await Product.findByIdAndUpdate(product.pid, {
              $push: { buyers: req.user?._id },
          });
      });
  
      res.status(201).json({
        acknowledgement: true,
        message: "Ok",
        description: "Payment created successfully",
        url: session.url,
      });
    } catch (error: any) {
      res.status(500).json({
        acknowledgement: false,
        message: "Internal Server Error",
        description: "Failed to create payment",
        error: error.message,
      });
    }
  },
  getShippingFee : async (req: CustomRequest, res: Response) => {
    // console.log(req.params.zipCode);
    const result = getZipCodeInfo(req.params.zipCode);
    // if (result) {
    //   console.log(`ID: ${result.id}, City ID: ${result.city_id}`);
    // } else {
    //   console.log("Zip code not found.");
    // }
    const requestBody = {
      shipment: {
        address_from: {
          city: '520000',
          district: '520700',
        },
        address_to: {
          city: result?.city_id ?? '700000',
          district: result?.id ?? '702000',
        },
        parcel: {
          cod: 0,
          weight: 5000,
          length: 0,
          width: 0,
          height: 0,
        },
      },
    };
    let data = null;
    try {
      const response = await fetch(shippingFeeAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      data = await response.json();
      // console.log('Shipping rates:', data);
      data.data.forEach((rate: any) => {
        rate.total_fee = rate.total_fee / 24000;
        rate.total_fee = Math.round(rate.total_fee * 100) / 100;
      });
    } catch (error) {
      // console.error('Error fetching shipping rates:', error);
    }

    // console.log(req.params.zipCode);
    res.status(200).json({
      acknowledgement: true,
      message: "Ok",
      description: "Shipping fee retrieved successfully",
      fee: data
    })
  }
}

// export const createPayment = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     // const coupon = Coupon.findOne({ code: req.body.coupon });
//     // if (coupon) {
//     //   console.log(coupon.);
//     // }
//     // console.log(req.body);
//     // await Coupon.findOne( { $regex: new RegExp(`^${req.params.id}$`, 'i') }).then((coupon) => {  
//     //     console.log(coupon);
//     // });
//     const coupon = await Coupon.findOne({ 
//       code: { $regex: new RegExp(`^${req.body.coupon}$`, 'i') } 
//     });
    
//     let discount = 1 - (coupon?.discountValue || 0) / 100;

//     // console.log(discount);

//     const token = req.headers.authorization?.split(" ")[1];
//     const _id = verifyandget_id(token as string);
//     const user = await User.findByIdAndUpdate(_id, {
//       $set: {
//         address: req.body.address,
//         phone: req.body.phone,
//         name: req.body.name,
//       },
//     });
//     // console.log(user);
//     // console.log(req.body.result);
//     if (!user) {
//       res.status(404).json({
//         acknowledgement: false,
//         message: "Not Found",
//         description: "Error",
//       });
//       return;
//     }

//     const lineItems: any = req.body.result.map(
//       (item: {
//         name: string;
//         thumbnail: string;
//         description: string;
//         pid: string;
//         price: number;
//         quantity: number;
//       }) => {
//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: item.name,
//               images: [item.thumbnail],
//               description: item.description,
//               metadata: {
//                 id: item.pid,
//               },
//             },
//             unit_amount: item.price * 100 ,
//           },
//           quantity: item.quantity,
//         };
//       }
//     );

//     const session = await stripe.checkout.sessions.create({
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.ORIGIN_URL}`,
//       cancel_url: `${process.env.ORIGIN_URL}`,
//     });

//     // Create purchase for user
//     const purchase: any = await Purchase.create({
//         customer: req.user?._id,
//         customerId: session.id,
//         orderId: session.id,
//         totalAmount: session.amount_total,
//         automatic_payment_methods: {
//             enabled: true,
//         },
//         products: req.body.result.map((item: { pid: string; quantity: number }) => ({
//             product: item.pid,
//             quantity: item.quantity,
//         })),
//     });

//     // Update user's purchases, products, and empty cart
//     await User.findByIdAndUpdate(req.user?._id, {
//         $push: { purchases: purchase._id },
//         $set: { cart: [] },
//     });

//     // Add product IDs to user's products array
//     req.body.result.forEach(async (item: { pid: string }) => {
//         await User.findByIdAndUpdate(req.user?._id, {
//             $push: { products: item.pid },
//         });
//     });

//     // Remove carts that match cart IDs
//     req.body.result.forEach(async (cart: { cid: string }) => {
//         await Cart.findByIdAndDelete(cart.cid);
//     });

//     // Add user to products' buyers array
//     req.body.result.forEach(async (product: { pid: string }) => {
//         await Product.findByIdAndUpdate(product.pid, {
//             $push: { buyers: req.user?._id },
//         });
//     });

//     res.status(201).json({
//       acknowledgement: true,
//       message: "Ok",
//       description: "Payment created successfully",
//       url: session.url,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       acknowledgement: false,
//       message: "Internal Server Error",
//       description: "Failed to create payment",
//       error: error.message,
//     });
//   }
// };

// export const createPayment = async (req: CustomRequest, res: Response): Promise<void> => {
//     try {

//         console.log(req.body);

//         res.status(201).json({
//             acknowledgement: true,
//             message: "Ok",
//             description: "Payment created successfully"
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             acknowledgement: false,
//             message: "Internal Server Error",
//             description: "Failed to create payment"
//         });
//     }
// };
