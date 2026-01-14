import { Order } from "../models/order.models.js"
import type { MessageBodyType } from "../types/sqsMessage.types.js"
import { ORDER_STATUS } from "../utils/constants.js"

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

            // update email sent flag
            order.emailSent = true
            await order.save()
            console.log(
                `MessageProcessingService - Email sent successfully for orderId: ${messageBody.orderId}`
            )
        }

        console.log(
            `MessageProcessingService - Order: ${messageBody.orderId} processed successfully`
        )
    }
}

export default new MessageProcessingService()
