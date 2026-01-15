import { SQSClient, type SQSClientConfig } from "@aws-sdk/client-sqs"
import { env } from "./env.js"

const sqsClientConfig: SQSClientConfig = {
    region: env.AWS_REGION,
    endpoint: env.LOCALSTACK_ENDPOINT
}

const sqsClient = new SQSClient(sqsClientConfig)

export { sqsClient }
