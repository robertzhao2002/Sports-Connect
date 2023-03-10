from bs4 import BeautifulSoup
import requests
from constants import HEADERS, MODE, BASKETBALL

def name_changes_mlb(team): 
    match (team):
        case 'ANA': return set(['ANA', 'CAL', 'LAA'])
        case 'ATL': return set(['ATL', 'BSN', 'MLN'])
        case 'BAL': return set(['BAL', 'MLA', 'SLB'])
        case 'FLA': return set(['FLA', 'MIA'])
        case 'LAD': return set(['BRO', 'LAD'])
        case 'MIL': return set(['MIL', 'SEP'])
        case 'MIN': return set(['MIN', 'WSH'])
        case 'OAK': return set(['KCA', 'OAK', 'PHA'])
        case 'SFG': return set(['NYG', 'SFG'])
        case 'TBD': return set(['TBD', 'TBR'])
        case 'TEX': return set(['TEX', 'WSA'])
        case 'WSN': return set(['MON', 'WSN'])
        case _: return set([team])

def name_changes_nba(team):
    match (team):
        case 'ANA': return set(['ANA', 'CAL', 'LAA'])
        case 'ATL': return set(['ATL', 'BSN', 'MLN'])
        case 'BAL': return set(['BAL', 'MLA', 'SLB'])
        case 'FLA': return set(['FLA', 'MIA'])
        case 'LAD': return set(['BRO', 'LAD'])
        case 'MIL': return set(['MIL', 'SEP'])
        case 'MIN': return set(['MIN', 'WSH'])
        case 'OAK': return set(['KCA', 'OAK', 'PHA'])
        case 'SFG': return set(['NYG', 'SFG'])
        case 'TBD': return set(['TBD', 'TBR'])
        case 'TEX': return set(['TEX', 'WSA'])
        case 'WSN': return set(['MON', 'WSN'])
        case _: return set([team])

def get_query_fields(mode):
    if mode == 'baseball':
        return ('td', {'class': 'left', 'data-stat': 'franchise_name'})
    elif mode == 'basketball':
        return ('tr', {'class': 'full_table'})

TEAM_CODES = [
    'ANA', 'ARI', 'ATL', 'BAL', 'BOS', 'CHC',
    'CHW', 'CIN', 'CLE', 'COL', 'DET', 'FLA',
    'HOU', 'KCR', 'LAD', 'MIL', 'MIN', 'NYM',
    'NYY', 'OAK', 'PHI', 'PIT', 'SDP', 'SEA',
    'SFG', 'STL', 'TBD', 'TEX', 'TOR', 'WSN'
]
# URL = "https://www.{}-reference.com/teams".format(MODE)
# # print(URL)
# resp = requests.get(URL, headers=HEADERS)
# # print(resp)
# if resp.status_code == 200:
#     soup = BeautifulSoup(resp.content, "html.parser")
#     args = get_query_fields(MODE)
#     if BASKETBALL:
#         results = soup.find_all('table', {'id': 'teams_active'})[0].find_all(args[0], args[1])
#     else:
#         results = soup.find_all(args[0], args[1])
#     for r in results:
#         TEAM_CODES.append(r.find_all('a')[0].get('href')[-4:-1])

# print(TEAM_CODES)

