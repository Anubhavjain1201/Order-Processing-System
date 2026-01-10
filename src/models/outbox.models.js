import mongoose, { Schema } from "mongoose"
import { OUTBOX_EVENT_TYPE, OUTBOX_MESSAGE_STATUS } from "../utils/constants.js"

const outboxSchema = new Schema(
    {
        // Message status
        status: {
            type: String,
            enum: [
                OUTBOX_MESSAGE_STATUS.PENDING,
                OUTBOX_MESSAGE_STATUS.PROCESSED,
                OUTBOX_MESSAGE_STATUS.FAILED
            ],
            default: OUTBOX_MESSAGE_STATUS.PENDING
        },

        // Payload for queue
        payload: {
            type: Object,
            required: true
        },

        // Type of event
        eventType: {
            type: String,
            required: true,
            enum: [OUTBOX_EVENT_TYPE.ORDER_CREATED]
        }
    },
    { timestamps: true }
)

export const Outbox = mongoose.model("Outbox", outboxSchema)
