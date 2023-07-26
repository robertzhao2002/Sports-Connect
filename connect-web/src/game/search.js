import * as cheerio from 'cheerio';
import { teamID } from './teams';

export function bbRefId(name, number) {
    const nameSplit = name.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    const givenName = nameSplit[0];
    const surname = nameSplit.slice(-1)[0];
    return [surname[0], surname.slice(0, 5) + givenName.slice(0, 2) + '0' + number];
}

export function pfRefId(name, number) {
    const nameSplit = name.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    const givenName = nameSplit[0].slice(0, 2);
    const surname = nameSplit.slice(-1)[0].slice(0, 4);
    return [
        surname[0].toUpperCase(),
        surname.charAt(0).toUpperCase() + surname.slice(1, 4)
        + givenName.charAt(0).toUpperCase() + givenName.charAt(1) + '0' + number
    ];
}

function getSearchFields(mode, $) {
    const suffix = `> tbody > .full_table, .partial_table`;
    switch (mode) {
        case 'mlb': {
            const pitching = $('#pitching_standard > tbody > .full');
            const mlbSuffix = '> tbody > .full, .partial_table';
            if (pitching.length == 0) {
                return $(`#batting_standard ${mlbSuffix}`);
            }
            else {
                return $(`#pitching_standard ${mlbSuffix}`);;
            }
        }
        case 'nba': return $(`#per_game ${suffix}`);
        case 'nfl': {
            const possibleSearches = [
                $(`#passing ${suffix}`),
                $(`#defense ${suffix}`),
                $(`#games_played ${suffix}`),
                $(`#kicking ${suffix}`),
                $(`#punting ${suffix}`),
                $(`#receiving_and_rushing ${suffix}`),
                $(`#rushing_and_receiving ${suffix}`),
            ];
            var maxSize = possibleSearches[0].length;
            var result = possibleSearches[0];
            for (const s of possibleSearches) {
                if (s.length > maxSize) {
                    maxSize = s.length;
                    result = s;
                }
            }
            if (maxSize > 0) return result;
            else return {};
        }
        default: throw 'Unsupported';
    }
}

function getTeamID(mode, element) {
    switch (mode) {
        case 'mlb': return element.find('[data-stat=team_ID]').text().trim();
        case 'nba': return element.find('[data-stat=team_id]').text().trim();
        case 'nfl': {
            const teamLink = element.find('[data-stat=team]').find('a').attr('href')
            if (teamLink != undefined) {
                return teamLink.slice(7, 10).trim().toUpperCase();
            } else {
                return 'multiple';
            }
        }
        default: throw 'Unsupported';
    }
}

function getUrl(sportName) {
    return `https://www.${sportName}-reference.com`;
}

export function getSportValue(mode, options) {
    switch (mode) {
        case 'mlb': return options.mlb;
        case 'nba': return options.nba;
        case 'nfl': return options.nfl;
        default: throw 'Unsupported';
    }
}

