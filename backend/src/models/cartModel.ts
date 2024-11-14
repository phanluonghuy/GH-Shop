/* external imports */
import mongoose, { Document, Schema, model } from "mongoose";

/* create cart schema interface */
interface ICart extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

/* create cart schema */
const cartSchema = new Schema<ICart>(
  {
    // for product
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // for user
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // for quantity
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },

    // for timestamps
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

/* create cart model */
const Cart = model<ICart>("Cart", cartSchema);

/* export cart model */
export default Cart;