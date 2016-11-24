
a = {"a":{1:1,3:2},"b":{3:3,4:4}}
m = {"a":{1:1,2:2},"c":{3:3,4:4}}
for p,q in a.items():
    m.update(a)

print m