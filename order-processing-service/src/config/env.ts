import { z } from "zod"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

const envSchema = z.object({
    PORT: z.coerce.number().int().default(8010),

    // MongoDB variables
    MONGO_URI: z.url(),
    MAX_POOL_SIZE: z.coerce.number().int().positive().default(100),
    MIN_POOL_SIZE: z.coerce.number().int().positive().default(10),

    // AWS configuration variables
    AWS_REGION: z.string().default("ap-south-1"),

    // LocalStack variables
    LOCALSTACK_ENDPOINT: z.url(),

    // SQS variables
    SQS_QUEUE_URL: z.url(),

    // SQS Consumer variables
    VISIBILITY_TIMEOUT: z.coerce.number().int().positive().default(300), // default: 5 minutes
    BATCH_SIZE: z.coerce.number().int().positive().default(1),

    // Mailtrap variables
    MAILTRAP_SMTP_HOST: z.string().default("sandbox.smtp.mailtrap.io"),
    MAILTRAP_SMTP_PORT: z.coerce.number().int().default(2525),
    MAILTRAP_SMTP_USER: z.string(),
    MAILTRAP_SMTP_PASS: z.string()
})

export const env = envSchema.parse(process.env)
