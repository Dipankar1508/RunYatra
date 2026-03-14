const express = require("express");
const router = express.Router();

const Tournament = require("../models/TournamentModel");
const Match = require("../models/MatchModel");
const Schedule = require("../models/ScheduleModel");
const PointsTable = require("../models/PointTableModel");

const generateSchedule = require("../utils/generateSchedule");

const protect = require("../middleware/authMiddleware");

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


module.exports = router;