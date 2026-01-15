import { body } from "express-validator"

const registerUserRules = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("email is invalid"),

    body("password")
        .notEmpty()
        .withMessage("password is required")
        .bail()
        .isStrongPassword()
        .withMessage("Use a strong password"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .bail()
        .isAlphanumeric()
        .withMessage("username must be alphanumeric")
        .isLength({ min: 3, max: 20 })
        .withMessage("username must be between 3-20 characters")
]

const loginUserRules = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("email is invalid"),

    body("password").notEmpty().withMessage("password is required")
]

export { registerUserRules, loginUserRules }
