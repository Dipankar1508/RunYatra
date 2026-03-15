const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        tournamentCode: {
            type: String,
            unique: true,
            required: true,
            uppercase: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        location: String,

        startDate: Date,

        endDate: Date,

        teams: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        }],

        rules: {
            oversPerMatch: {
                type: Number,
                default: 20,
                required: true
            },

            playersPerTeam: {
                type: Number,
                default: 11,
                required: true
            },

            maxTeams: {
                type: Number,
                default: 8,
                required: true
            },
        },

        joinCodes: [{
            code: {
                type: String,
                required: true
            },
            used: {
                type: Boolean,
                default: false
            }
        }],

        scheduleGenerated: {
            type: Boolean,
            default: false
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        },

        status: {
            type: String,
            enum: ["upcoming", "live", "completed"],
            default: "upcoming"
        }

    },
    { timestamps: true }
);

tournamentSchema.index({ createdBy: 1 });
tournamentSchema.index({ "joinCodes.code": 1 });
// tournamentSchema.index({ tournamentCode: 1 }, { unique: true });

module.exports = mongoose.model("Tournament", tournamentSchema);