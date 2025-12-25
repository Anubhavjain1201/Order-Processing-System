import mongoose from "mongoose"
import { Order } from "../models/order.models.js"
import { Product } from "../models/product.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import CustomError from "../utils/customError.js"

const createOrder = asyncHandler(async (req, res) => {
    console.log("OrderController - CreateOrder - Starting order creation")
    const { items } = req.body
    const userId = req.user._id

    if (!items || items.length == 0) {
        console.log(
            "OrderController - CreateOrder - No items provided for the order"
        )
        throw new CustomError(400, "No items provided for the order")
    }

    let subTotal = 0
    const orderItems = []

    for (const item of items) {
        const product = await Product.findById(item.productId)
        if (!product) {
            console.log(
                `OrderController - CreateOrder - Product not found: ${item.productId}`
            )
            throw new CustomError(400, `Product not found: ${item.productId}`)
        }

        // Validate product inventory
        if (product.quantity < item.quantity) {
            console.log(
                `OrderController - CreateOrder - Insufficient stock for product: ${product._id}`
            )
            throw new CustomError(
                400,
                `Insufficient stock for product: ${product._id}`
            )
        }

        // Calculate line total for this item
        const itemTotal = product.price * item.quantity
        subTotal += itemTotal

        // Push formatted item into our array (Snapshotting the price!)
        orderItems.push({
            productId: product._id,
            price_at_purchase: product.price,
            quantity: item.quantity
        })

        product.quantity -= item.quantity
        await product.save()
    }

    const taxRate = 0.18 // 18% tax
    const totalTax = subTotal * taxRate
    const grandTotal = subTotal + totalTax

    const newOrder = await Order.create({
        userId: userId,
        items: orderItems,
        totals: {
            sub_total: subTotal,
            tax: totalTax,
            grand_total: grandTotal
        }
    })

    console.log("OrderController - CreateOrder - Created a new order")
    return res.status(201).json({
        message: "Order created successfully",
        orderId: newOrder._id,
        totalAmount: grandTotal
    })
})

const getOrderDetails = asyncHandler(async (req, res) => {
    // Extract the order Id
    const { id } = req.params
    console.log(
        `OrderController - GetOrderDetails - Fetching order details for the id: ${id}`
    )

    // Validate id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("OrderController - GetOrderDetails - Invalid id format")
        throw new CustomError(400, "Invalid order id")
    }

    // Get order details
    const order = await Order.findById(id).populate("items.productId", "name")
    if (!order) {
        console.log(
            `OrderController - GetOrderDetails - No order found with id: ${id}`
        )
        throw new CustomError(400, "Invalid order id")
    }

    console.log(
        `OrderController - GetOrderDetails - Fetched order details for the id: ${id}`
    )
    res.status(200).json({
        orderId: order._id,
        userId: order.userId,
        status: order.status,
        dateOfOrder: order.orderDate,
        totalAmount: order.totals.grand_total,
        items: order.items.map((item) => ({
            productId: item.productId,
            name: item.productId.name,
            price: item.price_at_purchase,
            quantity: item.quantity
        }))
    })
})

export { createOrder, getOrderDetails }
