import demjson
import json
a=[ { 'a' : 1, 'b' : 2, 'c' : 3, 'd' : 4, 'e' : 5 } ]
b=demjson.encode(a)
print b
