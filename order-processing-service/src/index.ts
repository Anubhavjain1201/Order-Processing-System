import dotenv from "dotenv"
import { connectDb } from "./db/db-manager.js"
import initConsumerJob from "./worker/consumer.js"

dotenv.config({
    path: "./.env"
})

connectDb()
    .then(() => {
        // intialize consumer job
        initConsumerJob()

        console.log(`order-processing-service is up and running`)
    })
    .catch((error) => {
        console.log(
            `Error occurred while starting the order-processing-service: ${error}`
        )
        process.exit(1)
    })
