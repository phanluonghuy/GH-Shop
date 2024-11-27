import mongoose, { Schema, Document, Types } from "mongoose";
import validator from "validator";

/* Address subdocument schema interface */
interface IAddress extends Document {
  primary: boolean;
  city: string;
  district: string;
  street: string;
  zipCode: string;
  contactNumber: string;
}

/* Address subdocument schema */
const addressSchema = new Schema<IAddress>(
  {
    primary: {
      type: Boolean,
      default: false,
    },
    city: {
      type: String,
      default: "N/A",
    },
    district: {
      type: String,
      default: "N/A",
    },
    street: {
      type: String,
      default: "N/A",
    },
    zipCode: {
      type: String,
      default: "N/A",
    },
    contactNumber: {
      type: String,
      default: "N/A",
      validate: {
        validator: (value: string) =>
          value === "N/A" || validator.isMobilePhone(value, "vi-VN", { strictMode: true }),
        message:
          "Phone number {VALUE} is not valid. Please, retry like +84xxxxxxxxx",
      },
    },
  },
  { _id: false } // Prevent automatic `_id` generation for this subdocument
);

const Address = mongoose.model<IAddress>("Address", addressSchema);
/* Export Address model */
export default Address;
export { IAddress, addressSchema };
