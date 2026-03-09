const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({

    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        required: true
    },

    matches: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
    }],

    generated: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

scheduleSchema.index({ tournament: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);