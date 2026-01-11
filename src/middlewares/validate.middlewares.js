import { validationResult } from "express-validator"

const validate = (req, res, next) => {
    // catch validation errors
    const errors = validationResult(req)

    // If no errors, call the next middleware
    if (errors.isEmpty()) return next()

    const errorMap = errors.array().map((err) => ({
        field: err.path,
        message: err.msg
    }))

    return res.status(400).json({
        message: "Invalid input data",
        errors: errorMap
    })
}

export default validate
