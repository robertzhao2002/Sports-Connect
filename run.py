from bs4 import BeautifulSoup
import random
import requests

TEAMS = ['ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CHW', 'CIN', 'CLE', 'COL', 'DET', 'HOU', 'KCR', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK', 'PHI', 'PIT', 'SDP', 'SFG', 'SEA', 'STL', 'TBR', 'TEX', 'TOR', 'WSN']
side_length = int(input("Enter the number of teams you want on one side of the square: "))
teams = random.sample(TEAMS, side_length * 2)
game_state = {}
score = 0
bad_input = False
for i in range(side_length):
    for j in range(side_length, len(teams)):
        game_state[(teams[i], teams[j])] = ''
print(game_state)
def name_changes(name):
    if name == 'TBR':
        return 'TBD'
    elif name == 'WSN':
        return 'MON'
    else:
        return name

def bbref_id(name, number):
    name_lst = [n.strip() for n in name.split(' ')]
    surname = name_lst[-1]
    given_name = name_lst[0]
    return (surname[0], surname[:5]+given_name[:2]+'0'+str(number))

def check_teams(player):
    player_teams = player['teams']
    for pair in game_state:
        team_1_check = pair[0] or name_changes(pair[0])
        team_2_check = pair[1] or name_changes(pair[1])
        if team_1_check in player_teams and team_2_check in player_teams:
            game_state[pair] = player['name']
            return True
    return False

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
headers = {"user-agent": USER_AGENT}

while score < len(game_state):
    name_input = input("Please enter the name of a player: ")
    count = 1
    search_results = []
    first = True
    while True:
        name = bbref_id(name_input, count)
        URL = "https://www.baseball-reference.com/players/{}/{}.shtml".format(name[0], name[1])
        resp = requests.get(URL, headers=headers)
        if resp.status_code != 200:
            bad_input = first
            break
        else:
            first = False
            bad_input = False
            soup = BeautifulSoup(resp.content, "html.parser")
            results = soup.find_all('table', {'id': 'batting_standard'})
            if len(results) == 0:
                results = soup.find_all('table', {'id': 'pitching_standard'})[0].find_all('tbody')[0].findAll('tr', {'class': ['full', 'partial_table']})
            else:
                results = results[0].find_all('tbody')[0].findAll('tr', {'class': ['full', 'partial_table']})
            player_name = soup.find_all('h1')[0].text.strip()
            teams = set()
            for r in results:
                t_result = r.findAll('td', {'data-stat': 'team_ID'})
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
            search_results.append(player_profile)
            count += 1
    if not bad_input:
        if len(search_results) > 1:
            for i, s in enumerate(search_results):
                year_range = '{}-{}'.format(s['years'][0], s['years'][1]) 
                print(chr(0x2460+i), '{}:'.format(s['name']), year_range)
            choice = int(input("Which one? "))
            if check_teams(search_results[choice-1]): 
                print(search_results[choice-1])
                score += 1
        else:
            if check_teams(search_results[0]): 
                print(search_results)
                score += 1
    else:
        print('Bad input :(')
    print(game_state)
