import sys

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
HEADERS = {"user-agent": USER_AGENT}
DEBUG = len(sys.argv) > 1 and sys.argv[1].lower() == 'debug'