// models/loyaltySchema.js
const mongoose = require("mongoose");

const loyaltySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // يفترض وجود نموذج للمستخدمين
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: ["Bronze", "Silver", "Gold", "Platinum"],
        default: "Bronze"
    },
    history: [{
        type: {
            type: String,
            enum: ["Booking", "Review", "Purchase"],
            required: true
        },
        pointsChange: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Loyalty = mongoose.model("Loyalty", loyaltySchema);

module.exports = Loyalty;
