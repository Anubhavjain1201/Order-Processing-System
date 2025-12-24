import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import CustomError from "../utils/customError.js"

// Register user API
const register = asyncHandler(async (req, res) => {
    console.log("AuthController - Register user - Starting user registration")

    const { username, email, password } = req.body

    // Check if the user already exists with the given email
    const isExistingUser = await User.findOne({ email })
    if (isExistingUser) {
        console.log("AuthController - Register user - user already exists")
        throw new CustomError(400, "A user with the given email already exists")
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
const login = asyncHandler(async (req, res) => {})

// refresh token API
const refreshToken = asyncHandler(async (req, res) => {})

export { register, login, refreshToken }
