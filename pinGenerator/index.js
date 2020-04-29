// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var docClient = new AWS.DynamoDB.DocumentClient();
var toPutClient = new AWS.DynamoDB.DocumentClient();
var gpc = require('generate-pincode')


exports.handler = async (event) => {
    // TODO implement
    const body = JSON.parse(event.body)
    const getParams = {
        TableName: "UserPin"
    }
    const putParams = (pin,username) => {
        return{
            TableName: "UserPin",
            Item:{pin: pin, username: username}
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
    while (dataSearch.includes(pin)){
         pin = gpc(9);
    }
    let username = body["username"]
    let response;
    await toPutClient.put(putParams(pin,username), function(err, data) {
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