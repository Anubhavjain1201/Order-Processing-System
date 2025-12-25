import { asyncHandler } from "../utils/asyncHandler.js"

// Health check API
const healthCheck = asyncHandler(async (req, res) => {
    console.log("HealthCheckController - System health check: OK")
    return res.status(200).json({ status: "UP" })
})

export { healthCheck }
