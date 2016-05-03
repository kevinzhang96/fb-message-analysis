import json, random, string
from pprint import pprint

with open('messages.json') as data_file:
    data = json.load(data_file, encoding="ISO-8859-1")

func = lambda str: ''.join(random.choice(string.lowercase) for _ in xrange(len(str)))

for key, values in data.items():
    for val in values:
        tokens = val['body'].split()
        repl = map(func, tokens)
        val['body'] = ' '.join(repl) 

with open('processed.json', 'w') as out_file:
    json.dump(data, out_file)
