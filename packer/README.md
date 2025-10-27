# Packer Templates

This directory contains Packer templates for building hardened system images.

## Overview

Packer automates the creation of machine images across multiple platforms. These templates build pre-configured, security-hardened images for rapid deployment.

## Directory Structure

```
packer/
├── templates/          # Packer template files
└── scripts/            # Provisioning scripts
```

## Available Templates

- `ubuntu-hardened.pkr.hcl` - Hardened Ubuntu 22.04 LTS image
- `centos-hardened.pkr.hcl` - Hardened CentOS Stream image

## Getting Started

1. Install Packer:
   ```bash
   # On Ubuntu/Debian
   wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt update && sudo apt install packer
   ```

2. Initialize Packer:
   ```bash
   cd packer/templates
   packer init ubuntu-hardened.pkr.hcl
   ```

3. Validate template:
   ```bash
   packer validate ubuntu-hardened.pkr.hcl
   ```

4. Build image:
   ```bash
   packer build ubuntu-hardened.pkr.hcl
   ```

## Features

- Automated security hardening
- CIS benchmark compliance
- Minimal attack surface
- Pre-configured monitoring agents
- Docker and container runtime ready
- ZeroTier VPN pre-installed

## Configuration

Edit the variables in each template file to customize:
- Cloud provider credentials
- Region/zone settings
- Instance specifications
- Security configurations

## References

- [Packer Documentation](https://www.packer.io/docs)
- [HashiCorp Learn - Packer](https://learn.hashicorp.com/packer)
