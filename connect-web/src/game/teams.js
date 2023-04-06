import sample from '@stdlib/random-sample';
import { getSportValue } from './search';

export const MLBTEAMS = [
    'ATL', 'NYM', 'WSN', 'PHI', 'MIA', // nl east
    'CHC', 'CIN', 'PIT', 'MIL', 'STL', // nl central
    'LAD', 'SDP', 'SFG', 'ARI', 'COL', // nl west
    'NYY', 'TOR', 'TBR', 'BOS', 'BAL', // al east
    'MIN', 'CLE', 'CHW', 'DET', 'KCR', // al central
    'HOU', 'LAA', 'SEA', 'TEX', 'OAK' // al west
]; // Based on names of logos

export const NBATEAMS = [
    'BOS', 'NYK', 'PHI', 'BRK', 'TOR', // atlantic
    'MIL', 'DET', 'CHI', 'CLE', 'IND', // central
    'ATL', 'MIA', 'WAS', 'CHO', 'ORL', // southeast
    'NOP', 'DAL', 'SAS', 'HOU', 'MEM', // southwest
    'MIN', 'DEN', 'OKC', 'UTA', 'POR', // northwest
    'LAL', 'GSW', 'PHO', 'SAC', 'LAC' // pacific
]; // Based on names of logos

export const NFLTEAMS = [
    'NYG', 'DAL', 'PHI', 'WAS', // nfc east
    'GNB', 'DET', 'MIN', 'CHI', // nfc north
    'ATL', 'NOR', 'CAR', 'TAM', // nfc south
    'SEA', 'RAM', 'CRD', 'SFO', // nfc west
    'NWE', 'NYJ', 'MIA', 'BUF', // afc east
    'PIT', 'CIN', 'CLE', 'RAV', // afc north
    'CLT', 'HTX', 'OTI', 'JAX', // afc south
    'DEN', 'KAN', 'RAI', 'SDG' // afc west
]; // Based on names of logos

export function randomTeams(length, mode) {
    return sample(
        getSportValue(mode, {
            mlb: MLBTEAMS,
            nba: NBATEAMS,
            nfl: NFLTEAMS
        }),
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

export function checkTeamRenameNFL(gameTeamCode) {
    switch (gameTeamCode) {
        case 'CLT': return new Set(['BAL', gameTeamCode, 'IND']);
        case 'SDG': return new Set(['LAC', gameTeamCode]);
        default: return new Set([gameTeamCode]);
    }
}

export function getMatrix(rowTeams, colTeams) {
    const board = {};
    for (var i = 0; i < rowTeams.length; i++) {
        for (var j = 0; j < colTeams.length; j++) {
            board[[rowTeams[i], colTeams[j]]] = { coordinates: [i, j], player: null }
        }
    }
    return board;
}

export function checkPlayerTeams(teams, playerTeams, mode) {
    const [team1, team2] = teams;
    const otherNames1 = getSportValue(mode, {
        mlb: checkTeamRenameMLB(team1),
        nba: checkTeamRenameNBA(team1),
        nfl: checkTeamRenameNFL(team1),
    });
    const otherNames2 = getSportValue(mode, {
        mlb: checkTeamRenameMLB(team2),
        nba: checkTeamRenameNBA(team2),
        nfl: checkTeamRenameNFL(team2),
    });
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