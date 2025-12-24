import { Router } from "express"
import { register } from "../controllers/auth.controllers.js"

const authRouter = Router()

authRouter.route("/register").post(register)
// authRouter.route("/login").post()
// authRouter.route("/refresh").post()

export default authRouter
