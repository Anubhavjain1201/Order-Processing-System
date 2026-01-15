import mongoose, { Schema } from "mongoose"
import { ORDER_STATUS } from "../utils/constants.js"

const orderItemSchema = new Schema({
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product",
        required: true
    },
    price_at_purchase: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
})
const orderSchema = new Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "User"
        },
        items: [orderItemSchema],
        status: {
            type: String,
            enum: [
                ORDER_STATUS.PENDING,
                ORDER_STATUS.PROCESSING,
                ORDER_STATUS.PROCESSED,
                ORDER_STATUS.FAILED
            ],
            default: ORDER_STATUS.PENDING
        },
        totals: {
            sub_total: {
                type: Number,
                required: true
            },
            tax: {
                type: Number,
                required: true
            },
            grand_total: {
                type: Number,
                required: true
            }
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        emailSent: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", orderSchema)
