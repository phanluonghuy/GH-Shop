import mongoose, { Schema, Document } from "mongoose";

/* create coupon schema interface */
export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

// Define the schema
const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
