import boto3
import json
import os

def handler(event,context):
    dynamodb = boto3.resource("dynamodb")
    if("email_usuario" in event) and ("email_profissional" in event) :
        # get the data
        email_usuario = event["email_usuario"]
        email_profissional = event["email_profissional"]
        dados_msg = event["dados_msg"]
        
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
            if ("Conversa" in item ):
                conversa = item["Conversa"]
                conversa[len(conversa)+1] = dados_msg
                res = table.update_item(
                    Key={
                        "id": id_conversa
                    },
                    UpdateExpression="set Conversa=:c",
                    ExpressionAttributeValues={
                        ":c": conversa
                    },
                    ReturnValues="NONE"
                )
                if ( res["ResponseMetadata"]["HTTPStatusCode"] == 200) and ( res["ResponseMetadata"]["HTTPStatusCode"] == 200):
                    return {"Status": "Mensagem efetuada com sucesso"}
                else:
                    return {"erro": "Algo deu errado ao enviar a mensagem"}
    else:
        return return_message( "erro", "Por favor verifique se todos os itens 'email_usuario', 'email_profissional', 'dados_msg'", "" )

def return_message(mensage_key, mensage, id_conversa):
    if (id_conversa!=""):
        return {mensage_key: mensage,  "id_conversa": id_conversa}
    return {mensage_key: mensage}