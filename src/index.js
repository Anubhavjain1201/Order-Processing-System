import app from "./app.js"
import dotenv from "dotenv"
import { connectDb } from "./db/db-manager.js"

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running and listening on ${port}...`)
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB")
        process.exit(1)
    })
