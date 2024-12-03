/* external imports */
import mongoose, {Document, model, Schema} from "mongoose";

/* create review schema interface */
interface IReview extends Document {
    reviewer: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

/* create review schema */
const reviewSchema = new Schema<IReview>(
    {
        // for reviewer
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // for product
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        // for rating
        rating: {
            type: Number,
            required: [true, "Please, provide a rating"],
            min: 1,
            max: 5,
        },

        // for comment
        comment: {
            type: String,
            required: [true, "Please, provide a comment"],
            maxLength: [200, "Your comment should be at most 200 characters"],
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
    {timestamps: true}
);

/* create review model */
const Review = model<IReview>("Review", reviewSchema);

/* export Review model */
export default Review;