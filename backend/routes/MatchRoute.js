const express = require("express");
const router = express.Router();

const Match = require("../models/MatchModel");
const Tournament = require("../models/TournamentModel");

const updatePointsTable = require("../services/PointService");

const protect = require("../middleware/authMiddleware");


/* ================= GET SINGLE MATCH ================= */

router.get("/:id", protect, async (req, res) => {

    try {

        const match = await Match.findById(req.params.id)
            .populate("teamA", "name")
            .populate("teamB", "name");

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        res.status(200).json(match);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= UPDATE MATCH RESULT ================= */

router.post("/:id/update-result", protect, async (req, res) => {

    try {

        const {
            result,
            resultSummary,
            teamARuns,
            teamAOvers,
            teamBRuns,
            teamBOvers
        } = req.body;

        const allowedResults = ["teamA", "teamB", "draw", "no_result"];

        if (!allowedResults.includes(result)) {
            return res.status(400).json({
                message: "Invalid result type"
            });
        }

        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        const tournament = await Tournament.findById(match.tournament);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        // only organizer can update
        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only organizer can update match results"
            });
        }

        if (match.status === "completed") {
            return res.status(400).json({
                message: "Match already completed"
            });
        }

        if (teamAOvers > match.overs || teamBOvers > match.overs) {
            return res.status(400).json({
                message: "Put Correct data"
            });
        }

        /* ================= HANDLE RESULT ================= */
        match.teamARuns = teamARuns;
        match.teamAOvers = teamAOvers;
        match.teamBRuns = teamBRuns;
        match.teamBOvers = teamBOvers;

        if (teamARuns > teamBRuns) {
            match.winningTeam = match.teamA;
            match.losingTeam = match.teamB;
            match.result = "teamA";
        }

        else if (teamBRuns > teamARuns) {
            match.winningTeam = match.teamB;
            match.losingTeam = match.teamA;
            match.result = "teamB";
        }

        else {
            match.winningTeam = null;
            match.losingTeam = null;
            match.result = "draw";
        }



        match.result = result;
        match.resultSummary = resultSummary;
        match.status = "completed";


        await match.save();
        await updatePointsTable(match);
        res.status(200).json({
            message: "Match result updated successfully"
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;