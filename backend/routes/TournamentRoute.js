const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const Tournament = require("../models/TournamentModel");
const Team = require("../models/TeamModel");
const Match = require("../models/MatchModel");
const PointsTable = require("../models/PointsTableModel");
const generateJoinCodes = require("../utils/generateJoinCodes");

const protect = require("../middleware/authMiddleware");

/* ================= CREATE TOURNAMENT ================= */
router.post("/create", protect, async (req, res) => {
    try {

        const { name, location, startDate, endDate, rules } = req.body;
        let user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.role !== "organizer") {
            return res.status(403).json({
                message: "Only organizers can create tournaments"
            });
        }

        if (user.subscription.tournamentsUsed >= user.subscription.tournamentLimit) {
            return res.status(403).json({
                message: "You have reached the maximum number of tournaments"
            });
        }


        if (!name) {
            return res.status(400).json({
                message: "Tournament name is required"
            });
        }

        if (rules.maxTeams % 2 !== 0) {
            return res.status(400).json({
                message: "Rules must have an even number of teams"
            });
        }

        const tournament = await Tournament.create({
            name,
            createdBy: req.user._id,
            location,
            startDate,
            endDate,
            rules
        });

        user.subscription.tournamentsUsed++;
        await user.save();

        res.status(201).json({
            message: "Tournament created successfully",
            tournament
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


/* ================= GET ALL TOURNAMENTS ================= */
router.get("/", async (req, res) => {

    try {

        const tournaments = await Tournament.find()
            .populate("createdBy", "name");

        res.status(200).json(tournaments);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= GET SINGLE TOURNAMENT ================= */
router.get("/:id", async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id)
            .populate("teams");

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        res.status(200).json(tournament);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= GENERATE JOIN CODES ================= */
router.post("/:id/generate-codes", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        // only organizer can generate codes
        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const maxTeams = tournament.rules.maxTeams;
        if (tournament.joinCodes.length > 0) {
            return res.status(400).json({
                message: "Join codes already generated"
            });
        }
        const codes = generateJoinCodes(maxTeams);

        tournament.joinCodes = codes;

        await tournament.save();

        res.status(200).json({
            message: "Join codes generated successfully",
            codes
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.post("/:id/reset-codes", protect, async (req, res) => {
    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        // Only organizer can reset
        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        /* ================= RESET TEAMS ================= */

        // Find all teams currently in this tournament
        await Team.updateMany(
            { tournament: tournament._id },
            { $set: { tournament: null } }
        );

        // Clear tournament teams list
        tournament.teams = [];

        /* ================= RESET JOIN CODES ================= */

        const maxTeams = tournament.rules.maxTeams;

        const newCodes = generateJoinCodes(maxTeams);

        tournament.joinCodes = newCodes;

        await tournament.save();

        res.status(200).json({
            message: "Tournament reset successfully",
            codes: newCodes
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
});


/* ================= JOIN TOURNAMENT ================= */
router.post("/join", protect, async (req, res) => {

    try {

        const { teamId, joinCode } = req.body;

        if (!teamId || !joinCode) {
            return res.status(400).json({
                message: "Team ID and join code required"
            });
        }

        /* ================= CHECK TEAM ================= */

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        /* ================= CAPTAIN AUTHORIZATION ================= */

        if (!team.captain) {
            return res.status(400).json({
                message: "Team has no captain assigned"
            });
        }

        if (team.captain.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only team captain can join tournament"
            });
        }

        const tournament = await Tournament.findOne({
            joinCodes: {
                $elemMatch: { code: joinCode, used: false }
            }
        })

        if (!tournament) {
            return res.status(404).json({
                message: "Invalid join code"
            });
        }

        const codeObj = tournament.joinCodes.find(
            c => c.code === joinCode
        );

        if (codeObj.used) {
            return res.status(400).json({
                message: "Join code already used"
            });
        }

        if (team.tournament) {
            return res.status(400).json({
                message: "Team already joined a tournament"
            });
        }

        const totalPlayers = team.players.length + 1; // +1 for captain

        if (totalPlayers !== tournament.rules.playersPerTeam) {
            return res.status(400).json({
                message: `Team must have exactly ${tournament.rules.playersPerTeam} players including captain`
            });
        }

        if (tournament.teams.length >= tournament.rules.maxTeams) {
            return res.status(400).json({
                message: "Tournament already full"
            });
        }

        if (tournament.teams.some(t => t.toString() === teamId)) {
            return res.status(400).json({
                message: "Team already joined this tournament"
            });
        }


        tournament.teams.push(teamId);

        codeObj.used = true;

        await tournament.save();

        await Team.findByIdAndUpdate(teamId, {
            tournament: tournament._id
        });

        res.status(200).json({
            message: "Team joined tournament successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.delete("/:id", protect, async (req, res) => {

    try {

        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({
                message: "Tournament not found"
            });
        }

        /* ONLY ORGANIZER CAN DELETE */

        if (tournament.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the organizer can delete this tournament"
            });
        }

        /* DELETE MATCHES */

        await Match.deleteMany({
            tournament: tournament._id
        });

        /* DELETE POINTS TABLE */

        await PointsTable.deleteMany({
            tournament: tournament._id
        });

        /* DELETE TOURNAMENT */

        await Tournament.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Tournament deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});
module.exports = router;