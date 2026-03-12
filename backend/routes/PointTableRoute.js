const express = require('express');
const router = express.Router();

const PointsTable = require('../models/PointTableModel');

router.get("/:id/points-table", async (req, res) => {

    try {
        const { id } = req.params;
        const table = await PointsTable.find({
            tournament: id
        })
            .populate("team", "name")
            .sort({
                points: -1,
                netrunrate: -1
            });

        res.status(200).json(table);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;