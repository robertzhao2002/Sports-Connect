from bs4 import BeautifulSoup
import requests
from constants import HEADERS, MODE, BASKETBALL

def name_changes(name):
    if name == 'TBD':
        return ('TBR',)
    elif name == 'ANA':
        return ('LAA', 'CAL')
    elif name == 'FLA':
        return ('MIA',)
    elif name == 'WSN':
        return ('MON',)
    elif name == 'NJN':
        return ('BRK',)
    else:
        return name
    
def get_query_fields(mode):
    if mode == 'baseball':
        return ('td', {'class': 'left', 'data-stat': 'franchise_name'})
    elif mode == 'basketball':
        return ('tr', {'class': 'full_table'})

TEAM_CODES = []
URL = "https://www.{}-reference.com/teams".format(MODE)

resp = requests.get(URL, headers=HEADERS)
if resp.status_code == 200:
    soup = BeautifulSoup(resp.content, "html.parser")
    args = get_query_fields(MODE)
    if BASKETBALL:
        results = soup.find_all('table', {'id': 'teams_active'})[0].find_all(args[0], args[1])
    else:
        results = soup.find_all(args[0], args[1])
    for r in results:
        TEAM_CODES.append(r.find_all('a')[0].get('href')[-4:-1])

# print(TEAM_CODES)

