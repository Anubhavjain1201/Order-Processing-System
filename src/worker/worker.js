import cron from "node-cron"

export const initCronJobs = () => {
    console.log("Worker - Initializing outbox processor cron job")

    // Trigger the job every minute
    cron.schedule("* * * * *", async () => {
        try {
            console.log(
                `Worker - Cron Tick - Processing outbox at: ${new Date().toISOString()}`
            )
            await processOutboxMessages()
        } catch (error) {
            console.error(
                `Worker - Cron error at ${new Date().toISOString()}: ${error}`
            )
        }
    })

    console.log("Worker - Cron jobs initialized")
}

const processOutboxMessages = async function () {}
