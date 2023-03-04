import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

function bbRefId(name, number) {
    const nameSplit = name.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });;
    const givenName = nameSplit[0];
    const surname = nameSplit.slice(-1)[0];
    return [surname[0], surname.slice(0, 5) + givenName.slice(0, 2) + '0' + number];
}

async function searchPlayer(name) {
    var count = 1;
    var first = true;
    var badInput = false;
    var searchResults = 80;
    while (true) {
        try {
            const [firstLetter, nameID] = bbRefId(name, count);
            const url = `https://www.baseball-reference.com/players/${firstLetter}/${nameID}.shtml`;
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
                console.log(body);
                const $ = cheerio.load(body);
                const teams = Set();
                $('#pitching_standard > tbody > .full').map((id, element) => {
                    const year = $(element).find('[data-stat=year_ID]').text();
                    console.log(year);
                    const team = $(element).find('[data-stat=team_ID]').text();
                    teams.add(team);
                });
                count++;
            }
        } catch (error) {
            console.log(error);
        }
    }
    if (badInput) return null;
    return searchResults;
}

searchPlayer('charlie morton');
