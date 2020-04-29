import json

data = json.loads('{ \n\t"time": "sc"\n}')
try:
    codigo = data["codigo"]
    time = data["time"]
except "Extra data" as err:
    print("erro")
    
