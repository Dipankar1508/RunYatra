const mongoose = require("mongoose");

const pointsTableSchema = new mongoose.Schema({

    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament"
    },

    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },

    played: {
        type: Number,
        default: 0
    },

    won: {
        type: Number,
        default: 0
    },

    lost: {
        type: Number,
        default: 0
    },

    points: {
        type: Number,
        default: 0
    },
    netrunrate: {
        type: Number,
        default: 0
    },

});

module.exports = mongoose.model("PointsTable", pointsTableSchema);