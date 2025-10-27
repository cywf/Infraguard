# Ansible Automation

This directory contains Ansible playbooks and roles for automating infrastructure provisioning and configuration management.

## Directory Structure

```
ansible/
├── playbooks/          # Ansible playbooks for various tasks
├── roles/              # Reusable Ansible roles
├── inventory/          # Inventory files for different environments
└── ansible.cfg         # Ansible configuration file
```

## Features

- **System Hardening**: Automated security hardening for Linux systems
- **Container Management**: Docker and container orchestration setup
- **Network Configuration**: Advanced networking setup with ZeroTier
- **Secrets Management**: Integration with HashiCorp Vault
- **Monitoring Setup**: Configuration for system monitoring and logging

## Getting Started

1. Install Ansible:
   ```bash
   pip install ansible
   ```

2. Configure your inventory:
   ```bash
   cp inventory/hosts.example inventory/hosts
   # Edit inventory/hosts with your server details
   ```

3. Run a playbook:
   ```bash
   ansible-playbook -i inventory/hosts playbooks/harden-system.yml
   ```

## Example Playbooks

- `playbooks/harden-system.yml` - System hardening and security configuration
- `playbooks/setup-docker.yml` - Docker installation and configuration
- `playbooks/setup-zerotier.yml` - ZeroTier VPN setup
- `playbooks/setup-vault.yml` - HashiCorp Vault deployment

## Security Notes

- Store sensitive variables in Ansible Vault
- Use SSH keys for authentication
- Follow the principle of least privilege
- Regularly update playbooks for security patches

## References

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
