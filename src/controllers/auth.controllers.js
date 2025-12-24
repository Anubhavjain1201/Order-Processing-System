import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import CustomError from "../utils/customError.js"

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
    return res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

// refresh token API
const refreshToken = asyncHandler(async (req, res) => {})

const generateTokens = (user) => {}

export { register, login, refreshToken }
