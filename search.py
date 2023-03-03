from constants import HEADERS, DEBUG, MODE, BASKETBALL, BASEBALL, HTML
from bs4 import BeautifulSoup
import requests

season_tag, season_classes = ('tr', {'class': ['full{}'.format('' if BASEBALL else '_table'), 'partial_table']})

def bbref_id(name, number):
    name_lst = [n.strip() for n in name.split(' ')]
    surname = name_lst[-1]
    given_name = name_lst[0]
    return (surname[0], surname[:5]+given_name[:2]+'0'+str(number))

def search_player(name_input):
    search_results = []
    bad_input = False
    first = True
    count = 1
    while True:
        name = bbref_id(name_input, count)
        URL = "https://www.{}-reference.com/players/{}/{}.{}".format(MODE, name[0], name[1], HTML)
        resp = requests.get(URL, headers=HEADERS)
        if resp.status_code != 200:
            bad_input = first
            break
        else:
            first = False
            bad_input = False
            soup = BeautifulSoup(resp.content, "html.parser")
            results = None
            if BASEBALL:
                results = soup.find_all('table', {'id': 'pitching_standard'})
                if len(results) == 0:
                    results = soup.find_all('table', {'id': 'batting_standard'})[0].find_all('tbody')[0].findAll(season_tag, season_classes)
                else:
                    results = results[0].find_all('tbody')[0].findAll(season_tag, season_classes)
            elif BASKETBALL:
                results = soup.find_all('table', {'id': 'per_game'})[0].find_all('tbody')[0].findAll(season_tag, season_classes)
            player_name = soup.find_all('h1')[0].text.strip()
            teams = set()
            for r in results:
                team_id = 'team_ID' if BASEBALL else 'team_id'
                t_result = r.findAll('td', {'data-stat': team_id})
                team_name = t_result[0].text if len(t_result) > 0 else 'TOT'
                if team_name != 'TOT' and team_name.strip() != '':
                    teams.add(team_name)
            start_year = results[0].get('id')[-4:]
            end_year = 2022
            if results[-1]['class'][0] == 'partial_table':
                end_year = results[-1].find_all('th')[0].text
            else:
                end_year = results[-1].get('id')[-4:]
            player_profile = {
                'name': player_name,
                'years': (start_year, end_year), 
                'teams': teams
            }
            if DEBUG: print(player_profile)
            search_results.append(player_profile)
            count += 1
    if bad_input: return None
    return search_results

def suggest_single_solution(team_pair, pitching=False, in_game=False):
    first_team = team_pair[0]
    second_team = team_pair[1]
    URL = 'https://www.baseball-reference.com/friv/multifranchise.cgi?level=franch&t1={}&t2={}'.format(first_team, second_team)
    resp = requests.get(URL, headers=HEADERS)
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        id_key = 'pitch_stats' if pitching else 'bat_stats'
        results = soup.find_all('table', {'id': id_key})[0].findAll('tbody')[0].findAll('tr')
        unknown = {'name': 'unknown', 'stat': 0}
        best_two = {first_team: unknown, second_team: unknown}
        for r in results:
            player_name = r.findAll('th', {'data-stat': 'player'})[0].findAll('a')[0].text
            stat_key = '{}_IP' if pitching else '{}_HR'
            first_stat_txt = r.findAll('td', {'data-stat': stat_key.format(first_team)})[0].text
            first_stat_val = 0 if len(first_stat_txt.strip()) == 0 else float(first_stat_txt)
            second_stat_txt = r.findAll('td', {'data-stat': stat_key.format(second_team)})[0].text
            second_stat_val = 0 if len(second_stat_txt.strip()) == 0 else float(second_stat_txt)
            if first_stat_val >= best_two[first_team]['stat']:
                best_two[first_team] = {'name': player_name, 'stat': first_stat_val}
            if second_stat_val >= best_two[second_team]['stat']:
                best_two[second_team] = {'name': player_name, 'stat': second_stat_val}

        result = list(map(lambda player: player['name'], best_two.values()))
        if in_game: return result[0]
        return set(result)

def possible_solution(teams):
    solution = {}
    for t in teams.keys():
        best_players = {
            'hitters': suggest_single_solution(team_pair=t, pitching=False),
            'pitchers': suggest_single_solution(team_pair=t, pitching=True)
        }
        solution[t] = best_players
    return solution

# print(search_player('lebron james'))
# print(suggest_single_solution(('PHI', 'TOR')))
# print(suggest_single_solution(('PHI', 'TOR'), pitching=True))