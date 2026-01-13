import { Consumer, type ConsumerOptions } from "sqs-consumer"
import { sqsClient } from "../config/sqs-client.js"
import { env } from "../config/env.js"

const consumerOptions: ConsumerOptions = {
    // SQS queue URL
    queueUrl: env.SQS_QUEUE_URL,

    // specify the sqsClient
    sqs: sqsClient,

    // enable long polling
    waitTimeSeconds: 20,

    // message visibility timeout
    visibilityTimeout: env.VISIBILITY_TIMEOUT,

    // Process messages in batches
    batchSize: env.BATCH_SIZE

    // async function to handle message received from SQS
    // handleMessage:,
}
const consumer = Consumer.create(consumerOptions)

export default consumer
