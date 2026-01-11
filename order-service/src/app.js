import express from "express"
import cors from "cors"
import { customErrorHandler } from "./middlewares/customErrorHandler.middlewares.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import orderRouter from "./routes/order.routes.js"

app.use("/api/health", healthCheckRouter)
app.use("/api/auth", authRouter)
app.use("/api/orders", orderRouter)

app.use(customErrorHandler)
export default app
