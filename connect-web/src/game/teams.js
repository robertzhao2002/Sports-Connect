import sample from '@stdlib/random-sample';

const MLBTEAMS = [
    'ANA', 'ARI', 'ATL', 'BAL', 'BOS', 'CHC',
    'CHW', 'CIN', 'CLE', 'COL', 'DET', 'FLA',
    'HOU', 'KCR', 'LAD', 'MIL', 'MIN', 'NYM',
    'NYY', 'OAK', 'PHI', 'PIT', 'SDP', 'SEA',
    'SFG', 'STL', 'TBD', 'TEX', 'TOR', 'WSN'
] // Based on names of logos

export function randomTeams(length) {
    return sample(
        MLBTEAMS,
        {
            'replace': false,
            'size': length
        }
    );
}

export function checkTeamRename(gameTeamCode) {
    switch (gameTeamCode) {
        case 'ANA': return new Set(['ANA', 'CAL', 'LAA']);
        case 'ATL': return new Set(['ATL', 'BSN', 'MLN']);
        case 'BAL': return new Set(['BAL', 'MLA', 'SLB']);
        case 'FLA': return new Set(['FLA', 'MIA']);
        case 'LAD': return new Set(['BRO', 'LAD']);
        case 'MIL': return new Set(['MIL', 'SEP']);
        case 'MIN': return new Set(['MIN', 'WSH']);
        case 'OAK': return new Set(['KCA', 'OAK', 'PHA']);
        case 'SFG': return new Set(['NYG', 'SFG']);
        case 'TBD': return new Set(['TBD', 'TBR']);
        case 'TEX': return new Set(['TEX', 'WSA']);
        case 'WSN': return new Set(['MON', 'WSH']);
        default: return new Set([gameTeamCode]);
    }
}

export function createGame(teams) {
    const length = teams.length / 2;
    const board = {};
    for (var i = 0; i < length; i++) {
        for (var j = length; j < 2 * length; j++) {
            board[[teams[i], teams[j]]] = { coordinates: [i, j - length], player: null }
        }
    }
    return board;
}

export function checkPlayerTeams(teams, playerTeams) {
    const [team1, team2] = teams;
    const otherNames1 = checkTeamRename(team1);
    const otherNames2 = checkTeamRename(team2);
    var team1Check = false;
    var team2Check = false;
    otherNames1.forEach(t => {
        if (playerTeams.has(t)) team1Check = true;
    });
    otherNames2.forEach(t => {
        if (playerTeams.has(t)) team2Check = true;
    });
    return team1Check && team2Check;
}