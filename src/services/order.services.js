import { Order } from "../models/order.models.js"
import { Outbox } from "../models/outbox.models.js"
import { Product } from "../models/product.models.js"
import CustomError from "../utils/customError.js"
import mongoose from "mongoose"

class OrderService {
    // Create order for a user
    async createOrder(items, userId) {
        // validate items input
        if (!items || items.length == 0) {
            console.log(
                "OrderService - createOrder - No items provided for the order"
            )
            throw new CustomError(400, "No items provided for the order")
        }

        // Use session since its a distributed transaction
        const session = await mongoose.startSession()

        try {
            let newOrderResult

            // Use withTransaction to handle transaction lifecycle
            await session.withTransaction(async () => {
                let subTotal = 0
                const orderItems = []

                for (const item of items) {
                    const product = await this.validateItem(item, session)

                    // Calculate line total for this item
                    subTotal += product.price * item.quantity

                    // Push formatted item into our array (Snapshotting the price!)
                    orderItems.push({
                        productId: product._id,
                        price_at_purchase: product.price,
                        quantity: item.quantity
                    })

                    // update the stock inventory for the product
                    product.quantity -= item.quantity
                    await product.save({ session })
                }

                // Calculate final totals
                const { totalTax, grandTotal } = this.#calculateTotals(subTotal)

                const createdOrders = await Order.create(
                    [
                        {
                            userId: userId,
                            items: orderItems,
                            totals: {
                                sub_total: subTotal,
                                tax: totalTax,
                                grand_total: grandTotal
                            }
                        }
                    ],
                    { session }
                )

                newOrderResult = createdOrders[0]

                // Create an outbox table entry using the same session
                await Outbox.create([{}], { session })
            })

            console.log(
                `OrderService - createOrder - Order submitted successfully with id: ${newOrderResult?._id}`
            )
            return {
                orderId: newOrderResult?._id,
                totalOrderValue: newOrderResult?.totals?.grand_total
            }
        } catch (error) {
            console.error(
                `OrderService - createOrder - Order creation failed with error: ${error}`
            )

            if (error instanceof CustomError) throw error
            else throw new CustomError(400, "Order couldn't be processed")
        } finally {
            // clean up the session
            console.log("OrderService - createOrder - cleaning up the session")
            session.endSession()
        }
    }

    // Get order details for a user
    async fetchOrderDetails(orderId, userId) {
        console.log(
            `OrderService - fetchOrderDetails - Fetching order details for id: ${orderId}`
        )

        // Validate orderId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.log(
                `OrderService - fetchOrderDetails - Invalid id format: ${orderId}`
            )
            throw new CustomError(400, "Invalid order id")
        }

        // Validate orderId in the database
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

    async validateItem(item, session) {
        // fetch product from db
        const product = await Product.findById(item.productId).session(session)
        if (!product) {
            console.log(
                `OrderService - validateItem - Product not found: ${item.productId}`
            )
            throw new CustomError(400, `Product not found: ${item.productId}`)
        }

        // Validate product inventory
        if (product.quantity < item.quantity) {
            console.log(
                `OrderService - validateItem - Insufficient stock for product: ${product._id}`
            )
            throw new CustomError(
                400,
                `Insufficient stock for product: ${product._id}`
            )
        }

        return product
    }

    #calculateTotals(subTotal) {
        const taxRate = 0.18 // 18% tax (Ideally store per-product tax in DB)
        const totalTax = subTotal * taxRate
        const grandTotal = subTotal + totalTax

        return {
            totalTax,
            grandTotal
        }
    }
}

export default new OrderService()
