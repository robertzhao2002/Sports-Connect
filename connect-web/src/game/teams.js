import sample from '@stdlib/random-sample';

const MLBTEAMS = [
    'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CHW',
    'CIN', 'CLE', 'COL', 'DET', 'HOU', 'KCR',
    'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM',
    'NYY', 'OAK', 'PHI', 'PIT', 'SDP', 'SEA',
    'SFG', 'STL', 'TBR', 'TEX', 'TOR', 'WSN'
] // Based on names of logos

const NBATEAMS = [
    'ATL', 'BOS', 'BRK', 'CHI', 'CHO', 'CLE',
    'DAL', 'DEN', 'DET', 'GSW', 'HOU', 'IND',
    'LAC', 'LAL', 'MEM', 'MIA', 'MIL', 'MIN',
    'NOP', 'NYK', 'OKC', 'ORL', 'PHI', 'PHO',
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
        case 'ATL': return new Set([gameTeamCode, 'BSN', 'MLN']);
        case 'BAL': return new Set([gameTeamCode, 'MLA', 'SLB']);
        case 'LAA': return new Set(['ANA', 'CAL', gameTeamCode]);
        case 'LAD': return new Set(['BRO', gameTeamCode]);
        case 'MIA': return new Set(['FLA', gameTeamCode]);
        case 'MIL': return new Set([gameTeamCode, 'SEP']);
        case 'MIN': return new Set([gameTeamCode, 'WSH']);
        case 'OAK': return new Set(['KCA', gameTeamCode, 'PHA']);
        case 'SFG': return new Set(['NYG', gameTeamCode]);
        case 'TBR': return new Set(['TBD', gameTeamCode]);
        case 'TEX': return new Set([gameTeamCode, 'WSA']);
        case 'WSN': return new Set(['MON', gameTeamCode]);
        default: return new Set([gameTeamCode]);
    }
}

export function teamID(gameTeamCode) {
    switch (gameTeamCode) {
        case 'MIA': return 'FLA';
        case 'LAA': return 'ANA';
        case 'TBR': return 'TBD';
        default: return gameTeamCode;
    }
}

export function checkTeamRenameNBA(gameTeamCode) {
    switch (gameTeamCode) {
        case 'ATL': return new Set([gameTeamCode, 'MLH', 'STL', 'TRI']);
        case 'BRK': return new Set([gameTeamCode, 'NJA', 'NJN', 'NYA']);
        case 'CHO': return new Set(['CHA', 'CHH', gameTeamCode]);
        case 'DEN': return new Set([gameTeamCode, 'DNR']);
        case 'DET': return new Set([gameTeamCode, 'FTW']);
        case 'GSW': return new Set([gameTeamCode, 'PHW', 'SFW']);
        case 'HOU': return new Set([gameTeamCode, 'SDR']);
        case 'IND': return new Set(['INA', gameTeamCode]);
        case 'LAC': return new Set(['BUF', gameTeamCode, 'SDC']);
        case 'LAL': return new Set([gameTeamCode, 'MNL']);
        case 'MEM': return new Set([gameTeamCode, 'VAN']);
        case 'NOP': return new Set(['NOH', 'NOK', gameTeamCode]);
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

export function checkPlayerTeams(teams, playerTeams, mlb = true) {
    const [team1, team2] = teams;
    const otherNames1 = (mlb) ? checkTeamRenameMLB(team1) : checkTeamRenameNBA(team1);
    const otherNames2 = (mlb) ? checkTeamRenameMLB(team2) : checkTeamRenameNBA(team2);
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