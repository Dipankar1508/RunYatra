const express = require("express");
const router = express.Router();

const Team = require("../models/TeamModel");
const protect = require("../middleware/authMiddleware");


/* ================= CREATE TEAM ================= */
router.post("/create", protect, async (req, res) => {

    try {

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Team name required"
            });
        }

        const existingTeam = await Team.findOne({
            name: name.trim(),
            createdBy: req.user._id
        });

        if (existingTeam) {
            return res.status(400).json({
                message: "You already created a team with this name"
            });
        }

        const team = await Team.create({
            name: name.trim(),
            captain: req.user._id,
            createdBy: req.user._id,
            players: []
        });

        res.status(201).json({
            message: "Team created successfully",
            team
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= GET ALL TEAMS ================= */
router.get("/", async (req, res) => {

    try {

        const teams = await Team.find()
            .populate("captain", "name email")
            .select("name players captain tournament");

        res.status(200).json(teams);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= GET ALL TEAM OF THAT PARTICULAR USER ================= */
router.get("/my", protect, async (req, res) => {

    try {

        const teams = await Team.find({ captain: req.user._id })
            .populate("captain", "name email")
            .populate("tournament", "name");

        res.status(200).json(teams);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= GET SINGLE TEAM ================= */
router.get("/search/:id", async (req, res) => {

    try {

        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid team id"
            });
        }

        const team = await Team.findById(req.params.id)
            .populate("captain", "name email")
            .populate("tournament", "name");

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        res.status(200).json(team);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= ADD PLAYER ================= */
router.put("/:id/add-player", protect, async (req, res) => {

    try {

        const {
            name,
            role,
            age,
            gender,
            jerseyNumber,
            battingStyle,
            bowlingStyle
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Player name required"
            });
        }

        const team = await Team.findById(req.params.id).populate("tournament");

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (!team.captain.equals(req.user._id)) {
            return res.status(403).json({
                message: "Only captain can add players"
            });
        }

        // if (!team.tournament) {
        //     return res.status(400).json({
        //         message: "Team must join a tournament first"
        //     });
        // }

        // const maxPlayers = team.tournament.rules.playersPerTeam;

        // const currentPlayers = team.players.length + 1; // +1 for captain

        // if (currentPlayers >= maxPlayers) {
        //     return res.status(400).json({
        //         message: `Maximum ${maxPlayers} players allowed including captain`
        //     });
        // }

        const MAX_PLAYERS_LIMIT = 20; // safety limit

        if (team.players.length >= MAX_PLAYERS_LIMIT) {
            return res.status(400).json({
                message: `Maximum ${MAX_PLAYERS_LIMIT} players allowed`
            });
        }

        const exists = team.players.find(
            p => p.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (exists) {
            return res.status(400).json({
                message: "Player already exists in team"
            });
        }

        const jerseyExists = team.players.find(
            p => p.jerseyNumber === jerseyNumber
        );

        if (jerseyExists) {
            return res.status(400).json({
                message: "Jersey numbers must be unique"
            });
        }

        team.players.push({
            name: name.trim(),
            role: role || "batsman",
            age,
            gender,
            jerseyNumber,
            battingStyle,
            bowlingStyle
        });

        await team.save();

        res.status(200).json({
            message: "Player added",
            totalPlayers: team.players.length + 1,
            team
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= UPDATE CAPTAIN DETAILS ================= */

router.put("/:id/captain-details", protect, async (req, res) => {

    try {

        const {
            role,
            age,
            gender,
            jerseyNumber,
            battingStyle,
            bowlingStyle
        } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (!team.captain.equals(req.user._id)) {
            return res.status(403).json({
                message: "Only captain can update captain details"
            });
        }

        team.captainDetails = {
            role,
            age,
            gender,
            jerseyNumber,
            battingStyle,
            bowlingStyle
        };

        await team.save();

        res.status(200).json({
            message: "Captain details updated",
            team
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= REMOVE PLAYER ================= */
router.delete("/:id/remove-player", protect, async (req, res) => {

    try {

        const { playerName } = req.body;

        if (!playerName) {
            return res.status(400).json({
                message: "Player name required"
            });
        }

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (!team.captain.equals(req.user._id)) {
            return res.status(403).json({
                message: "Only captain can remove players"
            });
        }

        const exists = team.players.find(
            p => p.name.toLowerCase() === playerName.toLowerCase()
        );

        if (!exists) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        team.players = team.players.filter(
            p => p.name.toLowerCase() !== playerName.toLowerCase()
        );

        await team.save();

        res.status(200).json({
            message: "Player removed",
            team
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


/* ================= DELETE TEAM ================= */
router.delete("/:id", protect, async (req, res) => {

    try {

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (!team.createdBy.equals(req.user._id)) {
            return res.status(403).json({
                message: "Only creator can delete team"
            });
        }

        await team.deleteOne();

        res.status(200).json({
            message: "Team deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

/* ================= GET TEAM BASIC INFO ================= */
router.get("/:id/tournament-info", async (req, res) => {
    try {

        const team = await Team.findById(req.params.id)
            .populate({
                path: "tournament",
                select: "name location startDate endDate rules"
            });

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json(team.tournament);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;