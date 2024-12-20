/* external imports */
import mongoose, {Document, model, ObjectId, Schema, Types} from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import {addressSchema, IAddress} from "./userAddressModel";

/* create user schema interface */
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        url: string;
        public_id: string;
    };
    phone: string;
    role: "admin" | "buyer" | "guest";
    status: "active" | "inactive";
    cart: ObjectId[];
    favorites: ObjectId[];
    reviews: ObjectId[];
    purchases: ObjectId[];
    store?: ObjectId;
    brand?: ObjectId;
    category?: ObjectId;
    products: ObjectId[];
    address: IAddress[];
    createdAt: Date;
    updatedAt: Date;
    loyaltyPoints: number;

    encryptedPassword(password: string): string;

    comparePassword(password: string, hash: string): boolean;

    earnPoints(orderValue: number): number;

    redeemPoints(points: number): number;
}

/* create user schema */
const userSchema = new Schema<IUser>(
    {
        // for full name
        name: {
            type: String,
            required: [true, "Please, provide your full name"],
            trim: true,
            maxLength: [100, "Your name would be at most 100 characters"],
        },

        // for email
        email: {
            type: String,
            required: [true, "Please, provide your email address"],
            validate: [validator.isEmail, "Provide a valid email address"],
            unique: true,
        },

        // for password
        password: {
            type: String,
            required: [true, "Please, provide a strong password"],
            validate: {
                validator: (value: string) =>
                    validator.isStrongPassword(value, {
                        minUppercase: 1,
                        minLowercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    }),
                message:
                    "Password {VALUE} should contain minimum 1 => uppercase, lowercase, number, and symbol",
            },
            minLength: [8, "Password should be at least 8 characters"],
            maxLength: [20, "Password should be at most 20 characters"],
        },

        // for avatar
        avatar: {
            url: {
                type: String,
                validate: [validator.isURL, "Please provide a valid avatar URL"],
                default: "https://placehold.co/300x300.png",
            },
            // porducts  =]]]
            public_id: {
                type: String,
                default: "N/A",
            },
        },

        // for contact number
        phone: {
            type: String,
            default: "N/A",
            validate: {
                validator: (value: string) => {
                    if (value === "N/A") return true;
                    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                    return value.match(regexPhoneNumber) ? true : false;
                },
                // value === "N/A" || validator.isMobilePhone(value, "vi-VN", { strictMode: true }),
                message:
                    "Phone number {VALUE} is not valid. Please, retry like 84xxxxxxxxx or 0xxxxxxxxx",
            },

            // type: String,
            // required: [
            //   true,
            //   "Please, provide your phone number, i.e.: +84xxxxxxxxx",
            // ],
            // default: "N/A",
            // validate: {
            //   validator: (value: string) =>
            //     value === "N/A" || validator.isMobilePhone(value, "vi-VN", { strictMode: true }),
            //   message:
            //     "Phone number {VALUE} is not valid. Please, retry like +84xxxxxxxxx",
            // },
            // unique: true,
        },

        // for role
        role: {
            type: String,
            enum: ["admin", "buyer", "guest"],
            default: "buyer",
        },

        // for account status
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        // for cart
        cart: [
            {
                type: Types.ObjectId,
                ref: "Cart",
            },
        ],

        // for wishlist
        favorites: [
            {
                type: Types.ObjectId,
                ref: "Favorite",
            },
        ],

        // for reviews
        reviews: [
            {
                type: Types.ObjectId,
                ref: "Review",
            },
        ],

        // for purchases
        purchases: [
            {
                type: Types.ObjectId,
                ref: "Purchase",
            },
        ],

        // for store creation
        store: {
            type: Types.ObjectId,
            ref: "Store",
        },

        // for brand creation
        brand: {
            type: Types.ObjectId,
            ref: "Brand",
        },

        // for category creation
        category: {
            type: Types.ObjectId,
            ref: "Category",
        },

        // for buying products
        products: [
            {
                type: Types.ObjectId,
                ref: "Product",
            },
        ],

        // for address
        // address: {
        //   type: String,
        //   default: "N/A",
        //   trim: true,
        //   maxLength: [500, "Your address would be at most 500 characters"],
        // },
        // avatar: {
        //   url: {
        //     type: String,
        //     validate: [validator.isURL, "Please provide a valid avatar URL"],
        //     default: "https://placehold.co/300x300.png",
        //   },
        //   // porducts  =]]]
        //   public_id: {
        //     type: String,
        //     default: "N/A",
        //   },
        // },

        address: [addressSchema],

        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },


        loyaltyPoints: {
            type: Number,
            default: 0,
            validate: {
                validator: (value: number) => value >= 0,
                message: "Loyalty points cannot be negative",
            },
        },
    },
    {timestamps: true}
);

/* encrypted user account password */
userSchema.methods.encryptedPassword = function (password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
};

/* middleware to encrypt password */
userSchema.pre("save", async function (next) {
    try {
        // initialize encrypted password
        if (!this.isModified("password")) {
            return next();
        }

        // encrypt password
        this.password = this.encryptedPassword(this.password);
        //  console.log("Password encrypted successfully");
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});

/* compare passwords as sign in proportion */
userSchema.methods.comparePassword = function (
    password: string,
    hash: string
): boolean {
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
};

userSchema.methods.earnPoints = function (orderValue: number): number {
    const pointsEarned = Math.floor(orderValue * 0.05); // 5%
    this.loyaltyPoints += pointsEarned;
    return pointsEarned;
};

userSchema.methods.redeemPoints = function (points: number): number {
    if (this.loyaltyPoints < points) {
        throw new Error("Insufficient loyalty points");
    }

    const discountValue = points * 1000;
    this.loyaltyPoints -= points;
    return discountValue;
};


/* create user model schema */
const User = model<IUser>("User", userSchema);

/* export user schema */
export default User;
