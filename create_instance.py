import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    https = "https://"
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    complement = ".s3.amazonaws.com/"
    file_name = event["Records"][0]["s3"]["object"]["key"]
    url = https + bucket_name + complement + file_name
    ec2 = boto3.resource('ec2')
    start = """ #!/bin/bash		
    cd / 
    """
    middle="sudo wget " + url + "\n" + "sudo mv " + file_name + " server"
    ends= """
    sudo chmod -R 777 server
    sudo touch server.ini
    sudo touch ./app_logs
    sudo chmod 777 ./app_logs
    sudo touch /etc/systemd/system/server.service
    sudo echo "[Unit]
    After=network.target
    Description=Server
    
    [Service]
    Type=simple
    Restart=always
    ExecStart=/server
    
    [Install]
    WantedBy=multi-user.target
    " >> "/etc/systemd/system/server.service"
    sudo systemctl enable server
    sudo systemctl start server"""
    userdata = start + middle + ends
    instance = ec2.create_instances(
        ImageId='ami-0323c3dd2da7fb37d',
        MinCount=1,
        MaxCount=1,
        InstanceType='t2.micro',
        SecurityGroupIds=[
        'sg-0a088722bfb4a22fb',
        ],
        SubnetId='subnet-e491a5da',
        UserData=userdata,
        TagSpecifications=[
        {
            'ResourceType': 'instance',
            'Tags': [
                {
                    'Key': 'name',
                    'Value': file_name
                },
            ]
        },
    ],
    )
    print("Starting new instance:",instance[0].id)