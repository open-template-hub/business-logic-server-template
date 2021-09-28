#!/usr/bin/env bash

if [ ! -f .env ]; then
  echo "Generating .env file.."
  touch .env
  {
    echo "PORT=4002"

    echo "PROJECT=OTH"
    echo "MODULE=BusinessLogicServer"
    echo "ENVIRONMENT=Local"

    echo "MONGODB_URI={Database Connection Url}"
    echo "MONGODB_CONNECTION_LIMIT={MongoDB Connection Limit}"

    echo "CLOUDAMQP_APIKEY={MQ Api Key}"
    echo "CLOUDAMQP_URL={MQ Connection Url}"

    echo "BUSINESS_LOGIC_SERVER_QUEUE_CHANNEL=oth_business_logic_queue"
    echo "ORCHESTRATION_SERVER_QUEUE_CHANNEL=oth_orchestration_queue"

    echo "ACCESS_TOKEN_SECRET={Access Token Secret}"
    echo "RESPONSE_ENCRYPTION_SECRET={Response Encryption Secret}"

  } >>.env
else
  echo ".env file already exists. Nothing to do..."
fi
