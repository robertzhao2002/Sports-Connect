from bs4 import BeautifulSoup
import requests
from constants import HEADERS

MLB = []
NBA = []
NFL = []

URL = "https://www.baseball-reference.com/teams"
resp = requests.get(URL, headers=HEADERS)
if resp.status_code == 200:
    soup = BeautifulSoup(resp.content, "html.parser")
    results = soup.find_all('td', {'class': 'left', 'data-stat': 'franchise_name'})
    for i, r in enumerate(results):
        MLB.append(r.find_all('a')[0].get('href')[-4:-1])

def name_changes(name):
    if name == 'TBD':
        return ('TBR',)
    elif name == 'ANA':
        return ('LAA', 'CAL')
    elif name == 'FLA':
        return ('MIA',)
    elif name == 'WSN':
        return ('MON',)
    else:
        return name