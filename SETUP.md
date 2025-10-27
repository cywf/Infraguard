# Infraguard Setup Guide

This guide provides step-by-step instructions for setting up and using the Infraguard infrastructure automation platform.

## Prerequisites

- Linux, macOS, or Windows with WSL2
- Git
- Python 3.8+
- Terraform 1.0+
- Ansible 2.9+
- Docker (optional)
- Vagrant (optional, for local testing)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/cywf/Infraguard.git
cd Infraguard
```

### 2. Install Dependencies

#### On Ubuntu/Debian:
```bash
# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install terraform ansible

# Install Python dependencies
pip install ansible boto3 google-auth
```

### 3. Configure Cloud Provider Credentials

#### AWS:
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

#### GCP:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
export GOOGLE_PROJECT="your-project-id"
```

#### Azure:
```bash
az login
```

### 4. Deploy Infrastructure

#### Using Terraform:
```bash
cd terraform/sec-ops-infra
terraform init
terraform plan
terraform apply
```

#### Using Ansible:
```bash
cd ansible
# Configure inventory
cp inventory/hosts.example inventory/hosts
# Edit inventory/hosts with your server details
nano inventory/hosts

# Run playbook
ansible-playbook -i inventory/hosts playbooks/harden-system.yml
```

### 5. Setup ZeroTier VPN (Optional)

```bash
# Get your ZeroTier API token from https://my.zerotier.com
export ZEROTIER_API_TOKEN="your-token"

# Deploy using Terraform
cd terraform/zerotier/terraform
terraform init
terraform apply

# Or use Ansible
cd ../../../ansible
ansible-playbook -i inventory/hosts playbooks/setup-zerotier.yml
```

## Usage Examples

### Harden a New Server

```bash
cd ansible
ansible-playbook -i inventory/hosts playbooks/harden-system.yml --limit your-server
```

### Install Docker on Multiple Hosts

```bash
cd ansible
ansible-playbook -i inventory/hosts playbooks/setup-docker.yml
```

### Build a Hardened VM Image with Packer

```bash
cd packer/templates
packer init ubuntu-hardened.pkr.hcl
packer build ubuntu-hardened.pkr.hcl
```

### Test Locally with Vagrant

```bash
cd vagrant
vagrant up
vagrant ssh
```

## Project Structure

```
Infraguard/
├── ansible/              # Ansible playbooks and roles
│   ├── playbooks/        # Automation playbooks
│   ├── roles/            # Reusable roles
│   └── inventory/        # Server inventories
├── terraform/            # Terraform configurations
│   ├── sec-ops-infra/    # Multi-cloud infrastructure
│   └── zerotier/         # ZeroTier networking
├── packer/               # Image building templates
│   └── templates/        # Packer templates
├── vagrant/              # Local development VMs
├── docker/               # Docker installation scripts
├── cloudinit/            # Cloud-init configurations
├── networking/           # Network configurations
└── stacks/               # Application stacks
```

## Security Considerations

1. **Never commit credentials** - Use environment variables or secrets managers
2. **Use SSH keys** - Disable password authentication
3. **Enable MFA** - On all cloud provider accounts
4. **Regular updates** - Keep all tools and dependencies updated
5. **Audit logs** - Review security logs regularly
6. **Least privilege** - Grant minimal necessary permissions
7. **Network segmentation** - Use VPNs and private networks
8. **Backup regularly** - Maintain secure backups of critical data

## Troubleshooting

### Terraform Issues

```bash
# Clear state and reinitialize
rm -rf .terraform
terraform init

# View detailed logs
export TF_LOG=DEBUG
terraform apply
```

### Ansible Issues

```bash
# Test connectivity
ansible all -i inventory/hosts -m ping

# Run with verbose output
ansible-playbook -vvv playbooks/your-playbook.yml
```

### Docker Issues

```bash
# Check Docker status
sudo systemctl status docker

# View Docker logs
sudo journalctl -u docker

# Test Docker installation
docker run hello-world
```

## Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Packer Documentation](https://www.packer.io/docs)
- [Vagrant Documentation](https://www.vagrantup.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [ZeroTier Documentation](https://docs.zerotier.com/)

## Support

For issues, questions, or contributions:
1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Submit pull requests for improvements

## License

See LICENSE file for details.
