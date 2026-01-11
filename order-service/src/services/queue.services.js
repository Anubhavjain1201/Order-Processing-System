import { SendMessageCommand } from "@aws-sdk/client-sqs"
import { sqsClient } from "../config/sqs-client.js"

class QueueService {
    // Send message to SQS
    async sendMessage(msgPayload) {
        console.log(
            `QueueService - Pushing orderId: ${msgPayload?.orderId} to SQS`
        )

        try {
            // define parameters
            const params = {
                QueueUrl: process.env.SQS_QUEUE_URL,
                MessageBody: JSON.stringify(msgPayload)
            }
            // create send command
            const sendCommand = new SendMessageCommand(params)
            const response = await sqsClient.send(sendCommand)

            console.log(
                `QueueService - orderId: ${msgPayload?.orderId} pushed to SQS, response message Id: ${response.MessageId}`
            )
        } catch (error) {
            console.log(
                `QueueService - Error occurred while pushing orderId: ${msgPayload?.orderId} to SQS: ${error}`
            )
            throw new Error(`Pushing orderId: ${msgPayload?.orderId} failed`)
        }
    }
}

export default new QueueService()
