import json
import gzip
import base64
import requests


def handler(event, context):
    data = event["awslogs"]["data"]
    decode = base64.b64decode(data)
    decompress_data = gzip.decompress(decode)
    log_data = json.loads(decompress_data)
    log = log_data["logEvents"][0]["message"].split()
    for l in log: 
        if l=="Warning:":
            code =  log[-2]+log[-1]
            post = requests.post("http://18.217.92.241/api.php?team=sc&refund="+code)
            print(post)