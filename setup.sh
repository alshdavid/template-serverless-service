#!/bin/bash

DEFAULT_PREFIX=$(echo $RANDOM | md5sum | head -c 7; echo;)
DEFAULT_AWS_REGION=$(aws configure get region)

echo "Magic Serverless Project Setup Script"
echo
echo "This service will setup a serverless project in your AWS account using cloudformation"
echo "The stack will be customised to your requirements"
echo
echo "Project Prefix:"
echo "  To ensure resource names are unqiue, all services will be namespaced with"
echo "  a prefix. An example prefix is 'myprefix', by default it's randomly generated."
echo
echo "  Default: \"${DEFAULT_PREFIX}\""
read -p "  Enter Prefix [a-z, 0-9]: " PROJECT_PREFIX

if [ "$PROJECT_PREFIX" = "" ]; then
  PROJECT_PREFIX=$DEFAULT_PREFIX
fi

if ! [[ "$PROJECT_PREFIX" =~ ^[a-z0-9]*$ ]] || ! [ ${#PROJECT_PREFIX} -ge 5 ]; then
  echo  
  echo "Project prefix must be at least 5 characters between 0-9 and a-z (lower case)"
  exit 1
fi

echo
echo "Project Name:"
echo "  This is the name of your project."
echo "  Your AWS resources and generated documentation will use this name"
echo
read -p "  Enter Project Name [a-z, 0-9]: " PROJECT_NAME

if ! [[ "$PROJECT_NAME" =~ ^[a-z0-9]*$ ]] || ! [ ${#PROJECT_NAME} -ge 5 ]; then
  echo  
  echo "Project name must be at least 5 characters between 0-9 and a-z (lower case)"
  exit 1
fi

if ! [[ "$PROJECT_NAME" =~ ^[a-z0-9]*$ ]] || ! [ ${#PROJECT_NAME} -ge 5 ]; then
  echo  
  echo "Project name must be at least 5 characters between 0-9 and a-z (lower case)"
  exit 1
fi

echo
echo "AWS Region:"
echo "  This is the deployment region for AWS. By default this will use the"
echo "  default region specified in your CLI config"
echo
echo "  Default: $DEFAULT_AWS_REGION"
read -p "  Enter Deployment Region: " AWS_REGION
echo
if [ "$AWS_REGION" = "" ]; then
  AWS_REGION=$DEFAULT_AWS_REGION
fi

echo
echo "Custom Domain: (TODO)"
echo "  You can optionally add a custom domain. this will add a seperate CloudFormation"
echo "  stack dedicated to the domain and its SSL certificate. This will likely require"
echo "  additional verification steps for the SSL certificate to be created"
echo
echo "  e.g. example.com"
read -p "  Enter Domain Name: " DOMAIN_NAME
if ! [ "$DOMAIN_NAME" = "" ]; then
  read -p "  Enter Domain Name Auth (auth.$DOMAIN_NAME): " DOMAIN_NAME_AUTH
  if [ "$DOMAIN_NAME_AUTH" = "" ]; then
    DOMAIN_NAME_AUTH="auth.$DOMAIN_NAME"
  fi
fi
echo

FOLDER_NAME=$PROJECT_PREFIX-$PROJECT_NAME

echo "Review:"
echo PROJECT_PREFIX:   $PROJECT_PREFIX
echo PROJECT_NAME:     $PROJECT_NAME
echo AWS_REGION:       $AWS_REGION
echo DOMAIN_NAME:      $DOMAIN_NAME
echo DOMAIN_NAME_AUTH: $DOMAIN_NAME_AUTH
echo Folder Name:      $FOLDER_NAME
echo

read -p "Proceed (Y/n): " PROCEED
if [ "$PROCEED" = 'n' ]; then
  echo "Cancelled"
  exit 0
fi

mkdir $FOLDER_NAME
wget -qO- https://github.com/alshdavid/template-serverless-service/releases/latest/download/template.tar.gz | tar -xzv -C "$PWD/$FOLDER_NAME" 

for i in `find * .*` ; do
echo $i
  sed -i -- "s/alshdavid/${PROJECT_PREFIX}/g" $i; 
  sed -i -- "s/template/${PROJECT_NAME}/g" $i; 
  sed -i -- "s/ap-southeast-2/${AWS_REGION}/g" $i; 
done
