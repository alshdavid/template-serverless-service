#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$( cd "$( dirname "${SCRIPT_DIR[0]}/../../.." )" &> /dev/null && pwd )"

PREFIX=alshdavid
REGION=ap-southeast-2

RANDOM_BUCKET=0000-$PREFIX-temp-$(echo $RANDOM | md5sum | head -c 20; echo;)
STACK_NAME=$PREFIX-template-stack
FUNCTION_NAME=$PREFIX-template-api
API_NAME=$PREFIX-template-api

export GOOS=linux 
export GOARCH=amd64

cd $ROOT_DIR
make build

cd $ROOT_DIR/packages/httpd/dist
zip lambda.zip ./main

aws s3 mb s3://$RANDOM_BUCKET --region $REGION
if ! [ "$?" = "0" ]
then
  echo "FAILED"
  exit 1
fi

aws s3 cp lambda.zip s3://$RANDOM_BUCKET
if ! [ "$?" = "0" ]
then
  echo "FAILED"
  aws s3 rb s3://$RANDOM_BUCKET --force 
  exit 1
fi

cd $ROOT_DIR/.github/cloudformation

aws cloudformation describe-stack-events --stack-name $STACK_NAME &>/dev/null
if ! [ "$?" = "0" ]
then
  echo "Creating Stack"
  aws cloudformation create-stack \
    --template-body file://$ROOT_DIR/.github/cloudformation/resources.yaml \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION \
    --parameters \
      ParameterKey=ParamLambdaBucketUri,ParameterValue=$RANDOM_BUCKET \
      ParameterKey=ParamLambdaFunctionName,ParameterValue=$FUNCTION_NAME \
      ParameterKey=ParamApiGatewayName,ParameterValue=$API_NAME
  if ! [ "$?" = "0" ]
  then
    echo "FAILED"
    aws s3 rb s3://$RANDOM_BUCKET --force 
    exit 1
  fi
  aws cloudformation wait stack-create-complete \
    --region $REGION  \
    --stack-name $STACK_NAME
  if ! [ "$?" = "0" ]
  then
    echo "FAILED"
    aws cloudformation describe-stack-events --stack-name $STACK_NAME
    aws s3 rb s3://$RANDOM_BUCKET --force 
    exit 1
  fi
else
  echo "Updating Stack"
  aws cloudformation update-stack \
    --template-body file://$ROOT_DIR/.github/cloudformation/resources.yaml \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION \
    --parameters \
      ParameterKey=ParamLambdaBucketUri,ParameterValue=$RANDOM_BUCKET \
      ParameterKey=ParamLambdaFunctionName,ParameterValue=$FUNCTION_NAME \
      ParameterKey=ParamApiGatewayName,ParameterValue=$API_NAME
  if ! [ "$?" = "0" ]
  then
    echo "FAILED"
    aws s3 rb s3://$RANDOM_BUCKET --force 
    exit 1
  fi
  aws cloudformation wait stack-update-complete \
    --region $REGION  \
    --stack-name $STACK_NAME
  if ! [ "$?" = "0" ]
  then
    echo "FAILED"
    aws cloudformation describe-stack-events --stack-name $STACK_NAME
    aws s3 rb s3://$RANDOM_BUCKET --force 
    exit 1
  fi
fi

echo "cleaning up"
aws s3 rb s3://$RANDOM_BUCKET --force  
