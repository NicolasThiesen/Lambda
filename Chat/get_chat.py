import boto3
import json
import os

def handler(event,context):
    dynamodb = boto3.resource("dynamodb")
    if("id_conversa" in event):
        # get the data
        id_conversa = event["id_conversa"]

        table_nome = os.environ["DYNAMO_TABLE"]
        table = dynamodb.Table(table_nome)

        res = table.get_item(
           Key={
               "id": id_conversa
           } 
        )
        if ("Item" in res):
            item = res["Item"]
            conversa = item["Conversa"]
            return return_message("status", "Consulta efetuada com sucesso!", conversa )
        else:
            return return_message("erro", "Essa conversa não existe", "")
    else:
        return return_message( "erro", "Por favor verifique se o item 'id_conversa' está sendo passado no json", "" )
def return_message(mensage_key, mensage, conversa):
    if (conversa!=""):
        return {mensage_key: mensage,  "conversa": conversa}
    return {mensage_key: mensage}