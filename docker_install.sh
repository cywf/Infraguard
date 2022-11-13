#!/bin/bash

# Docker Install

# uninstall old versions

sudo \* 

	apt-get \ 
		remove \ 
			- docker 
			- docker-engine 
			- docker.io 
			- containerd 
			- runc \ 
		update \ 
		install \ 
			ca-certificates \ 
			curl \ 
			gnupg \ 
			lsb_release

\* 
# setup the repository

# add dockers offical GPD key 

sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# use the following to setup the rest 

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt-get update

# install newest installations

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

