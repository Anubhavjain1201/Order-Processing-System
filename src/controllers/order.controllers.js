import { asyncHandler } from "../utils/asyncHandler.js"
import OrderService from "../services/order.services.js"

// Create order API
const createOrder = asyncHandler(async (req, res) => {
    console.log("OrderController - CreateOrder - Starting order creation")

    // Extract items from request
    const { items } = req.body
    const userId = req.user._id

    // Create order
    const { orderId, totalOrderValue } = await OrderService.createOrder(
        items,
        userId
    )

    console.log("OrderController - CreateOrder - Order created")
    return res.status(201).json({
        message: "Order created successfully",
        orderId: orderId,
        totalAmount: totalOrderValue
    })
})

// Get order details API
const getOrderDetails = asyncHandler(async (req, res) => {
    // Extract the order Id
    const { id } = req.params
    console.log(`OrderController - GetOrderDetails - Getting order details`)

    // Fetch order details
    const order = await OrderService.fetchOrderDetails(id, req.user._id)

    console.log(`OrderController - GetOrderDetails - Fetched order details`)
    return res.status(200).json({
        orderId: order._id,
        userId: order.userId,
        status: order.status,
        dateOfOrder: order.orderDate,
        totalAmount: order.totals.grand_total,
        items: order.items.map((item) => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.price_at_purchase,
            quantity: item.quantity
        }))
    })
})

export { createOrder, getOrderDetails }
