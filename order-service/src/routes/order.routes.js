import { Router } from "express"
import authMiddleware from "../middlewares/auth.middlewares.js"
import {
    createOrder,
    getOrderDetails
} from "../controllers/order.controllers.js"
import {
    createOrderRules,
    getOrderDetailsRules
} from "../validators/order.validators.js"
import validate from "../middlewares/validate.middlewares.js"

const orderRouter = Router()

// protected routes
orderRouter
    .route("/")
    .post(authMiddleware, createOrderRules, validate, createOrder)
orderRouter
    .route("/:id")
    .get(authMiddleware, getOrderDetailsRules, validate, getOrderDetails)

export default orderRouter
