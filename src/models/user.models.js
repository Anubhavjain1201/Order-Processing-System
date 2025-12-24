import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// pre-hooks
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

// methods
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            scope: "orders"
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "15m",
            issuer: "identity.orderproc.com",
            subject: this._id.toString()
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            scope: "refresh"
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "5d",
            issuer: "identity.orderproc.com"
        }
    )
}

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)
