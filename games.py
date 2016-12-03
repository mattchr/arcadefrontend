import requests
from bs4 import BeautifulSoup


class GameInfo(object):
    def __init__(self, internal_name):
        self.internal_name = internal_name
        self._name = None
        self._marquee = None

    @property
    def name(self):
        if not self._name:
            response = requests.get('http://www.mamedb.com/game/{}'.format(self.internal_name))
            if response.status_code != requests.codes.ok:
                raise IOError
            soup = BeautifulSoup(response.text, "html.parser")
            self._name = soup.find_all('h1')[0].text.split("(MAME version")[0].rstrip()
        return self._name

    @property
    def marquee(self):
        if not self._marquee:
            url = 'http://www.mamedb.com/marquees.small/{}.jpeg'.format(self.internal_name)
            response = requests.get(url)
            if response.status_code != requests.codes.ok:
                raise IOError
            self._marquee = response.content
        return self._marquee
