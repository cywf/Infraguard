#!/bin/bash

# Docker Install Script
# This script installs Docker Engine on Ubuntu/Debian systems

set -e

# Uninstall old versions
echo "Removing old Docker versions..."
sudo apt-get remove -y docker docker-engine docker.io containerd runc || true

# Update package index
echo "Updating package index..."
sudo apt-get update

# Install prerequisites
echo "Installing prerequisites..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Setup the repository
echo "Setting up Docker repository..."

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
echo "Updating package index with Docker repository..."
sudo apt-get update

# Install Docker Engine
echo "Installing Docker Engine..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
echo "Verifying Docker installation..."
sudo docker --version

echo "Docker installation completed successfully!"
echo "To use Docker as a non-root user, run: sudo usermod -aG docker $USER"
echo "Then log out and log back in for the changes to take effect."
