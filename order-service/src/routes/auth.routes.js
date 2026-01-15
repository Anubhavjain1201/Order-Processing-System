import { Router } from "express"
import {
    login,
    refreshToken,
    register
} from "../controllers/auth.controllers.js"
import {
    loginUserRules,
    registerUserRules
} from "../validators/auth.validators.js"
import validate from "../middlewares/validate.middlewares.js"

const authRouter = Router()

authRouter.route("/register").post(registerUserRules, validate, register)
authRouter.route("/login").post(loginUserRules, validate, login)
authRouter.route("/refresh").post(refreshToken)

export default authRouter
