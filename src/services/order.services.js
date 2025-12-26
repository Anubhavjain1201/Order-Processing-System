import { Order } from "../models/order.models.js"
import CustomError from "../utils/customError.js"

class OrderService {
    async createOrder() {}

    // Get order details for a user
    async fetchOrderDetails(orderId, userId) {
        console.log(
            `OrderService - fetchOrderDetails - Fetching order details for id: ${orderId}`
        )

        const order = await Order.findById(orderId).populate(
            "items.productId",
            "name"
        )
        if (!order) {
            console.log(
                `OrderService - fetchOrderDetails - No order found with id: ${orderId}`
            )
            throw new CustomError(400, "Invalid order id")
        }

        // Restrict orders to the user who is sending the request to prevent data leakage
        if (!order.userId.equals(userId)) {
            console.log(
                `OrderService - fetchOrderDetails - Invalid user for this order`
            )
            throw new CustomError(400, "Invalid order id")
        }

        console.log(
            `OrderService - fetchOrderDetails - Fetched order details for id: ${orderId}`
        )
        return order
    }
}

export default new OrderService()
