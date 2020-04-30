var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
const toScanClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event,context) => {
    // TODO implement
    const data = JSON.parse(event.body)
    const pin = data["pin"];
    const getParams = {
        TableName: "Handshake"
    }
    const promise = toScanClient.scan(getParams).promise();
    const result = await promise;
    const dynamo_data = result.Items;
    let return_data = []
    for(var l in dynamo_data){
        let line = Object.entries(dynamo_data[l])
        if (line[1][1] == pin || line[2][1] == pin ) {
            return_data.push(dynamo_data[l])
        }
    }   
    return {
        statusCode: 200,
        body: JSON.stringify({status: 'Consulta completada com sucesso!', data: return_data}),
    }
};
