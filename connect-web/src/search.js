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
    // while (true && count <= 15) {
    try {
        const [firstLetter, nameID] = bbRefId(name, count);
        const url = `https://www.baseball-reference.com/players/${firstLetter}/${nameID}.shtml`;
        console.log(url);
        const response = await fetch(url, { 'mode': 'cors' });
        console.log(response.status);
        if (response.status != 200) {
            badInput = first;
            // break;
        } else {
            first = false;
            badInput = false;
            const body = await response.text();
            const $ = cheerio.load(body);
            var start = Number.MAX_SAFE_INTEGER;
            var end = Number.MIN_SAFE_INTEGER;
            const teams = new Set();
            const playerName = $('h1').text();
            console.log(playerName);
            var searchFields = $('#pitching_standard > tbody > .full, .partial_table');
            if ($('#pitching_standard > tbody > .full').length == 0) {
                searchFields = $('#batting_standard > tbody > .full, .partial_table')
            }
            searchFields.map((id, element) => {
                const year = parseInt($(element).find('[data-stat=year_ID]').text());
                if (year >= end) end = year;
                if (year <= start) start = year;
                const team = $(element).find('[data-stat=team_ID]').text();
                console.log(team);
                if (team != 'TOT' && team.trim() != '') teams.add(team);
            });
            count++;
            searchResults.push({
                name: playerName,
                years: { start: start, end: end },
                teams: teams
            });
        }
    } catch (error) {
        console.log(error);
    }
    // }

    if (badInput) return null;
    return searchResults;
}
// searchPlayer('charlie morton');
// searchPlayer('lebron james');
