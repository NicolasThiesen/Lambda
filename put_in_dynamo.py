import boto3
import json
import decimal

from datetime import datetime

def handler(event, context):
    now = datetime.now()
    now = now.strftime("%m/%d/%Y %H:%M:%S%f")
    data = json.loads(event["body"])
    if ("game" in data) and ("team" in data):
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('codigos')
        game = data["game"]
        team = data["team"]
        order = data["order"]
        response = table.put_item(
           Item={
                "date": now,
                "game": game,
                "team": team,
                "order": order
            }
        )
        r_status_code = int(response["ResponseMetadata"]["HTTPStatusCode"])
        if(r_status_code == 200):
            return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': json.dumps({"status": "Itens inseridos com sucesso!", "description": response})
            }
        else:
            return {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'body': json.dumps({"erro": "Algo de inesperado aconteceu ao inserir o item na tabela"})
            }
    else:
        return {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'body': json.dumps({"erro": "Tente ver se você está colocando devidamente 'codigo' e 'time' como as chaves do json body"})
        }
    
    