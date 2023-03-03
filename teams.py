MLB = []
NBA = []
NFL = []

from bs4 import BeautifulSoup
import requests

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
headers = {"user-agent": USER_AGENT}

URL = "https://www.baseball-reference.com/teams"
resp = requests.get(URL, headers=headers)
if resp.status_code == 200:
    soup = BeautifulSoup(resp.content, "html.parser")
    results = soup.find_all('td', {'class': 'left', 'data-stat': 'franchise_name'})
    for i, r in enumerate(results):
        MLB.append(r.find_all('a')[0].get('href')[-4:-1])

def name_changes(name):
    if name == 'TBD':
        return 'TBR'
    elif name == 'FLA':
        return 'MIA'
    elif name == 'WSN':
        return 'MON'
    else:
        return name