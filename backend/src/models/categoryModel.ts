/* external imports */
import mongoose, { Document, Schema, model } from "mongoose";
import validator from "validator";
import Product from "./productModel";
import User from "./userModel";

/* create category schema interface */
interface ICategory extends Document {
  title: string;
  description: string;
  thumbnail: {
    url: string;
    public_id: string;
  };
  keynotes: string[];
  tags: string[];
  products: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/* create category schema */
const categorySchema = new Schema<ICategory>(
  {
    // for title
    title: {
      type: String,
      required: [true, "Please, provide a category name"],
      trim: true,
      unique: true,
      maxLength: [100, "Your title would be at most 100 characters"],
    },

    // for description
    description: {
      type: String,
      required: [true, "Please, provide category description"],
      trim: true,
      maxLength: [500, "Your description would be at most 500 characters"],
    },

    // for thumbnail
    thumbnail: {
      url: {
        type: String,
        validate: [validator.isURL, "Please provide a valid thumbnail URL"],
        default: "https://placehold.co/296x200.png",
      },
      public_id: {
        type: String,
        default: "N/A",
      },
    },

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

    // for products
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: Product,
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

/* middleware for category */
categorySchema.pre<ICategory>("save", function (next) {
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

/* create category model */
const Category: any = model<ICategory>("Category", categorySchema);

/* export category model */
export default Category;