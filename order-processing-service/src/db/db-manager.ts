import mongoose from "mongoose"

async function connectDb(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || "100"),
            minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || "10")
        })
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error(`Error occurred while connecting to MongoDB: ${error}`)
    }
}

export { connectDb }
