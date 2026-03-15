function generateSchedule(teams, matchesPerTeam) {

    const matches = [];
    const teamMatchCount = {};
    const pairs = [];

    teams.forEach(team => {
        teamMatchCount[team._id] = 0;
    });

    /* Generate all possible pairs */

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            pairs.push({
                teamA: teams[i]._id,
                teamB: teams[j]._id
            });
        }
    }

    /* Shuffle pairs */

    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    let matchNumber = 1;

    for (let pair of pairs) {

        const teamA = pair.teamA.toString();
        const teamB = pair.teamB.toString();

        if (
            teamMatchCount[teamA] < matchesPerTeam &&
            teamMatchCount[teamB] < matchesPerTeam
        ) {

            matches.push({
                teamA,
                teamB,
                matchNumber
            });

            teamMatchCount[teamA]++;
            teamMatchCount[teamB]++;
            matchNumber++;
        }
    }

    /* -------- Fix consecutive matches -------- */

    for (let i = 1; i < matches.length; i++) {

        const prev = matches[i - 1];
        const curr = matches[i];

        if (
            prev.teamA === curr.teamA ||
            prev.teamA === curr.teamB ||
            prev.teamB === curr.teamA ||
            prev.teamB === curr.teamB
        ) {

            for (let j = i + 1; j < matches.length; j++) {

                const next = matches[j];

                if (
                    prev.teamA !== next.teamA &&
                    prev.teamA !== next.teamB &&
                    prev.teamB !== next.teamA &&
                    prev.teamB !== next.teamB
                ) {

                    [matches[i], matches[j]] = [matches[j], matches[i]];
                    break;
                }
            }
        }
    }

    return matches;
}

module.exports = generateSchedule;