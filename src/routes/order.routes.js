import { Router } from "express"
import authMiddleware from "../middlewares/auth.middlewares.js"
import {
    createOrder,
    getOrderDetails
} from "../controllers/order.controllers.js"

const orderRouter = Router()

// protected routes
orderRouter.route("/").post(authMiddleware, createOrder)
orderRouter.route("/:id").get(authMiddleware, getOrderDetails)

export default orderRouter
