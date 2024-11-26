import { Request, Response } from "express";
import Coupon from "../models/couponModel";

export const couponService = {
  addCoupon: async (req: Request, res: Response): Promise<void> => {
    const { code, discountType,discountValue,startDate,endDate,usageLimit,isActive } = req.body;
    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      startDate : new Date(startDate),
      endDate : new Date(endDate),
      usageLimit,
      isActive
    }).catch((error) => {
      res.status(400).json({
        acknowledgement: false,
        message: "Bad Request",
        description: error.message,
      });
    });
    res.status(201).json({
      acknowledgement: true,
      message: "Ok",
      description: "Coupon added successfully",
      data: coupon,
    });
  },
  getCoupons: async (req: Request, res: Response): Promise<void> => {
    const coupons = await Coupon.find();
    res.status(200).json({
      acknowledgement: true,
      message: "Ok",
      description: "Coupons fetched successfully",
      data: coupons,
    });
  },
  getCoupon: async (req: Request, res: Response): Promise<void> => {
    const coupon = await Coupon.findById(req.params.id);
    res.status(200).json({
      acknowledgement: true,
      message: "Ok",
      description: "Coupon fetched successfully",
      data: coupon,
    });
  },
  deleteCoupon: async (req: Request, res: Response): Promise<void> => {

    await Coupon.deleteOne({ _id: req.params.id });
    res.status(200).json({
      acknowledgement: true,
      message: "Ok",
      description: "Coupon deleted successfully",});
  },
  updateCoupon : async (req: Request, res: Response): Promise<void> => {
    const { code, discountType,discountValue,startDate,endDate,usageLimit,isActive } = req.body;
    console.log(req.body);
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
      code,
      discountType,
      discountValue,
      startDate : new Date(startDate),
      endDate : new Date(endDate),
      usageLimit,
      isActive
    });
    res.status(200).json({
      acknowledgement: true,
      message: "Ok",
      description: "Coupon updated successfully",
      data: coupon,
    });
  }
};
