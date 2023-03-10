import sample from '@stdlib/random-sample';

const MLBTEAMS = [
    'ANA', 'ARI', 'ATL', 'BAL', 'BOS', 'CHC',
    'CHW', 'CIN', 'CLE', 'COL', 'DET', 'FLA',
    'HOU', 'KCR', 'LAD', 'MIL', 'MIN', 'NYM',
    'NYY', 'OAK', 'PHI', 'PIT', 'SDP', 'SEA',
    'SFG', 'STL', 'TBD', 'TEX', 'TOR', 'WSN'
] // Based on names of logos

const NBATEAMS = [
    'ATL', 'BOS', 'CHA', 'CHI', 'CLE', 'DAL',
    'DEN', 'DET', 'GSW', 'HOU', 'IND', 'LAC',
    'LAL', 'MEM', 'MIA', 'MIL', 'MIN', 'NJN',
    'NOH', 'NYK', 'OKC', 'ORL', 'PHI', 'PHO',
    'POR', 'SAC', 'SAS', 'TOR', 'UTA', 'WAS'
] // Based on names of logos

export function randomTeams(length, mlb = true) {
    return sample(
        (mlb) ? MLBTEAMS : NBATEAMS,
        {
            'replace': false,
            'size': length
        }
    );
}

export function checkTeamRenameMLB(gameTeamCode) {
    switch (gameTeamCode) {
        case 'ANA': return new Set([gameTeamCode, 'CAL', 'LAA']);
        case 'ATL': return new Set([gameTeamCode, 'BSN', 'MLN']);
        case 'BAL': return new Set([gameTeamCode, 'MLA', 'SLB']);
        case 'FLA': return new Set([gameTeamCode, 'MIA']);
        case 'LAD': return new Set(['BRO', gameTeamCode]);
        case 'MIL': return new Set([gameTeamCode, 'SEP']);
        case 'MIN': return new Set([gameTeamCode, 'WSH']);
        case 'OAK': return new Set(['KCA', gameTeamCode, 'PHA']);
        case 'SFG': return new Set(['NYG', gameTeamCode]);
        case 'TBD': return new Set([gameTeamCode, 'TBR']);
        case 'TEX': return new Set([gameTeamCode, 'WSA']);
        case 'WSN': return new Set(['MON', gameTeamCode]);
        default: return new Set([gameTeamCode]);
    }
}

export function checkTeamRenameNBA(gameTeamCode) {
    switch (gameTeamCode) {
        case 'ATL': return new Set([gameTeamCode, 'MLH', 'STL', 'TRI']);
        case 'CHA': return new Set([gameTeamCode, 'CHH', 'CHO']);
        case 'DEN': return new Set([gameTeamCode, 'DNR']);
        case 'DET': return new Set([gameTeamCode, 'FTW']);
        case 'GSW': return new Set([gameTeamCode, 'PHW', 'SFW']);
        case 'HOU': return new Set([gameTeamCode, 'SDR']);
        case 'IND': return new Set(['INA', gameTeamCode]);
        case 'LAC': return new Set(['BUF', gameTeamCode, 'SDC']);
        case 'LAL': return new Set([gameTeamCode, 'MNL']);
        case 'MEM': return new Set([gameTeamCode, 'VAN']);
        case 'NJN': return new Set(['BRK', 'NJA', gameTeamCode, 'NYA']);
        case 'OKC': return new Set([gameTeamCode, 'SEA']);
        case 'PHI': return new Set([gameTeamCode, 'SYR']);
        case 'SAC': return new Set(['CIN', 'KCK', 'KCO', 'ROC', gameTeamCode]);
        case 'SAS': return new Set(['DLC', gameTeamCode, 'TEX']);
        case 'UTA': return new Set(['NOJ', gameTeamCode]);
        case 'WAS': return new Set(['BAL', 'CAP', 'CHP', 'CHZ', gameTeamCode, 'WSB']);
        default: return new Set([gameTeamCode]);
    }
}

export function getMatrix(teams) {
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
    const otherNames1 = checkTeamRenameMLB(team1);
    const otherNames2 = checkTeamRenameMLB(team2);
    var team1Check = false;
    var team2Check = false;
    console.log(playerTeams);
    otherNames1.forEach(t => {
        if (Object.keys(playerTeams).includes(t)) team1Check = true;
    });
    otherNames2.forEach(t => {
        if (Object.keys(playerTeams).includes(t)) team2Check = true;
    });
    return team1Check && team2Check;
}