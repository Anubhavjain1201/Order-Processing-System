import mongoose, { Schema, type InferSchemaType } from "mongoose"

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

export type UserType = InferSchemaType<typeof userSchema>
export const User = mongoose.model("User", userSchema)
