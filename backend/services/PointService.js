const Match = require("../models/MatchModel");
const PointsTable = require("../models/PointsTableModel");

async function updatePointsTable(match) {

    const tournamentId = match.tournament;

    const matches = await Match.find({
        tournament: tournamentId,
        status: "completed"
    });

    const table = {};

    matches.forEach(m => {

        const teamA = m.teamA.toString();
        const teamB = m.teamB.toString();

        /* INIT TEAM ENTRY */

        if (!table[teamA]) {
            table[teamA] = {
                played: 0,
                won: 0,
                lost: 0,
                points: 0,
                runsScored: 0,
                runsConceded: 0,
                oversFaced: 0,
                oversBowled: 0
            };
        }

        if (!table[teamB]) {
            table[teamB] = {
                played: 0,
                won: 0,
                lost: 0,
                points: 0,
                runsScored: 0,
                runsConceded: 0,
                oversFaced: 0,
                oversBowled: 0
            };
        }

        /* MATCH PLAYED */

        table[teamA].played += 1;
        table[teamB].played += 1;

        /* RUN DATA FOR NRR */

        table[teamA].runsScored += m.teamARuns;
        table[teamA].runsConceded += m.teamBRuns;
        table[teamA].oversFaced += m.teamAOvers;
        table[teamA].oversBowled += m.teamBOvers;

        table[teamB].runsScored += m.teamBRuns;
        table[teamB].runsConceded += m.teamARuns;
        table[teamB].oversFaced += m.teamBOvers;
        table[teamB].oversBowled += m.teamAOvers;

        /* RESULT */

        if (m.result === "teamA") {

            table[teamA].won += 1;
            table[teamA].points += 2;
            table[teamB].lost += 1;

        }

        else if (m.result === "teamB") {

            table[teamB].won += 1;
            table[teamB].points += 2;
            table[teamA].lost += 1;

        }

        else if (m.result === "draw") {

            table[teamA].points += 1;
            table[teamB].points += 1;

        }

    });

    /* REMOVE OLD TABLE */

    await PointsTable.deleteMany({ tournament: tournamentId });

    const entries = [];

    for (const teamId in table) {

        const t = table[teamId];

        let nrr = 0;

        if (t.oversFaced > 0 && t.oversBowled > 0) {

            const runRateFor = t.runsScored / t.oversFaced;
            const runRateAgainst = t.runsConceded / t.oversBowled;

            nrr = runRateFor - runRateAgainst;

        }

        entries.push({
            tournament: tournamentId,
            team: teamId,
            played: t.played,
            won: t.won,
            lost: t.lost,
            points: t.points,
            netrunrate: Number(nrr.toFixed(3))
        });

    }

    if (entries.length > 0) {
        await PointsTable.insertMany(entries);
    }

}

module.exports = updatePointsTable;