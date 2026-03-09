function generateSchedule(teams, matchesPerTeam) {

    const matches = [];
    const teamMatchCount = {};
    const pairs = [];

    teams.forEach(team => {
        teamMatchCount[team._id] = 0;
    });

    // generate all possible pairs
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            pairs.push([teams[i], teams[j]]);
        }
    }

    // Fisher-Yates shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    let matchNumber = 1;
    let lastTeams = [];

    for (let [teamA, teamB] of pairs) {

        if (
            teamMatchCount[teamA._id] < matchesPerTeam &&
            teamMatchCount[teamB._id] < matchesPerTeam &&
            !lastTeams.includes(teamA._id.toString()) &&
            !lastTeams.includes(teamB._id.toString())
        ) {

            matches.push({
                teamA: teamA._id,
                teamB: teamB._id,
                matchNumber
            });

            teamMatchCount[teamA._id]++;
            teamMatchCount[teamB._id]++;

            lastTeams = [
                teamA._id.toString(),
                teamB._id.toString()
            ];

            matchNumber++;
        }
    }

    return matches;
}

module.exports = generateSchedule;