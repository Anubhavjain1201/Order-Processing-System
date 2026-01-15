import { Order } from "../models/order.models.js"
import type { UserType } from "../models/user.models.js"
import type { OrderItemsPopulated } from "../types/order.types.js"
import type { MessageBodyType } from "../types/sqsMessage.types.js"
import { ORDER_STATUS } from "../utils/constants.js"
import emailServices from "./email.services.js"

class MessageProcessingService {
    /**
     * Processes message received from SQS
     * @param message Message received from SQS
     */
    async processSQSMessage(messageBody: MessageBodyType): Promise<void> {
        console.log(
            `MessageProcessingService - Processing order: ${messageBody.orderId}`
        )

        // validate orderId and fetch order
        const order = await Order.findById(messageBody.orderId)
            .populate<{ userId: UserType }>("userId", "username email")
            .populate<{
                items: OrderItemsPopulated[]
            }>("items.productId", "name")
        if (!order) {
            console.log(
                `MessageProcessingService - Invalid orderId: ${messageBody.orderId}`
            )
            return
        }

        // idempotency Check 1: If order is not processed, update it
        if (order && order.status !== ORDER_STATUS.PROCESSED) {
            order.status = ORDER_STATUS.PROCESSED
            await order.save()
            console.log(
                `MessageProcessingService - Status updated for orderId: ${messageBody.orderId}`
            )
        }

        // idempotency Check 2: If email isn't sent, send the email
        if (order && !order.emailSent) {
            // send email
            const emailOptions = emailServices.prepareEmailOptions(order)
            await emailServices.sendEmail(emailOptions)

            // update email sent flag
            order.emailSent = true
            await order.save()
            console.log(
                `MessageProcessingService - Order confirmation email sent for orderId: ${messageBody.orderId}`
            )
        }

        console.log(
            `MessageProcessingService - Order: ${messageBody.orderId} processed successfully`
        )
    }
}

export default new MessageProcessingService()
