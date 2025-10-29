import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document{
    name: string;
    image?: string;
    price: number;
    description: string;
    stock?: number;
}


const productSchema: Schema<IProduct> = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        stock: {
            type: Number,
            default: 10
        }
    },
    {
        timestamps: true
    }
)


export const Product = mongoose.model<IProduct>("Product", productSchema);