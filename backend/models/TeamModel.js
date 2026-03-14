
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    players: [
        {
            _id: false,
            name: {
                type: String,
                required: true,
                trim: true,
            },

            role: {
                type: String,
                enum: ["batsman", "bowler", "allrounder", "wicketkeeper"],
                default: "batsman",
            },

            age: Number,

            gender: {
                type: String,
                enum: ["male", "female", "other"],
                default: "male",
            },

            jerseyNumber: {
                type: Number,
                min: 1,
                max: 999,
                default: () => Math.floor(Math.random() * 100) + 1

            },

            battingStyle: {
                type: String,
                enum: ["right-hand", "left-hand"],
                default: "right-hand",
            },

            bowlingStyle: {
                type: String,
                enum: ["fast", "medium", "spin"],
                default: "medium",
            }
        }
    ],

    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament"
    }

}, { timestamps: true });

teamSchema.index({ name: 1, tournament: 1 }, { unique: true });

module.exports = mongoose.model("Team", teamSchema);
