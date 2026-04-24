const express = require("express");
const router = express.Router();

const Match = require("../models/MatchModel");
const Tournament = require("../models/TournamentModel");

const updatePointsTable = require("../services/PointService");
const { getStageCounts } = require("../services/TournamentStageService");

const protect = require("../middleware/authMiddleware");


/* ================= GET SINGLE MATCH ================= */

router.get("/:id", protect, async (req, res) => {

    try {

        const match = await Match.findById(req.params.id)
            .populate("teamA", "name")
            .populate("teamB", "name")
            .populate("winningTeam", "name");

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

router.get("/tournament/:id", async (req, res) => {

    try {

        const matches = await Match.find({
            tournament: req.params.id
        })
            .populate("teamA", "name")
            .populate("teamB", "name")
            .populate("winningTeam", "name")
            .sort({ stageOrder: 1, matchNumber: 1 });

        res.status(200).json(matches);

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
            // result,
            resultSummary,
            teamARuns,
            teamAOvers,
            teamBRuns,
            teamBOvers
        } = req.body;

        // const allowedResults = ["teamA", "teamB", "draw", "no_result"];

        // if (!allowedResults.includes(result)) {
        //     return res.status(400).json({
        //         message: "Invalid result type"
        //     });
        // }

        if (
            teamARuns == null ||
            teamBRuns == null ||
            teamAOvers == null ||
            teamBOvers == null
        ) {
            return res.status(400).json({
                message: "Score data required"
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

        if (match.round === "group" && tournament.semiFinalGenerated) {
            return res.status(400).json({
                message: "Reset semi finals before editing group stage results"
            });
        }

        if (match.round === "semi_final" && tournament.finalGenerated) {
            return res.status(400).json({
                message: "Reset the final before editing semi final results"
            });
        }

        if (teamAOvers > match.overs || teamBOvers > match.overs) {
            return res.status(400).json({
                message: "Put Correct data"
            });
        }

        if (
            (match.round === "semi_final" || match.round === "final") &&
            teamARuns === teamBRuns
        ) {
            return res.status(400).json({
                message: "Knockout matches must have a winner"
            });
        }

        /* ================= HANDLE RESULT ================= */
        match.teamARuns = teamARuns;
        match.teamAOvers = teamAOvers;
        match.teamBRuns = teamBRuns;
        match.teamBOvers = teamBOvers;
        if (teamAOvers < match.overs) {
            match.teamAAllOut = true;
        }

        if (teamBOvers < match.overs) {
            match.teamBAllOut = true;
        }

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



        // match.result = result;
        match.resultSummary = resultSummary;
        match.status = "completed";

        let totalOvers = match.overs;

        await match.save();

        if (match.round === "group") {
            await updatePointsTable(match, totalOvers);

            const groupStage = await getStageCounts(match.tournament, "group");

            tournament.groupStageCompleted = groupStage.isComplete;

            if (!tournament.semiFinalGenerated) {
                tournament.currentStage = "group";
            }
        }

        if (match.round === "semi_final") {
            const semiFinalStage = await getStageCounts(match.tournament, "semi_final");
            tournament.semiFinalCompleted = semiFinalStage.isComplete;
        }

        if (match.round === "final") {
            tournament.winner = match.winningTeam;
            tournament.currentStage = "completed";
            tournament.status = "completed";
            tournament.finalGenerated = true;
        }

        await tournament.save();

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
