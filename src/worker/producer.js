import cron from "node-cron"
import { Outbox } from "../models/outbox.models.js"
import { OUTBOX_MESSAGE_STATUS } from "../utils/constants.js"

let isProcessing = false

export const initCronJobs = () => {
    console.log("Producer - Initializing outbox processor cron job")

    // Trigger the job every minute
    cron.schedule("* * * * *", async () => {
        if (isProcessing) {
            console.log("Producer - Previous job still processing")
            return
        }

        try {
            console.log(
                `Producer - Cron Tick - Processing outbox at: ${new Date().toISOString()}`
            )
            isProcessing = true
            await processOutboxMessages()
        } catch (error) {
            console.error(
                `Producer - Cron error at ${new Date().toISOString()}: ${error}`
            )
        } finally {
            // set isProcessing to false when job completed or threw error
            isProcessing = false
        }
    })

    console.log("Producer - Cron jobs initialized")
}

const processOutboxMessages = async function () {
    // find messages with pending state from outbox
    const messages = await Outbox.find({
        status: OUTBOX_MESSAGE_STATUS.PENDING
    }).limit(process.env.OUTBOX_PROCESSING_BATCH_SIZE)

    if (messages.length === 0) return

    for (const msg of messages) {
    }
}
