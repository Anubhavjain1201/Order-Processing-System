import { Consumer, type ConsumerOptions } from "sqs-consumer"
import { sqsClient } from "../config/sqs-client.js"
import { env } from "../config/env.js"
import type { Message } from "@aws-sdk/client-sqs"
import {
    MessageBodySchema,
    type MessageBodyType
} from "../types/sqsMessage.types.js"
import MessageProcessingService from "../services/messageProcessing.services.js"

// Function to handle and process SQS message
const handleSQSMessage = async (
    message: Message
): Promise<Message | undefined> => {
    try {
        // If message has no body, return message and delete from queue
        if (!message?.Body) {
            console.log("Consumer - Message body is empty, nothing to process!")
            return message
        }

        // sanitize message body
        const validatedBody: MessageBodyType = MessageBodySchema.parse(
            message.Body
        )

        // process message
        await MessageProcessingService.processSQSMessage(validatedBody)
        return message
    } catch (error) {
        console.log(
            `Consumer - Error occurred while processing message: ${message?.MessageId} : ${error}`
        )
        return undefined
    }
}

const consumerOptions: ConsumerOptions = {
    queueUrl: env.SQS_QUEUE_URL,
    sqs: sqsClient,
    waitTimeSeconds: 20,
    visibilityTimeout: env.VISIBILITY_TIMEOUT,
    batchSize: env.BATCH_SIZE,
    handleMessage: handleSQSMessage
}
const consumer = Consumer.create(consumerOptions)

// Handle consumer events
consumer.on("message_processed", (message: Message) => {
    console.log(`Consumer - Message processed event - ${message.MessageId}`)
})

consumer.on("message_received", (message: Message) => {
    console.log(`Consumer - Message received event - ${message.MessageId}`)
})

consumer.on("error", (error) => {
    console.log(`Consumer - Error event - ${error}`)
})

consumer.on("processing_error", (error) => {
    console.log(`Consumer - Processing error event - ${error}`)
})

consumer.on("timeout_error", (error) => {
    console.log(`Consumer - Timeout error event - ${error}`)
})

consumer.on("empty", () => {
    console.log("Consumer - Empty event - Queue is empty. Nothing to process!")
})

consumer.on("started", () => {
    console.log("Consumer - Started event - Consumer started")
})

consumer.on("stopped", () => {
    console.log("Consumer - Stopped event - Consumer stopped")
})

export default consumer
