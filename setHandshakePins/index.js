const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto")

exports.handler = async (event) => {
    // TODO implement
    const data = JSON.parse(event.body)
    const user_pin_1 = data["pin_1"];
    const user_pin_2 = data["pin_2"];
    
    const putParams = (id,user_pin_1,user_pin_2) => {
        return {
            TableName: "Handshake",
            Item: {
                id: id,
                timestamp: Date().toString(),
                pin_1: user_pin_1, 
                pin_2: user_pin_2
            }
        }
    }
    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    let id = crypto.createHash('sha1').update(current_date + random).digest('hex');
    let response
    await docClient.put(putParams(id,user_pin_1,user_pin_2), function(err, data) {
        if (err) {
            response = {
            statusCode: 400,
            body: JSON.stringify(err),
            };
        } else {
            response = {
            statusCode: 200,
            body: JSON.stringify({status: 'Items inseridos com sucesso!'}),
            };
        }
    }).promise();
    return response;
};
