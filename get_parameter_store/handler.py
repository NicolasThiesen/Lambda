from boto3 import client


def handler(event,contect):
    ssm = client("ssm")
    # ev = environ["ENV"]

    parameter_key = "/addons/monitoring/prod/pagerduty-token" 

    key = ssm.get_parameter(Name=parameter_key, WithDecryption=True)["Parameter"]["Value"]