#!/bin/bash

# Docker Install Script
# Automated installation of Docker CE on Ubuntu/Debian systems

# Uninstall old versions
sudo apt-get remove -y \
    docker \
    docker-engine \
    docker.io \
    containerd \
    runc

# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Setup the Docker repository
# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index with Docker packages
sudo apt-get update

# Install Docker Engine, containerd, and Docker Compose
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
echo "Docker installation complete!"
echo "Docker version:"
docker --version

# Optional: Add current user to docker group (requires logout/login to take effect)
# sudo usermod -aG docker $USER
# echo "Note: You may need to log out and back in for group changes to take effect."

