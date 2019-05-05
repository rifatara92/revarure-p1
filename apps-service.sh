#!/bin/bash

mygroup=$1
appservice=$2
myappName=$3


# Create a resource group.
az group create --name $mygroup --location southcentralus 

# Creating a stoarage account with blob type
az storage account create --name rifatappstorage --sku Standard_LRS --resource-group $mygroup \
--kind blobStorage --location southcentralus --access-tier Hot

# Creating a container for blob with storage account key
az storage container create --name rblobcontainer --public-access blob \
--account-key 861bxwKuPwKIzdXKFL4r49xTiapvzpZoS5c5YYrAqcZy+v9Y7iiy/4NZ2fcPXyEsjm82XhhEAgg+WDOQTvRkNA== \
--account-name rifatappstorage

# Create an App Service plan in `FREE` tier.
az appservice plan create --resource-group $mygroup --name $appservice --number-of-workers 3  --location southcentralus --sku B1 --is-linux

# Create a web app.
az webapp create --resource-group $mygroup --plan $appservice --name $myappName -r "node|10.14"

# Configure continuous deployment from GitHub.
az webapp deployment source config --name $myappName --resource-group $mygroup --branch master --repo-url https://github.com/rifatara92/revarure-p1 
