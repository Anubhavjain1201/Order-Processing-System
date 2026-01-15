import { body, param } from "express-validator"

const createOrderRules = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("Order must contain atleast one item")
]

const getOrderDetailsRules = [
    param("id")
        .notEmpty()
        .withMessage("order id is required")
        .isMongoId()
        .withMessage("Invalid order id")
]

export { createOrderRules, getOrderDetailsRules }
