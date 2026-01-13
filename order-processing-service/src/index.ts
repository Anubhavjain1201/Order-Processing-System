import { connectDb } from "./db/db-manager.js"
import consumer from "./worker/consumer.js"

connectDb()
    .then(() => {
        // start the consumer
        consumer.start()

        console.log(`order-processing-service is up and running`)
    })
    .catch((error) => {
        console.log(
            `Error occurred while starting the order-processing-service: ${error}`
        )
        process.exit(1)
    })
