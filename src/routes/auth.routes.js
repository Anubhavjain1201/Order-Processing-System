import { Router } from "express"
import {
    login,
    refreshToken,
    register
} from "../controllers/auth.controllers.js"

const authRouter = Router()

authRouter.route("/register").post(register)
authRouter.route("/login").post(login)
authRouter.route("/refresh").post(refreshToken)

export default authRouter
