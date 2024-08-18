import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
        },
        location :{
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["dealer", "admin"],
            default : "dealer"
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        cars: [{ type: mongoose.Types.ObjectId, ref: "Car" }],
    },
    { timestamps: true }
);

export const Dealer = mongoose.model("Dealer", dealerSchema);