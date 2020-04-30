// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event,context) => {
    // TODO implement
    const data = JSON.parse(event.body);
    const id = data["id"]
    const params = (id) =>{
        return{
            TableName: "UserPin",
            KeyConditionExpression: "#i = :i",
            ExpressionAttributeNames:{
                "#i": "id"
            },
            ExpressionAttributeValues: {
                ":i": id
            }
        }
    }
    const result = await docClient.query(params(id)).promise()
    await docClient.query(params(id), function(err, res) {
        if(err){
            context.fail(err)
        }else{
            console.log(res.Items);
            context.succeed({status: "Item conferido com sucesso!",pin:res.Items[0]["pin"]})
        }
        
    }).promise();
};
