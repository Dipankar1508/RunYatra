function generateJoinCodes(maxTeams) {

    const codes = [];

    for (let i = 0; i < maxTeams; i++) {

        const code = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        codes.push({
            code,
            used: false
        });

    }

    return codes;
}

module.exports = generateJoinCodes;