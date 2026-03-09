const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "organizer", "user"],
            default: "user",
        },

        // ✅ Subscription only meaningful for organizer
        subscription: {
            plan: {
                type: String,
                enum: ["free", "pro"],
                default: "free",
            },

            tournamentLimit: {
                type: Number,
                default: 5, // Free organizers can create 5 tournaments
            },

            tournamentsUsed: {
                type: Number,
                default: 0,
            },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);


module.exports = User;