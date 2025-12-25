import { SCOPES, TOKEN_ISSUER } from "../utils/constants.js"
import CustomError from "../utils/customError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"

// Auth middleware used to verify incoming jwt
const authMiddleware = asyncHandler(async function (req, res, next) {
    console.log("AuthMiddleware - Starting token authentication")
    // extract jwt
    const token =
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.cookies?.accessToken

    if (!token) {
        console.log("AuthMiddleware - No token found")
        throw new CustomError(401)
    }

    try {
        // validate signature and expiry
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY, {
            issuer: TOKEN_ISSUER
        })

        // verify scope
        if (decodedToken?.scope !== SCOPES.ACCESS_ORDER) {
            console.log(
                `AuthMiddleware - Invalid scope: ${decodedToken?.scope}`
            )
            throw new CustomError(401)
        }

        // verify subject
        const user = await User.findById(decodedToken?.sub)
        if (!user) {
            console.log(
                `AuthMiddleware - Invalid token subject: ${decodedToken?.sub}`
            )
            throw new CustomError(401)
        }

        console.log("AuthMiddleware - Token authentication passed")
        req.user = user
        next()
    } catch (error) {
        console.log(
            `AuthMiddleware - Token authentication failed due to: ${error}`
        )
        throw new CustomError(401)
    }
})

export default authMiddleware
