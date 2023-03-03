import random, pprint
from teams import TEAM_CODES, name_changes
from search import search_player, suggest_single_solution, possible_solution

pp = pprint.PrettyPrinter(indent=4)
TEAMS = TEAM_CODES
side_length = int(input("Enter the number of teams you want on one side of the square: "))
teams = random.sample(TEAMS, side_length * 2)
game_state = {}
solution = None
score = 0
bad_input = False

for i in range(side_length):
    for j in range(side_length, len(teams)):
        game_state[(teams[i], teams[j])] = ''

# game_state  = {('PHI', 'TOR'): ''}
pp.pprint(game_state)

def check_teams(player):
    player_teams = player['teams']
    for pair in game_state:
        def check_name_changes(a):
            for n in name_changes(a):
                if n in player_teams:
                    return True
            return False
        team_1_check = pair[0] in player_teams or check_name_changes(pair[0])
        team_2_check = pair[1] in player_teams or check_name_changes(pair[1])
        if team_1_check and team_2_check and len(game_state[pair]) == 0:
            game_state[pair] = player['name']
            return True
    return False

def special_inputs(input_string):
    if input_string == 'help':
        for t,p in game_state.items():
            if len(p) == 0:
                print(t, suggest_single_solution(team_pair=t, in_game=True))
                break
    if input_string == 'solve':
        solution = possible_solution(game_state)
        pp.pprint(solution)
    return input_string

while score < len(game_state):
    name_input = input("Please enter the name of a player: ").lower()
    special_input = special_inputs(input_string=name_input)
    if special_input == 'help': 
        continue
    elif special_input == 'solve': 
        game_state = solution
        break
    count = 1
    search_results = search_player(name_input)
    if search_results is not None:
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
    pp.pprint(game_state)
