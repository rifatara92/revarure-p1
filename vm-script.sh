#!/bin/bash

## create group
createGroup(){

newgroup=$1
newgroupsearch="$( az group list --query [].name | grep -E $newgroup )"

if [ -z $newgroupsearch ]; then 

az group create -n $newgroup -l southcentralus 
fi

}

##create disk 
createDisk(){
newgroup=$1
diskname=$2
az disk create -n $diskname -g $newgroup --size-gb 30 --os-type Linux
}


##create vm
createVM(){
newgroup=$1
diskname=$2
vmname=$3

az vm create -g $newgroup -n $vmname --size Standard_B2s --admin-username linnuxuser --custom-data ./init-vm.txt --generate-ssh-key --image UbuntuLTS
}

##attach disk
attachDisk(){
newgroup=$1
diskname=$2
vmname=$3
  az vm disk attach -g $newgroup --vm-name $vmname --name $diskname --size-gb 30  
}

##Detach Disk
detachDisk(){
    newgroup=$1
    diskname=$2
    vmname=$3
   az vm disk detach -g $newgroup -n $diskname --vm-name $vmname 
}

##take snap
snap(){
    newgroup=$1
    snapshot=$2
    diskname=$3

    diskid='$(az vm show -g newgroup -n $diskname --query "storageProfile.osDisk.managedDisk.id" -o tsv)'

    if [ -n $diskid ]; then 

        az snapshot create -g $newgroup -n $snapshot --size-gb 30 --source $diskid
    fi
}
##create new disk using snap
createNewDisk(){
    newgroup=$1
    snapshot=$2
    newdiskname=$3
az disk create -g $newgroup -n $newdiskname --source $snapshot
}




## login
##login(){
##username=$1
##diskname=$2

##id=$(az vm show -g $newgroup -n $vmname  --query publicIps)
##ssh $username@$id
##sudo mkfs -t exit4 /dev/sdc
##sudo mkdir media/$diskname
##sudu mount /dev/sdc media/$diskname
##sudo index.js /media/$diskname/index.js
##}


