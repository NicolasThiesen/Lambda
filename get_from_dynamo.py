import boto3
import json

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('table')
    items = table.scan()
    return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': items
    }
    