import mongoose from "mongoose"
import { env } from "../config/env.js"

async function connectDb(): Promise<void> {
    try {
        await mongoose.connect(env.MONGO_URI, {
            maxPoolSize: env.MAX_POOL_SIZE,
            minPoolSize: env.MIN_POOL_SIZE
        })
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error(`Error occurred while connecting to MongoDB: ${error}`)
    }
}

export { connectDb }
