/* external imports */
import mongoose, {Document, model, Schema} from "mongoose";
import validator from "validator";
import User from "./userModel";
import Product from "./productModel";

/* create store schema interface */
interface IStore extends Document {
    title: string;
    description: string;
    thumbnail: {
        url: string;
        public_id: string;
    };
    owner: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
    status: "active" | "inactive";
    keynotes: string[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

/* create store schema */
const storeSchema = new Schema<IStore>(
    {
        // for title
        title: {
            type: String,
            required: [true, "Please, provide a valid store name"],
            trim: true,
            unique: true,
            maxLength: [100, "Your title would be at most 100 characters"],
        },

        // for description
        description: {
            type: String,
            required: [true, "Please, provide store description"],
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

        // for owner
        owner: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true,
        },

        // for products
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: Product,
            },
        ],

        // for status
        status: {
            type: String,
            enum: {
                values: ["active", "inactive"],
                message: "Invalid status, choose active/inactive",
            },
            default: "active",
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

        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

/* middleware for store */
storeSchema.pre("save", function (next) {
    // replace space with hyphen and lowercase
    const newTags: string[] = [];
    this.tags.forEach((tag) =>
        newTags.push(tag.replace(" ", "-")?.toLowerCase())
    );
    this.tags = newTags;

    next();
});

/* create store schema model */
const Store: any = model<IStore>("Store", storeSchema);

/* export store model */
export default Store;
