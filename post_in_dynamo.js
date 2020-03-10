const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    const requestBody = JSON.parse(event.body);
    console.log(requestBody)
    if (requestBody.codigo && requestBody.time) {
        
        const codigo = requestBody.codigo;
        const time = requestBody.time;
        var params = {
            TableName: "codigos",
            Item: {
                "date": Date.now(),
                "codigo": "ASDF"
            }
        }
        
        try {
            dynamoDb.put(params, function(err,data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
            });
            return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify(requestBody)
        }
        } catch (e) {
            return {
                'statusCode': 500,
                'headers': { 'Content-Type': 'application/json' },
                'body': JSON.stringify({"message":"O valores não puderam ser inceridos na tabela devido ao seguinte erro:"+e})
            }
        }
        
    }else{
        return {
            'statusCode': 500,
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify({"message":"chaves inválidas. Tente ver se você está colocando devidamente 'chave' e 'time' como as chaves do json body "})
        }
    }
}