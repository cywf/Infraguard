# Cloud-Init Configuration Examples

This directory contains cloud-init configuration examples for automating the initial setup of cloud instances across various providers.

## What is Cloud-Init?

Cloud-init is the industry-standard multi-distribution method for cross-platform cloud instance initialization. It is supported across all major public cloud providers, provisioning systems for private cloud infrastructure, and bare-metal installations.

## Structure

```
cloudinit/
├── README.md
└── examples/
    ├── ansible-pull.yaml              # Pull Ansible playbooks on boot
    ├── ansible_controller_instance.yaml  # Set up Ansible controller
    ├── ansible_instance_manager.yaml  # Ansible-managed instance config
    ├── apt_pipelining.yaml            # APT configuration
    ├── apt_repos.yaml                 # Custom APT repositories
    ├── bootcmd.yaml                   # Commands to run early in boot
    ├── ca_certs.yaml                  # Custom CA certificates
    ├── chef.yaml                      # Chef configuration
    ├── datasources.yaml               # Data source configuration
    ├── disk_setup.yaml                # Disk partitioning
    ├── fs_setup.yaml                  # Filesystem setup
    ├── install_arb_pkgs.yaml          # Install arbitrary packages
    ├── mounts.yaml                    # Mount points configuration
    ├── package_update.yaml            # Update packages on boot
    ├── package_upgrade.yaml           # Upgrade packages on boot
    ├── runcmd.yaml                    # Run commands after boot
    ├── ssh_conf.yaml                  # SSH configuration
    ├── users_groups.sh                # User and group management
    ├── write_files.yaml               # Write files to disk
    ├── yum_repos.yaml                 # YUM repository configuration
    └── wifi_pineapple_cloudinit.txt   # WiFi Pineapple auto-config
```

## Quick Start

### Basic Usage

1. Choose an example configuration that matches your needs
2. Customize the configuration with your specific values
3. Pass the cloud-config to your cloud provider during instance creation

### Example: Using cloud-config with AWS EC2

```bash
aws ec2 run-instances \
  --image-id ami-xxxxxxxx \
  --instance-type t2.micro \
  --user-data file://examples/package_update.yaml
```

### Example: Using cloud-config with DigitalOcean

```bash
doctl compute droplet create my-droplet \
  --size s-1vcpu-1gb \
  --image ubuntu-22-04-x64 \
  --region nyc1 \
  --user-data-file examples/package_update.yaml
```

## Common Use Cases

### 1. **Package Management**
- `package_update.yaml` - Update package lists
- `package_upgrade.yaml` - Upgrade all packages
- `install_arb_pkgs.yaml` - Install specific packages

### 2. **User Management**
- `users_groups.sh` - Create users and groups with SSH keys

### 3. **Configuration Management**
- `ansible-pull.yaml` - Bootstrap with Ansible
- `chef.yaml` - Bootstrap with Chef

### 4. **System Configuration**
- `write_files.yaml` - Create configuration files
- `ssh_conf.yaml` - Configure SSH daemon
- `disk_setup.yaml` - Set up disks and partitions
- `mounts.yaml` - Configure mount points

### 5. **Custom Commands**
- `bootcmd.yaml` - Run commands early in boot sequence
- `runcmd.yaml` - Run commands after system is fully initialized

## Cloud-Config Format

Cloud-init configurations use YAML format with a special `#cloud-config` header:

```yaml
#cloud-config

# Update and upgrade packages
package_update: true
package_upgrade: true

# Install packages
packages:
  - docker.io
  - git
  - vim

# Create users
users:
  - name: admin
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh_authorized_keys:
      - ssh-rsa AAAAB3Nza... user@host

# Run commands
runcmd:
  - systemctl start docker
  - systemctl enable docker
```

## Security Best Practices

1. **SSH Keys**: Always use SSH key authentication, disable password authentication
2. **User Passwords**: If using passwords, use hashed passwords (never plaintext)
3. **Secrets**: Never commit files with real secrets/passwords to version control
4. **Sudo Access**: Be specific with sudo rules, avoid `NOPASSWD:ALL` in production
5. **Updates**: Always update and upgrade packages on first boot
6. **Firewall**: Configure firewall rules in cloud-init

## Testing Cloud-Init Configurations

### Validate YAML Syntax
```bash
# Install yamllint
pip install yamllint

# Validate syntax
yamllint examples/package_update.yaml
```

### Test Locally with Cloud-Init
```bash
# Install cloud-init
sudo apt-get install cloud-init

# Run cloud-init with your config
sudo cloud-init init
```

## Debugging

### Check Cloud-Init Logs
```bash
# View cloud-init output
sudo cat /var/log/cloud-init-output.log

# View cloud-init logs
sudo cat /var/log/cloud-init.log

# Check cloud-init status
cloud-init status
cloud-init status --long
```

### Re-run Cloud-Init (for testing)
```bash
# Clean previous runs
sudo cloud-init clean

# Re-run cloud-init
sudo cloud-init init
```

## Resources

- [Official Cloud-Init Documentation](https://cloudinit.readthedocs.io/)
- [Cloud-Init Examples](https://cloudinit.readthedocs.io/en/latest/reference/examples.html)
- [Cloud-Init Modules Reference](https://cloudinit.readthedocs.io/en/latest/reference/modules.html)
- [Cloud Config YAML Examples](https://github.com/canonical/cloud-init/tree/main/doc/examples)

## Platform-Specific Guides

- [AWS EC2 User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)
- [Azure Custom Data](https://docs.microsoft.com/en-us/azure/virtual-machines/custom-data)
- [GCP Startup Scripts](https://cloud.google.com/compute/docs/instances/startup-scripts)
- [DigitalOcean User Data](https://docs.digitalocean.com/products/droplets/how-to/provide-user-data/)
- [Linode StackScripts](https://www.linode.com/docs/products/tools/stackscripts/)
