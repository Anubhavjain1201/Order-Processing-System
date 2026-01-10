import { SQSClient } from "@aws-sdk/client-sqs"

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.LOCALSTACK_ENDPOINT
})

export { sqsClient }
