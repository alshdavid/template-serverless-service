#!/bin/bash

DEFAULT_PREFIX=$(echo $RANDOM | md5sum | head -c 7; echo;)

clear

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
echo "  Default: $(aws configure get region)"
read -p "  Enter Deployment Region: " AWS_REGION

echo

