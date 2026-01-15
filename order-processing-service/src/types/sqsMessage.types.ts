import { Types } from "mongoose"
import { z } from "zod"

const objectId = z.string().refine((val) => {
    return Types.ObjectId.isValid(val)
})

// SQS message body schema
export const MessageBodySchema = z.object({
    orderId: objectId,
    userId: objectId
})

export type MessageBodyType = z.infer<typeof MessageBodySchema>
