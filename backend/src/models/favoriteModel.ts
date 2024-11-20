/* external imports */
import mongoose, { Document, Schema, model } from "mongoose";
import User from "./userModel";
import Product from "./productModel";

/* create favorite schema interface */
interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/* create favorite schema */
const favoriteSchema = new Schema<IFavorite>(
  {
    // for user
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },

    // for product
    product: {
      type: Schema.Types.ObjectId,
      ref: Product,
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

/* create favorite model */
const Favorite = model<IFavorite>("Favorite", favoriteSchema);

/* export favorite model */
export default Favorite;
