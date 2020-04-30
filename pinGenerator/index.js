// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient();
const toPutClient = new AWS.DynamoDB.DocumentClient();
const gpc = require('generate-pincode')
const crypto = require("crypto")

exports.handler = async (event) => {
    // TODO implement
    const body = JSON.parse(event.body)
    const getParams = {
        TableName: "UserPin"
    }
    const updateParams = (id,pin) => {
        return{
            TableName: "UserPin",
            Key:{
                id: id,
            },
            UpdateExpression: "set pin = :p",
            ExpressionAttributeValues:{
                ":p": pin
            },
            ReturnValues:"UPDATED_NEW"
        }
    }
    const promise = docClient.scan(getParams).promise();
    const result = await promise;
    const data = result.Items;
    let pin = parseInt(gpc(9));
    let dataSearch = [];
    for(var l in data){
            dataSearch.push(Object.entries(data[l]));
    }   
    var search=dataSearch.flat(Infinity);
    while (search.includes(pin) || pin.toString().length != 9){
         pin = parseInt(gpc(9));
    }
    let id = body["id"]
    let response;
    await toPutClient.update(updateParams(id,pin), function(err) {
        if (err) {
            response = {
            statusCode: 400,
            body: JSON.stringify(err),
            };
        } else {
            response = {
            statusCode: 200,
            body: JSON.stringify({pin:pin}),
            };
        }
    }).promise();
    return response;
};
