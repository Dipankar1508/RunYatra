const express = require("express");
const router = express.Router();

const Tournament = require("../models/TournamentModel");
const Match = require("../models/MatchModel");
const Schedule = require("../models/ScheduleModel");
const PointsTable = require("../models/PointTableModel");

const generateSchedule = require("../utils/generateSchedule");
const {
    createFinalMatch,
    createSemiFinalMatches,
    getStageCounts,
    resetStageMatches
} = require("../services/TournamentStageService");

const protect = require("../middleware/authMiddleware");

function getRouteErrorStatus(error) {
    const clientMessages = new Set([
        "At least 4 teams are required for semi finals",
        "Complete all group matches before creating semi finals",
        "Complete both semi finals before creating the final",
        "Create semi finals before proceeding to the final",
        "Final requires two different qualified teams",
        "Final schedule already exists",
        "Group stage is not completed yet",
        "Reset semi final or final stages first",
        "Reset the final before resetting semi finals",
        "Semi final schedule already exists",
        "Semi final winners are not ready yet",
        "Semi finals are not completed yet"
    ]);

    return clientMessages.has(error.message) ? 400 : 500;
}

/* ================= GENERATE SCHEDULE ================= */

router.post("/:id/generate-schedule", protect, async (req, res) => {

    try {

        const { mode } = req.body;

        const tournament = await Tournament
            .findById(req.params.id)
            .populate("teams");

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (tournament.scheduleGenerated) {
            return res.status(400).json({
                message: "Schedule already generated"
            });
        }

        if (tournament.teams.length !== tournament.rules.maxTeams) {
            return res.status(400).json({
                message: "Tournament must be full before generating schedule"
            });
        }

        const teams = tournament.teams;

        if (teams.length < 2) {
            return res.status(400).json({
                message: "Not enough teams"
            });
        }

        /* ================= DETERMINE MATCHES PER TEAM ================= */

        let matchesPerTeam;

        switch (mode) {

            case "one_to_one":
                matchesPerTeam = 1;
                break;

            case "one_to_two":
                matchesPerTeam = 2;
                break;

            case "one_to_three":
                matchesPerTeam = 3;
                break;

            case "one_to_half":
                matchesPerTeam = Math.floor(teams.length / 2);
                break;

            case "one_to_all":
                matchesPerTeam = teams.length - 1;
                break;

            default:
                return res.status(400).json({
                    message: "Invalid scheduling mode"
                });
        }

        if (matchesPerTeam > teams.length - 1) {
            return res.status(400).json({
                message: "Invalid scheduling mode for this tournament"
            });
        }

        /* ================= GENERATE MATCHES ================= */

        const generatedMatches = generateSchedule(
            teams,
            matchesPerTeam
        );

        const matches = [];

        for (let match of generatedMatches) {

            const newMatch = await Match.create({

                tournament: tournament._id,
                teamA: match.teamA,
                teamB: match.teamB,
                matchNumber: match.matchNumber,
                overs: tournament.rules.oversPerMatch

            });

            matches.push(newMatch._id);
        }

        /* ================= SAVE SCHEDULE ================= */

        let schedule = await Schedule.findOne({
            tournament: tournament._id
        });

        if (!schedule) {

            schedule = await Schedule.create({
                tournament: tournament._id,
                matches,
                generated: true
            });

        } else {

            schedule.matches = matches;
            schedule.generated = true;
            await schedule.save();

        }

        tournament.scheduleGenerated = true;
        tournament.currentStage = "group";
        tournament.groupStageCompleted = false;
        tournament.semiFinalGenerated = false;
        tournament.semiFinalCompleted = false;
        tournament.finalGenerated = false;
        tournament.winner = null;
        tournament.status = "live";
        await tournament.save();

        /* ================= CREATE INITIAL POINTS TABLE ================= */

        const existingEntries = await PointsTable.find({
            tournament: tournament._id
        });

        if (existingEntries.length === 0) {

            const entries = tournament.teams.map(team => ({
                tournament: tournament._id,
                team: team._id,
                played: 0,
                won: 0,
                lost: 0,
                points: 0,
                netrunrate: 0
            }));

            await PointsTable.insertMany(entries);

        }
        res.status(201).json({

            message: "Schedule generated successfully",
            mode,
            totalMatches: matches.length

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= RESET SCHEDULE ================= */

router.post("/:id/reset-schedule", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (tournament.semiFinalGenerated) {
            return res.status(400).json({
                message: "Reset semi final or final stages first"
            });
        }

        /* ================= DELETE MATCHES ================= */

        await Match.deleteMany({
            tournament: tournament._id
        });

        await PointsTable.deleteMany({
            tournament: tournament._id
        });

        /* ================= RESET SCHEDULE ================= */

        await Schedule.findOneAndUpdate(
            { tournament: tournament._id },
            {
                matches: [],
                generated: false
            }
        );

        tournament.scheduleGenerated = false;
        tournament.currentStage = "group";
        tournament.groupStageCompleted = false;
        tournament.semiFinalGenerated = false;
        tournament.semiFinalCompleted = false;
        tournament.finalGenerated = false;
        tournament.winner = null;
        tournament.status = "upcoming";

        await tournament.save();

        /* ================= RETURN AVAILABLE MODES ================= */

        const schedulingOptions = [
            "one_to_one",
            "one_to_two",
            "one_to_three",
            "one_to_half",
            "one_to_all"
        ];

        res.status(200).json({

            message: "Schedule reset successfully",
            availableSchedulingModes: schedulingOptions

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= PROCEED TO SEMI FINAL ================= */

router.post("/:id/proceed-semi-final", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (tournament.semiFinalGenerated) {
            return res.status(400).json({
                message: "Semi final schedule already generated"
            });
        }

        const groupStage = await getStageCounts(tournament._id, "group");

        if (!groupStage.isComplete) {
            return res.status(400).json({
                message: "Complete all group matches before creating semi finals"
            });
        }

        const semiFinals = await createSemiFinalMatches(tournament);

        tournament.groupStageCompleted = true;
        tournament.semiFinalGenerated = true;
        tournament.semiFinalCompleted = false;
        tournament.finalGenerated = false;
        tournament.currentStage = "semi_final";
        tournament.status = "live";
        await tournament.save();

        res.status(201).json({
            message: "Semi final schedule created successfully",
            totalMatches: semiFinals.length
        });

    } catch (error) {

        console.error(error);

        res.status(getRouteErrorStatus(error)).json({
            message: error.message || "Server error"
        });

    }

});

/* ================= RESET SEMI FINAL ================= */

router.post("/:id/reset-semi-final", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (tournament.finalGenerated) {
            return res.status(400).json({
                message: "Reset the final before resetting semi finals"
            });
        }

        const deletedCount = await resetStageMatches(
            tournament._id,
            ["semi_final", "final"]
        );

        if (!deletedCount) {
            return res.status(400).json({
                message: "No semi final or final schedule to reset"
            });
        }

        tournament.semiFinalGenerated = false;
        tournament.semiFinalCompleted = false;
        tournament.finalGenerated = false;
        tournament.currentStage = "group";
        tournament.winner = null;
        tournament.status = "live";
        await tournament.save();

        res.status(200).json({
            message: "Semi final schedule reset successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(getRouteErrorStatus(error)).json({
            message: error.message || "Server error"
        });

    }

});

/* ================= PROCEED TO FINAL ================= */

router.post("/:id/proceed-final", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (!tournament.semiFinalGenerated) {
            return res.status(400).json({
                message: "Create semi finals before proceeding to the final"
            });
        }

        if (tournament.finalGenerated) {
            return res.status(400).json({
                message: "Final schedule already generated"
            });
        }

        const semiFinalStage = await getStageCounts(tournament._id, "semi_final");

        if (!semiFinalStage.isComplete) {
            return res.status(400).json({
                message: "Complete both semi finals before creating the final"
            });
        }

        const finalMatch = await createFinalMatch(tournament);

        tournament.semiFinalCompleted = true;
        tournament.finalGenerated = true;
        tournament.currentStage = "final";
        tournament.status = "live";
        await tournament.save();

        res.status(201).json({
            message: "Final schedule created successfully",
            matchId: finalMatch._id
        });

    } catch (error) {

        console.error(error);

        res.status(getRouteErrorStatus(error)).json({
            message: error.message || "Server error"
        });

    }

});

/* ================= RESET FINAL ================= */

router.post("/:id/reset-final", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const deletedCount = await resetStageMatches(tournament._id, ["final"]);

        if (!deletedCount) {
            return res.status(400).json({
                message: "No final schedule to reset"
            });
        }

        tournament.finalGenerated = false;
        tournament.currentStage = "semi_final";
        tournament.winner = null;
        tournament.status = "live";
        await tournament.save();

        res.status(200).json({
            message: "Final schedule reset successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(getRouteErrorStatus(error)).json({
            message: error.message || "Server error"
        });

    }

});


module.exports = router;