export async function searchPlayer(name, mode, browser = true) {
    var count = getSportValue(mode, { mlb: 1, nba: 1, nfl: 0 });
    var first = true;
    var badInput = false;
    var searchResults = [];
    const sportName = getSportValue(mode, { mlb: 'baseball', nba: 'basketball', nfl: 'pro-football' });
    const ext = getSportValue(mode, { mlb: 'shtml', nba: 'html', nfl: 'htm' });;
    while (true && count <= 15) {
        try {
            const [firstLetter, nameID] = getSportValue(
                mode,
                {
                    mlb: bbRefId(name, count),
                    nba: bbRefId(name, count),
                    nfl: pfRefId(name, count)
                }
            );
            const playerRefUrl = `${getUrl(sportName)}/players/${firstLetter}/${nameID}.${ext}`;
            const url = `${(browser) ? 'https://cors-anywhere.herokuapp.com/' : ''}${playerRefUrl}`;
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
                var searchFields = getSearchFields(mode, $);
                console.log(Object.keys(searchFields));
                if (Object.keys(searchFields) != 0) {
                    for (const element of searchFields) {
                        var year = 0;
                        if (mode == 'mlb') {
                            year = parseInt($(element).find('[data-stat=year_ID]').text().trim());
                        } else if (mode == 'nba') {
                            console.log('nba');
                            const idValue = $(element).attr('id');
                            if (idValue != undefined) {
                                year = parseInt(idValue.slice(-4).trim());
                                if (year < end) break;
                            }
                            else {
                                year = NaN;
                            }
                        } else if (mode == 'nfl') {
                            console.log('nfl');
                            year = parseInt($(element).find('[data-stat=year_id]').text().trim());
                            console.log("parsed year", year);
                            if (isNaN(year)) {
                                console.log('year is not a number');
                                year = teamEndYear;
                            }
                        }
                        console.log("Year", year);
                        if (year >= end) end = year;
                        if (year <= start) start = year;
                        const team = getTeamID(mode, $(element));
                        if (team == 'TOT' || team == 'multiple') {
                            if (team == 'multiple') teamEndYear = year;
                            continue;
                        }
                        if (team != prevTeam && team != 'TOT' && team.trim() != '') {
                            teamStartYear = year;
                            teamEndYear = year;
                            if (team in teams) {
                                const a = { start: teamStartYear, end: teamEndYear };
                                if (!teams[team].find(s => a.start == a.start && s.end == a.end))
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
                        prevTeam = team;
                    };
                }
                count++;
                console.log(teams);
                searchResults.push({
                    name: playerName,
                    imageUrl: playerImgUrl,
                    refUrl: playerRefUrl,
                    years: { start: start, end: end },
                    teams: teams
                });
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }

    if (badInput) return null;
    // console.log(searchResults);
    return searchResults;
}

function getBest2(body, firstTeam, secondTeam, idKey, statKey1, statKey2, sport) {
    const unknown = { playerName: 'unknown', playerStat: 0, url: 'unknown' };
    const bestTwo = { [firstTeam]: unknown, [secondTeam]: unknown };
    const $ = cheerio.load(body);
    $(`#${idKey} > tbody > tr`).map((_, element) => {
        const name = $(element).find('th > a').text().trim();
        const urlSuffix = $(element).find('th > a').attr("href");
        const statRaw1 = $(element).find(`td[data-stat=${statKey1}]`).text().trim();
        const statRaw2 = $(element).find(`td[data-stat=${statKey2}]`).text().trim();
        const stat1 = (statRaw1.length == 0) ? 0 : parseFloat(statRaw1);
        const stat2 = (statRaw2.length == 0) ? 0 : parseFloat(statRaw2);
        if (stat1 >= bestTwo[firstTeam].playerStat) bestTwo[firstTeam] = {
            playerName: name, playerStat: stat1, url: `${getUrl(sport)}${urlSuffix}`
        };
        if (stat2 >= bestTwo[secondTeam].playerStat) bestTwo[secondTeam] = {
            playerName: name, playerStat: stat2, url: `${getUrl(sport)}${urlSuffix}`
        };
    });
    return bestTwo;
}

function getBest2Mlb(body, firstTeam, secondTeam, pitcher) {
    return getBest2(
        body,
        firstTeam,
        secondTeam,
        pitcher ? 'pitch_stats' : 'bat_stats',
        pitcher ? `${firstTeam}_IP` : `${firstTeam}_HR`,
        pitcher ? `${secondTeam}_IP` : `${secondTeam}_HR`,
        "baseball"
    );
}

function getBest2Nba(body, firstTeam, secondTeam) {
    return getBest2(
        body,
        firstTeam,
        secondTeam,
        "multifranchise_stats_0",
        `${firstTeam}_games`,
        `${secondTeam}_games`,
        "basketball"
    );
}

export async function getHint(teamPair, inGame, mode) {
    const firstTeam = teamID(teamPair[0], mode);
    const secondTeam = teamID(teamPair[1], mode);
    console.log(firstTeam, secondTeam)
    const url = `https://cors-anywhere.herokuapp.com/${getUrl(
        getSportValue(mode, {
            mlb: 'baseball',
            nba: 'basketball',
            nfl: 'football'
        })
    )
        }/friv/${getSportValue(mode, {
            mlb: 'multifranchise',
            nba: 'players-who-played-for-multiple-teams-franchises',
            nfl: 'multifranchise'
        })}.${getSportValue(mode, {
            mlb: 'cgi',
            nba: 'fcgi',
            nfl: 'cgi'
        })}?level=franch&t1=${firstTeam}&t2=${secondTeam}`
    const response = await fetch(url);
    console.log(response.status);
    if (response.status == 200) {
        const body = await response.text();
        const bestTwo = Object.values(
            getSportValue(mode, {
                mlb: getBest2Mlb(body, firstTeam, secondTeam, false),
                nba: getBest2Nba(body, firstTeam, secondTeam),
                nfl: "Coming Soon"
            })
        ).map(p => `${p.playerName}..${p.url}`);
        if (!inGame) {
            return getSportValue(mode, {
                mlb: {
                    hitters: bestTwo,
                    pitchers: Object.values(
                        getBest2Mlb(body, firstTeam, secondTeam, true)
                    ).map(p => `${p.playerName}..${p.url}`)
                },
                nba: bestTwo,
                nfl: "Coming Soon"
            });
        } else {
            console.log(bestTwo);
            return bestTwo[0];
        }
    }
    return null;
}

export async function possibleSolution(teams, mode) {
    console.log("searching...");
    const solution = {};
    for (var i = 0; i < teams.length; i++) {
        const teamPair = teams[i].split(',');
        const teamPairQuery = [teamID(teamPair[0], mode), teamID(teamPair[1], mode)];
        solution[teamPair] = getSportValue(mode, { mlb: { hitters: null, pitchers: null }, nba: null });
        const solutionObj = await getHint(teamPairQuery, false, mode)
        solution[teamPair] = solutionObj;
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