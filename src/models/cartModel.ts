import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem{
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document{
    userId: string;
    items: ICartItem[];
    createdAt?: Date;
    updatedAt?: Date; 
}

const cartItemSchema: Schema<ICartItem> = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        timestamps: true
    }
)


const cartSchema: Schema<ICart> = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        items: [cartItemSchema]
    },
    {
        timestamps: true
    }
)

export const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema)
export const Cart = mongoose.model<ICart>("Cart", cartSchema)