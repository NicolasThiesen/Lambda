import boto3
import json
import os

def handler(event,context):
    dynamodb = boto3.resource("dynamodb")
    if("email_usuario" in event) and ("email_profissional" in event):
        # get the data
        email_usuario = event["email_usuario"]
        email_profissional = event["email_profissional"]

        table_nome = os.environ["DYNAMO_TABLE"]
        table = dynamodb.Table(table_nome)
        
        id_conversa = email_usuario + ":" + email_profissional 

        res = table.get_item(
           Key={
               "id": id_conversa
           } 
        )
        if ("Item" in res):
            item = res["Item"]
            return return_message("status", "Conversa existente", item )
        else:
            res = table.put_item(
                Item={
                    "id": id_conversa,
                    "Conversa": {}
                }
            )
            r_status = int(res["ResponseMetadata"]["HTTPStatusCode"])
            if(r_status == 200):
                return return_message("status", "Itens Inseridos com sucesso!", id_conversa )
            else:
                return return_message("erro", "Ocorreu algum problema ao inserir os items no Banco de dados", "")
    else:
        return return_message( "erro", "Por favor verifique se todos os itens 'email_usuario', 'email_profissional' estão sendo passados no json", "" )
def return_message(mensage_key, mensage, id_conversa):
    if (id_conversa!=""):
        return {mensage_key: mensage,  "id_conversa": id_conversa}
    return {mensage_key: mensage}