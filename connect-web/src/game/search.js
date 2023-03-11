import * as cheerio from 'cheerio';

export function bbRefId(name, number) {
    const nameSplit = name.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });;
    const givenName = nameSplit[0];
    const surname = nameSplit.slice(-1)[0];
    return [surname[0], surname.slice(0, 5) + givenName.slice(0, 2) + '0' + number];
}

export async function searchPlayer(name, mlb = true, browser = true) {
    var count = 1;
    var first = true;
    var badInput = false;
    var searchResults = [];
    const sportName = (mlb) ? "baseball" : "basketball";
    const ext = (mlb) ? "shtml" : "html";
    while (true && count <= 15) {
        try { //
            const [firstLetter, nameID] = bbRefId(name, count);
            const url = `${(browser) ? 'https://cors-anywhere.herokuapp.com/' : ''}https://www.${sportName}-reference.com/players/${firstLetter}/${nameID}.${ext}`;
            console.log(url);
            const response = await fetch(url);
            console.log(response.status);
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
                var teamStartYear = 0;
                var teamEndYear = 0;
                var prevTeam = null;
                const teams = {};
                const playerName = $('h1').text().trim();
                const playerImgUrl = $('.media-item > img').attr('src');
                var searchFields = $('#pitching_standard > tbody > .full, .partial_table');
                if ($('#pitching_standard > tbody > .full').length == 0) {
                    if (mlb) {
                        searchFields = $('#batting_standard > tbody > .full, .partial_table');
                    } else {
                        searchFields = $('#per_game > tbody > .full_table, .partial_table');
                    }

                }
                for (const element of searchFields) {
                    var year = 0;
                    if (mlb) {
                        year = parseInt($(element).find('[data-stat=year_ID]').text().trim());
                    } else {
                        const idValue = $(element).attr('id');
                        if (idValue != undefined) {
                            year = parseInt(idValue.slice(-4).trim());
                            if (year < end) break;
                        }
                        else {
                            year = NaN;
                        }
                    }
                    console.log("Year", year);
                    if (year >= end) end = year;
                    if (year <= start) start = year;
                    const team = $(element).find(`[data-stat=${(mlb) ? 'team_ID' : 'team_id'}]`).text().trim();
                    if (team == 'TOT') continue;
                    if (team != prevTeam && team != 'TOT' && team.trim() != '') {
                        teamStartYear = year;
                        teamEndYear = year;
                        if (team in teams) {
                            const a = { start: teamStartYear, end: teamEndYear };
                            teams[team].push(a);
                        }
                        else {
                            teams[team] = [{ start: teamStartYear, end: teamEndYear }];
                        }
                    }
                    if (team != 'TOT' && team.trim() != '') {
                        const stints = teams[team].length;
                        teams[team][stints - 1].end = year;
                    }
                    if (team != 'TOT') prevTeam = team;
                };
                count++;
                console.log(teams);
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
    const url = `https://cors-anywhere.herokuapp.com/https://www.baseball-reference.com/friv/multifranchise.cgi?level=franch&t1=${firstTeam}&t2=${secondTeam}`
    const response = await fetch(url);
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

// searchPlayer('barry zito', true, false).then(function (result) {
//     console.log(result[0].teams['OAK'].forEach(a => {
//         console.log(a);
//     }));
// });
// console.log(searchPlayer('charlie morton'));
// searchPlayer('tracy mcgrady', false, false).then(function (result) {
//     result[0].teams['HOU'].forEach(a => {
//         console.log(a);
//     })
//     console.log(result);
// });
