import * as cheerio from 'cheerio';

export function bbRefId(name, number) {
    const nameSplit = name.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });;
    const givenName = nameSplit[0];
    const surname = nameSplit.slice(-1)[0];
    return [surname[0], surname.slice(0, 5) + givenName.slice(0, 2) + '0' + number];
}

export async function searchPlayer(name) {
    var count = 1;
    var first = true;
    var badInput = false;
    var searchResults = [];
    while (true && count <= 15) {
        try {
            const [firstLetter, nameID] = bbRefId(name, count);
            const url = `https://www.baseball-reference.com/players/${firstLetter}/${nameID}.shtml`;
            // console.log(url);
            const response = await fetch(url, { 'mode': 'cors' });
            // console.log(response.status);
            if (response.status != 200) {
                badInput = first;
                break;
            } else {
                first = false;
                badInput = false;
                const body = await response.text();
                const $ = cheerio.load(body);
                var start = Number.MAX_SAFE_INTEGER;
                var end = Number.MIN_SAFE_INTEGER;
                const teams = new Set();
                const playerName = $('h1').text().trim();
                const playerImgUrl = $('.media-item > img').attr('src');
                var searchFields = $('#pitching_standard > tbody > .full, .partial_table');
                if ($('#pitching_standard > tbody > .full').length == 0) {
                    searchFields = $('#batting_standard > tbody > .full, .partial_table')
                }
                searchFields.map((_, element) => {
                    const year = parseInt($(element).find('[data-stat=year_ID]').text().trim());
                    if (year >= end) end = year;
                    if (year <= start) start = year;
                    const team = $(element).find('[data-stat=team_ID]').text().trim();
                    if (team != 'TOT' && team.trim() != '') teams.add(team);
                });
                count++;
                searchResults.push({
                    name: playerName,
                    imageUrl: playerImgUrl,
                    years: { start: start, end: end },
                    teams: teams
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (badInput) return null;
    // console.log(searchResults);
    return searchResults;
}

export async function singleSolution(teamPair, pitcher = false, inGame = false) {
    const firstTeam = teamPair[0];
    const secondTeam = teamPair[1];
    const unknown = { playerName: 'unknown', playerStat: 0 };
    const bestTwo = { [firstTeam]: unknown, [secondTeam]: unknown };
    const url = `https://www.baseball-reference.com/friv/multifranchise.cgi?level=franch&t1=${firstTeam}&t2=${secondTeam}`
    const response = await fetch(url, { 'mode': 'cors' });
    console.log(response.status);
    if (response.status == 200) {
        const body = await response.text();
        const $ = cheerio.load(body);
        const idKey = pitcher ? 'pitch_stats' : 'bat_stats';
        $(`#${idKey} > tbody > tr`).map((_, element) => {
            const statKey1 = pitcher ? `${firstTeam}_IP` : `${firstTeam}_HR`
            const statKey2 = pitcher ? `${secondTeam}_IP` : `${secondTeam}_HR`
            const name = $(element).find('th > a').text().trim();
            const statRaw1 = $(element).find(`td[data-stat=${statKey1}]`).text().trim();
            const statRaw2 = $(element).find(`td[data-stat=${statKey2}]`).text().trim();
            const stat1 = (statRaw1.length == 0) ? 0 : parseFloat(statRaw1);
            const stat2 = (statRaw2.length == 0) ? 0 : parseFloat(statRaw2);
            if (stat1 >= bestTwo[firstTeam].playerStat) bestTwo[firstTeam] = { playerName: name, playerStat: stat1 };
            if (stat2 >= bestTwo[secondTeam].playerStat) bestTwo[secondTeam] = { playerName: name, playerStat: stat2 };
        });
    }
    const result = Object.values(bestTwo).map(p => p.playerName);
    // console.log(result);
    // console.log(bestTwo);
    if (inGame) return result[0];
    return new Set(result);
}

export async function possibleSolution(teams) {
    const solution = {};
    for (var i = 0; i < teams.length; i++) {
        const teamPair = teams[i].split(',');
        solution[teamPair] = { hitters: null, pitchers: null };
        solution[teamPair].hitters = await singleSolution(teamPair, false);
        solution[teamPair].pitchers = await singleSolution(teamPair, true);
    }
    return solution;
}

// searchPlayer('chris young').then(function (result) {
//     console.log(result);
// });
// console.log(searchPlayer('charlie morton'));
// singleSolution(['PHI', 'TOR'], true);

