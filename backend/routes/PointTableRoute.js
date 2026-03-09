const express = require('express');
const router = express.Router();

router.get("/:id/points-table", async (req, res) => {

    const table = await PointsTable.find({
        tournament: req.params.tournamentId
    })
        .populate("team", "name")
        .sort({ points: -1, netrunrate: -1 });

    res.json(table);
});

module.exports = router;