import express from "express"
import cors from "cors"
import { customErrorHandler } from "./middewares/customErrorHandler.js"

const app = express()

app.use(express.json())
app.use(cors())

import healthCheckRouter from "./routes/healthcheck.routes.js"

app.use("/api/health", healthCheckRouter)

app.use(customErrorHandler)
export default app
