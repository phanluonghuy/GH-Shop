/* external imports */
import mongoose, {Document, Schema, model} from "mongoose";
import validator from "validator";
import Review from "./reviewModel";
import Category from "./categoryModel";
import Brand from "./brandModel";
import Store from "./storeModel";
import User from "./userModel";

/* create product schema interface */
interface IProduct extends Document {
    title: string;
    summary: string;
    thumbnail: {
        url: string;
        public_id: string;
    };
    gallery: {
        url: string;
        public_id: string;
    }[];
    features: {
        title: string;
        content: string[];
    }[];
    variations: {
        colors: string[];
        sizes: string[];
    };
    campaign: {
        title: string;
        state: "new-arrival" | "discount" | "sold-out" | "on-sale";
    };
    price: number;
    category: mongoose.Types.ObjectId;
    brand: mongoose.Types.ObjectId;
    store: mongoose.Types.ObjectId;
    buyers: mongoose.Types.ObjectId[];
    reviews: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;

    stock: {
        total: number;
        variations: {
            color: string;
            size: string;
            quantity: number;
        }[];
    };

    updateStock(
        variations: { color: string; size: string; quantity: number }[]
    ): Promise<void>;
}

/* create product schema */
const productSchema = new Schema<IProduct>(
    {
        // for title
        title: {
            type: String,
            required: [true, "Please, provide a product title"],
            trim: true,
            unique: true,
            maxLength: [100, "Your title would be at most 100 characters"],
        },

        // for summary
        summary: {
            type: String,
            required: [true, "Please, provide product summary"],
            trim: true,
            maxLength: [500, "Your summary would be at most 500 characters"],
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

        // for gallery
        gallery: {
            type: [
                {
                    url: {
                        type: String,
                        default: "https://placehold.co/296x200.png",
                        validate: [validator.isURL, "Please, provide a valid gallery photo URL"],
                    },
                    public_id: {
                        type: String,
                        default: "N/A",
                    },
                },
            ],
            validate: {
                validator: function (value: { url: string; public_id: string }[]) {
                    return value.length <= 5;
                },
                message: "Won't be able to add more than 5 gallery items",
            },
        },

        // for feature
        features: [
            {
                title: {
                    type: String,
                    required: [true, "Please, provide a feature title"],
                    maxLength: [100, "Your title would be at most 100 characters"],
                },
                content: {
                    type: [String],
                    required: [true, "Please, provide a feature content"],
                    maxLength: [200, "Your content would be at most 200 characters"],
                },
            },
        ],

        // for variations
        variations: {
            colors: [String],
            sizes: [String],
        },

        // for campaigns
        campaign: {
            title: {
                type: String,
                required: [true, "Please, provide a campaign title"],
            },
            state: {
                type: String,
                required: [true, "Please, provide a campaign state"],
                enum: ["new-arrival", "discount", "sold-out", "on-sale"],
            },
        },

        // for price
        price: {
            type: Number,
            required: [true, "Please, provide a product price"],
        },

        // for category
        category: {
            type: Schema.Types.ObjectId,
            ref: Category,
        },

        // for brand
        brand: {
            type: Schema.Types.ObjectId,
            ref: Brand,
        },

        // for store
        store: {
            type: Schema.Types.ObjectId,
            ref: Store,
        },

        // for buyers
        buyers: [
            {
                type: Schema.Types.ObjectId,
                ref: User,
            },
        ],

        // for reviews
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: Review,
            },
        ],

        // for stock
        stock: {
            total: {
                type: Number,
                required: [true, "Please, provide total stock"],
                default: 0,
            },
            variations: [
                {
                    color: String,
                    size: String,
                    quantity: {
                        type: Number,
                        required: [true, "Please, provide stock quantity"],
                        default: 0,
                    },
                },
            ],
        },


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

/* update stock method */
productSchema.methods.updateStock = async function (
    variations: { color: string; size: string; quantity: number }[]
) {
    // Iterate over all variations
    for (const variation of variations) {
        const stockVariant = this.stock.variations.find(
            (v: any) => v.color === variation.color && v.size === variation.size
        );

        if (stockVariant) {
            // If variant exists, add to the existing quantity
            stockVariant.quantity += variation.quantity;  // Add stock to existing
        } else {
            // If variant doesn't exist, create a new one with the quantity
            this.stock.variations.push({
                color: variation.color,
                size: variation.size,
                quantity: variation.quantity,
            });
        }
    }

    // Recalculate the total stock after updates
    this.stock.total = this.stock.variations.reduce(
        (acc: number, v: { quantity: number }) => acc + v.quantity,
        0
    );

    await this.save();
};


/* create product model */
const Product = model<IProduct>("Product", productSchema);

/* export product model */
export default Product;