import app from "./app.js"
import dotenv from "dotenv"
import { connectDb } from "./db/db-manager.js"
import { initCronJobs } from "./worker/worker.js"

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000

connectDb()
    .then(() => {
        // Start cron jobs
        initCronJobs()

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running and listening on ${port}...`)
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB")
        process.exit(1)
    })
