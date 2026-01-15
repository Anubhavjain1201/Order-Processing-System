import express from "express"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import healthCheckRouter from "./routes/healthCheck.routes.js"

app.use("/processor/api/health", healthCheckRouter)

export default app
