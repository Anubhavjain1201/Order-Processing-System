import type { Request, Response } from "express"
import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"

const healthCheck = asyncHandler(async (_: Request, res: Response) => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("HealthCheckController - System health status: OK")
            return res.status(200).json({ status: "UP" })
        } else {
            console.log(
                "HealthCheckController - System health status: Unable to connect to database"
            )
            return res.status(503).json({ status: "Error" })
        }
    } catch (error) {
        console.log(
            `HealthCheckController - Error occurred while checking db status: ${error}`
        )
        return res.status(503).json({ status: "Error" })
    }
})

export { healthCheck }
