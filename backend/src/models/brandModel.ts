/* external imports */
import mongoose, { Document, Schema, model } from "mongoose";
import validator from "validator";
import Product from "./productModel";
import User from "./userModel";

/* create brand schema interface */
interface IBrand extends Document {
  title: string;
  description: string;
  logo: {
    url: string;
    public_id: string;
  };
  products: mongoose.Types.ObjectId[];
  keynotes: string[];
  tags: string[];
  creator: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/* create brand schema */
const brandSchema = new Schema<IBrand>(
  {
    // for title
    title: {
      type: String,
      required: [true, "Please, provide a valid brand name"],
      trim: true,
      uppercase: true,
      unique: true,
      maxLength: [100, "Your title would be at most 100 characters"],
    },

    // for description
    description: {
      type: String,
      required: [true, "Please, provide brand description"],
      trim: true,
      maxLength: [500, "Your description would be at most 500 characters"],
    },

    // for logo
    logo: {
      url: {
        type: String,
        validate: [validator.isURL, "Please provide a valid logo URL"],
        default: "https://placehold.co/296x200.png",
      },
      public_id: {
        type: String,
        default: "N/A",
      },
    },

    // for products
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: Product,
      },
    ],

    // for keynotes
    keynotes: [
      {
        type: String,
        trim: true,
      },
    ],

    // for tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // for creator
    creator: {
      type: Schema.Types.ObjectId,
      ref: User,
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

/* middleware for brand */
brandSchema.pre<IBrand>("save", function (next) {
  // Capitalize title
  let splitStr = this.title?.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  this.title = splitStr.join(" ");

  // replace space with hyphen and lowercase for tags
  this.tags = this.tags.map((tag) => tag.replace(" ", "-").toLowerCase());

  next();
});

/* create brand model schema */
const Brand: any = model<IBrand>("Brand", brandSchema);

/* export brand schema */
export default Brand;
