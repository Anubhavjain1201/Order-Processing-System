import mongoose, { Schema } from "mongoose"

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        category: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)
