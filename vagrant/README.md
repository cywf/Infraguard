# Vagrant Configuration

This directory contains Vagrant configurations for local development and testing.

## Overview

Vagrant provides easy command-line workflow for managing development environments. These configurations create pre-configured, security-hardened virtual machines for testing.

## Getting Started

1. Install Vagrant:
   ```bash
   # Download from https://www.vagrantup.com/downloads
   # Or on Ubuntu/Debian:
   wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt update && sudo apt install vagrant
   ```

2. Install VirtualBox (or another provider):
   ```bash
   sudo apt install virtualbox
   ```

3. Start a VM:
   ```bash
   cd vagrant
   vagrant up
   ```

4. SSH into the VM:
   ```bash
   vagrant ssh
   ```

5. Stop the VM:
   ```bash
   vagrant halt
   ```

6. Destroy the VM:
   ```bash
   vagrant destroy
   ```

## Available Configurations

- `Vagrantfile` - Main configuration with hardened Ubuntu VM

## Features

- Automated provisioning with Ansible
- Security hardening applied
- Docker pre-installed
- ZeroTier ready
- Port forwarding configured
- Shared folders for development

## Customization

Edit the `Vagrantfile` to customize:
- Number of VMs
- Memory and CPU allocation
- Network configuration
- Provisioning scripts

## References

- [Vagrant Documentation](https://www.vagrantup.com/docs)
- [HashiCorp Learn - Vagrant](https://learn.hashicorp.com/vagrant)
