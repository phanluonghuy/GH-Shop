import { Request, Response } from "express";
import Coupon from "../models/couponModel";

export const couponService = {
  addCoupon: async (req: Request, res: Response): Promise<void> => {
    const {
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
      usageLimit,
      isActive,
    } = req.body;
    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit,
      isActive,
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
  getCouponCode: async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.id);
    const coupon = await Coupon.findOne({ 
      code: { $regex: new RegExp(`^${req.params.id}$`, 'i') }
  });  

    if (!coupon) {
      res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "Coupon not found",
      });
      return;
    }

    if (coupon.startDate > new Date()) {
      res.status(400).json({
        acknowledgement: false,
        message: "Bad Request",
        description: "Coupon has not started yet",
      });
      return;
    }

    if (coupon.endDate < new Date()) {
      res.status(400).json({
        acknowledgement: false,
        message: "Bad Request",
        description: "Coupon has expired",
      });
      return;
    }

    if (coupon.usageLimit < coupon.usedCount) {
      res.status(400).json({
        acknowledgement: false,
        message: "Bad Request",
        description: "Coupon has expired",
      });
      return;
    }

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
      description: "Coupon deleted successfully",
    });
  },
  updateCoupon: async (req: Request, res: Response): Promise<void> => {
    const {
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
      usageLimit,
      isActive,
    } = req.body;
    console.log(req.body);
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
      code,
      discountType,
      discountValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit,
      isActive,
    });
    res.status(200).json({
      acknowledgement: true,
      message: "Ok",
      description: "Coupon updated successfully",
      data: coupon,
    });
  },
};
