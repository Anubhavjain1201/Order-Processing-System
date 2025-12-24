import express from "express"
import cors from "cors"
import { customErrorHandler } from "./middlewares/customErrorHandler.middlewares.js"

const app = express()

app.use(express.json())
app.use(cors())

import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"

app.use("/api/health", healthCheckRouter)
app.use("/api/auth", authRouter)

app.use(customErrorHandler)
export default app
