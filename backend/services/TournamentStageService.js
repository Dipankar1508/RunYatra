const Match = require("../models/MatchModel");
const PointsTable = require("../models/PointTableModel");
const Schedule = require("../models/ScheduleModel");

async function getStageCounts(tournamentId, round) {
    const total = await Match.countDocuments({
        tournament: tournamentId,
        round
    });

    const completed = await Match.countDocuments({
        tournament: tournamentId,
        round,
        status: "completed"
    });

    return {
        total,
        completed,
        isComplete: total > 0 && total === completed
    };
}

async function appendMatchesToSchedule(tournamentId, matchIds) {
    if (!matchIds.length) {
        return;
    }

    const schedule = await Schedule.findOne({ tournament: tournamentId });

    if (!schedule) {
        await Schedule.create({
            tournament: tournamentId,
            matches: matchIds,
            generated: true
        });
        return;
    }

    schedule.matches.push(...matchIds);
    schedule.generated = true;
    await schedule.save();
}

async function removeMatchesFromSchedule(tournamentId, matchIds) {
    const schedule = await Schedule.findOne({ tournament: tournamentId });

    if (!schedule) {
        return;
    }

    const toRemove = new Set(matchIds.map(id => id.toString()));
    schedule.matches = schedule.matches.filter(
        id => !toRemove.has(id.toString())
    );
    await schedule.save();
}

async function getNextMatchNumber(tournamentId) {
    const lastMatch = await Match.findOne({ tournament: tournamentId })
        .sort({ matchNumber: -1 })
        .select("matchNumber");

    return (lastMatch?.matchNumber || 0) + 1;
}

async function createSemiFinalMatches(tournament) {
    const stageCounts = await getStageCounts(tournament._id, "group");

    if (!stageCounts.isComplete) {
        throw new Error("Group stage is not completed yet");
    }

    const semiFinalExists = await Match.exists({
        tournament: tournament._id,
        round: "semi_final"
    });

    if (semiFinalExists) {
        throw new Error("Semi final schedule already exists");
    }

    const standings = await PointsTable.find({
        tournament: tournament._id
    }).sort({
        points: -1,
        netrunrate: -1
    });

    if (standings.length < 4) {
        throw new Error("At least 4 teams are required for semi finals");
    }

    const [first, second, third, fourth] = standings;
    let matchNumber = await getNextMatchNumber(tournament._id);

    const semiFinals = await Match.insertMany([
        {
            tournament: tournament._id,
            teamA: first.team,
            teamB: fourth.team,
            matchNumber: matchNumber++,
            round: "semi_final",
            slotLabel: "Semi Final 1",
            stageOrder: 2,
            overs: tournament.rules.oversPerMatch
        },
        {
            tournament: tournament._id,
            teamA: second.team,
            teamB: third.team,
            matchNumber: matchNumber,
            round: "semi_final",
            slotLabel: "Semi Final 2",
            stageOrder: 2,
            overs: tournament.rules.oversPerMatch
        }
    ]);

    await appendMatchesToSchedule(
        tournament._id,
        semiFinals.map(match => match._id)
    );

    return semiFinals;
}

async function createFinalMatch(tournament) {
    const stageCounts = await getStageCounts(tournament._id, "semi_final");

    if (!stageCounts.isComplete) {
        throw new Error("Semi finals are not completed yet");
    }

    const finalExists = await Match.exists({
        tournament: tournament._id,
        round: "final"
    });

    if (finalExists) {
        throw new Error("Final schedule already exists");
    }

    const semiFinals = await Match.find({
        tournament: tournament._id,
        round: "semi_final",
        status: "completed"
    }).sort({ matchNumber: 1 });

    if (
        semiFinals.length !== 2 ||
        !semiFinals[0].winningTeam ||
        !semiFinals[1].winningTeam
    ) {
        throw new Error("Semi final winners are not ready yet");
    }

    if (
        semiFinals[0].winningTeam.toString() ===
        semiFinals[1].winningTeam.toString()
    ) {
        throw new Error("Final requires two different qualified teams");
    }

    const finalMatch = await Match.create({
        tournament: tournament._id,
        teamA: semiFinals[0].winningTeam,
        teamB: semiFinals[1].winningTeam,
        matchNumber: await getNextMatchNumber(tournament._id),
        round: "final",
        slotLabel: "Final",
        stageOrder: 3,
        overs: tournament.rules.oversPerMatch
    });

    await appendMatchesToSchedule(tournament._id, [finalMatch._id]);

    return finalMatch;
}

async function resetStageMatches(tournamentId, rounds) {
    const matches = await Match.find({
        tournament: tournamentId,
        round: { $in: rounds }
    }).select("_id");

    if (!matches.length) {
        return 0;
    }

    const matchIds = matches.map(match => match._id);

    await Match.deleteMany({
        tournament: tournamentId,
        round: { $in: rounds }
    });

    await removeMatchesFromSchedule(tournamentId, matchIds);

    return matchIds.length;
}

module.exports = {
    createFinalMatch,
    createSemiFinalMatches,
    getStageCounts,
    resetStageMatches
};
