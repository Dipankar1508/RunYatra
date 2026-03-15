const mongoose = require("mongoose");
const matchSchema = new mongoose.Schema({

    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        required: true
    },

    teamA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    teamB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    matchNumber: Number,

    round: {
        type: String,
        enum: ["group", "quarter_final", "semi_final", "final"],
        default: "group"
    },

    overs: {
        type: Number,
        default: 20
    },

    date: Date,

    venue: String,

    status: {
        type: String,
        enum: ["scheduled", "live", "completed"],
        default: "scheduled"
    },

    winningTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },

    losingTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },


    teamARuns: {
        type: Number,
        default: 0
    },

    teamAOvers: {
        type: Number,
        default: 0
    },

    teamAAllOut: {
        type: Boolean,
        default: false
    },

    teamBRuns: {
        type: Number,
        default: 0
    },
    teamBOvers: {
        type: Number,
        default: 0
    },
    teamBAllOut: {
        type: Boolean,
        default: false
    },

    result: {
        type: String,
        enum: ["teamA", "teamB", "draw", "no_result"],
        default: null
    },
    resultSummary: {
        type: String,
        trim: true
    }

}, { timestamps: true });

matchSchema.pre("save", function () {

    if (this.teamA && this.teamB && this.teamA.toString() === this.teamB.toString()) {
        throw new Error("A team cannot play against itself");
    }

});


matchSchema.index({ tournament: 1 });

module.exports = mongoose.model("Match", matchSchema);