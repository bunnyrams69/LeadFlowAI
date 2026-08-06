import urllib.request
import urllib.parse
import re

query = 'site:linkedin.com/in "dental clinic"'
url = 'https://html.duckduckgo.com/html/'
data = urllib.parse.urlencode({'q': query}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    links = set(re.findall(r'href="(https://[a-z]{0,3}\.?linkedin\.com/in/[^"]+)"', html))
    print(links)
except Exception as e:
    print('Error:', e)
