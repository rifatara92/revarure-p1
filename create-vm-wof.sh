#!/bin/bash

## create a group
newgroup=$1
diskname=$2
vmname=$3
snapshot=$4
newdiskname=$5
newimage=$6
newvm2=$7

newgroupsearch="$( az group list --query [].name | grep -E $newgroup )"

if [ -z $newgroupsearch ]; then 

az group create -n $newgroup -l southcentralus 
fi

##create disk 
az disk create -n $diskname -g $newgroup --size-gb 30 --os-type Linux

az vm create -g $newgroup -n $vmname --size Standard_B2s --admin-username linnuxuser --custom-data ./init-vm.txt --generate-ssh-key --image UbuntuLTS
az vm disk attach -g $newgroup --vm-name $vmname --name $diskname --size-gb 30
az vm disk detach -g $newgroup -n $diskname --vm-name $vmname
az snapshot create -g $newgroup -n $snapshot --size-gb 30 --source $diskname
az disk create -g $newgroup -n $newdiskname --source $snapshot
az vm disk attach -g $newgroup -n $newdiskname --vm-name $vmname

az vm create -g $newgroup -n $newvm2 --image $newimage --admin-username linnuxuser --generate-ssh-key

## stop vm, deallocate, generalize
az vm stop -g $newgroup -n $vmname
az vm deallocate -g $newgroup -n $vmname
az vm generalize -g $newgroup -n $vmname
az image create -g $newgroup -n $newimage --source $vmname 
az vm create -g $newgroup -n $newvm2  --image $newimage