var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var toPutClient = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto")

exports.handler = async (event) => {
    // TODO implement
    const putParams = (id,username) => {
        return{
            TableName: "UserPin",
            Item:{id: id, username: username}
        }
    }
    const body = JSON.parse(event.body)
    let username = body["username"];
    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    let id = crypto.createHash('sha1').update(current_date + random).digest('hex');
    let response
    await toPutClient.put(putParams(id,username), function(err, data) {
        if (err) {
            response = {
            statusCode: 400,
            body: JSON.stringify(err),
            };
        } else {
            response = {
            statusCode: 200,
            body: JSON.stringify('Items inseridos com sucesso'),
            };
        }
    }).promise();
    return response;
};
