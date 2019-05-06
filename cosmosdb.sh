#!/bin/bash

mygroup=$1
accountName=$2 #needs to be lower case
databaseName=$3
containerName=$4
## Create a resource group.
az group create --name $mygroup --location southcentralus 

# Create a SQL API Cosmos DB account with session consistency and multi-master enabled
az cosmosdb create \
--resource-group $mygroup --name $accountName \
--kind GlobalDocumentDB --locations southcentralus \
--default-consistency-level "Session" --enable-multiple-write-locations true


# Create a database
az cosmosdb database create \
--resource-group $mygroup \
--name $accountName \
--db-name $databaseName

# Create a SQL API container with a partition key and 1000 RU/s
az cosmosdb collection create \
    --resource-group $mygroup \
    --collection-name $containerName \
    --name $accountName \
    --db-name $databaseName \
    --partition-key-path /mypartitionkey \
    --throughput 1000