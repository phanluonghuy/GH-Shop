/* external imports */
import mongoose, { Document, Schema, model } from "mongoose";
import User from "./userModel";
import Product from "./productModel";

/* create purchase schema interface */
interface IProductInPurchase {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

interface IPurchase extends Document {
  customer: mongoose.Types.ObjectId;
  products: IProductInPurchase[];
  customerId: string;
  orderId: string;
  totalAmount: number;
  status: "pending" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

/* create purchase schema */
const purchaseSchema = new Schema<IPurchase>(
  {
    // for customer
    customer: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },

    // for products
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: Product,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // for customer ID
    customerId: {
      type: String,
      required: true,
    },

    // for order ID
    orderId: {
      type: String,
      required: true,
    },

    // for total amount
    totalAmount: {
      type: Number,
      required: true,
    },

    // order status
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },

    // timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* create purchase model */
const Purchase = model<IPurchase>("Purchase", purchaseSchema);

/* export purchase model */
export default Purchase;