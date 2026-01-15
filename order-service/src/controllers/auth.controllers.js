import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { SCOPES, TOKEN_ISSUER } from "../utils/constants.js"
import CustomError from "../utils/customError.js"
import jwt from "jsonwebtoken"

// Register user API
const register = asyncHandler(async (req, res) => {
    console.log("AuthController - Register user - Starting user registration")
    const { username, email, password } = req.body

    // Check if the user already exists with the given email/username
    const isExistingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (isExistingUser) {
        console.log("AuthController - Register user - user already exists")
        throw new CustomError(
            400,
            "A user with the given credentials already exists"
        )
    }

    // Create a user and save it in the database
    const user = await User.create({
        username: username,
        email: email,
        password: password
    })

    console.log("AuthController - Register user - User registered")
    return res.status(201).json({
        message: "User registered succesfully",
        userId: user._id
    })
})

// login user API
const login = asyncHandler(async (req, res) => {
    console.log("AuthController - Login user - Starting user login process")
    const { email, password } = req.body

    // Verify the credentials
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
        console.log("AuthController - Login user - Invalid email")
        throw new CustomError(400, "Invalid credentials")
    }

    const isPasswordValid = await existingUser.isPasswordValid(password)
    if (!isPasswordValid) {
        console.log("AuthController - Login user - Invalid password")
        throw new CustomError(400, "Invalid credentials")
    }

    // Generate tokens and save them to db
    const accessToken = existingUser.generateAccessToken()
    const refreshToken = existingUser.generateRefreshToken()

    existingUser.refreshToken = refreshToken
    await existingUser.save({ validateBeforeSave: false })

    console.log("AuthController - Login user - user logged in successfully")
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/api/auth/refresh"
        })
        .json({
            accessToken: accessToken,
            refreshToken: refreshToken
        })
})

// refresh token API
const refreshToken = asyncHandler(async (req, res) => {
    console.log("AuthController - Refresh token - Refreshing access token")

    const incomingRefreshToken = req.cookies?.refreshToken
    if (!incomingRefreshToken) {
        console.log(
            "AuthController - Refresh token - No refresh token found in the cookie"
        )
        throw new CustomError(401, "No refresh token supplied")
    }

    // Verify incoming refresh token
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.SECRET_KEY,
            {
                issuer: TOKEN_ISSUER
            }
        )

        // verify scope
        if (decodedToken?.scope !== SCOPES.REFRESH) {
            console.log(
                `AuthController - Refresh token - Invalid token scope: ${decodedToken?.scope}`
            )
            throw new CustomError(401, "Invalid token scope")
        }

        // verify subject
        const user = await User.findById(decodedToken?.sub)
        if (!user) {
            console.log(
                `AuthController - Refresh token - Invalid token subject: ${decodedToken?.sub}`
            )
            throw new CustomError(401, "Invalid token subject")
        }

        // Match the token from the database
        if (incomingRefreshToken !== user.refreshToken) {
            console.log("AuthController - Refresh token - Unexpected token")
            throw new CustomError(401, "Unexpected token")
        }

        // generate new tokens
        const accessToken = user.generateAccessToken()
        const newRefreshToken = user.generateRefreshToken()

        user.refreshToken = newRefreshToken
        await user.save({ validateBeforeSave: false })

        console.log(
            "AuthController - Refresh token - refreshed the access token"
        )
        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                path: "/api/auth/refresh"
            })
            .json({
                accessToken: accessToken,
                refreshToken: newRefreshToken
            })
    } catch (error) {
        console.log(
            `AuthController - Refresh token - Invalid refresh token, error: ${error}`
        )
        throw new CustomError(401, "Invalid refresh token")
    }
})

export { register, login, refreshToken }
