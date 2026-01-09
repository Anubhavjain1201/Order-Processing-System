import mongoose, { Schema } from "mongoose"

const outboxSchema = new Schema({}, { timestamps: true })

export const Outbox = mongoose.model("Outbox", outboxSchema)
