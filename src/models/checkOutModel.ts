import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICheckout extends Document {
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  total: number;
  name: string;
  email: string;
  timestamp: Date;
}

const checkoutSchema = new Schema<ICheckout>({
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Checkout = mongoose.model<ICheckout>("Checkout", checkoutSchema);
