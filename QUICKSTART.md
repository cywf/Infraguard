# Quick Start Guide

Get started with Infraguard in under 10 minutes!

## Prerequisites

Before you begin, ensure you have:

- [Git](https://git-scm.com/)
- [Terraform](https://www.terraform.io/downloads) >= 1.0
- Cloud provider account (AWS, Azure, GCP, DigitalOcean, or Linode)
- Cloud provider CLI tools configured

## Step 1: Clone the Repository

```bash
git clone https://github.com/cywf/Infraguard.git
cd Infraguard
```

## Step 2: Validate Your Environment

Run the validation script to check your setup:

```bash
chmod +x scripts/validate.sh
./scripts/validate.sh
```

This will check for:
- Required tools (terraform, git)
- Optional tools (shellcheck, yamllint)
- Repository structure
- Configuration validity

## Step 3: Choose Your Use Case

### Option A: Deploy AWS Infrastructure

1. Navigate to the AWS example:
   ```bash
   cd terraform/sec-ops-infra/examples/aws-basic
   ```

2. Copy the example variables:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Edit `terraform.tfvars` with your settings:
   ```bash
   vim terraform.tfvars
   ```

4. Initialize and deploy:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### Option B: Use Cloud-Init

1. Browse cloud-init examples:
   ```bash
   cd cloudinit/examples
   ls -la
   ```

2. Choose an example that fits your needs:
   ```bash
   cat package_update.yaml
   ```

3. Customize the configuration

4. Use with your cloud provider:
   ```bash
   # AWS example
   aws ec2 run-instances \
     --image-id ami-xxxxxxxx \
     --user-data file://package_update.yaml
   ```

### Option C: Install Docker

Use the fixed Docker installation script:

```bash
chmod +x docker/docker_install.sh
sudo ./docker/docker_install.sh
```

## Step 4: Explore ZeroTier Networking

For advanced networking with ZeroTier:

```bash
cd terraform/zerotier
cat README.md
```

## Common Commands

### Terraform

```bash
# Format code
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy
```

### Validation

```bash
# Run all validations
./scripts/validate.sh

# Check Terraform only
terraform fmt -check -recursive terraform/

# Check shell scripts (if shellcheck installed)
shellcheck **/*.sh

# Check YAML files (if yamllint installed)
yamllint cloudinit/examples/
```

## Project Structure

```
Infraguard/
├── terraform/              # Infrastructure as Code
│   ├── sec-ops-infra/     # Security operations infrastructure
│   └── zerotier/          # ZeroTier networking
├── cloudinit/             # Cloud-init configurations
│   └── examples/          # Ready-to-use examples
├── docker/                # Docker installation and configs
├── scripts/               # Utility scripts
└── .github/workflows/     # CI/CD automation
```

## Getting Help

### Documentation

- Main README: [README.md](./README.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security: [SECURITY.md](./SECURITY.md)
- Review Summary: [REVIEW_SUMMARY.md](./REVIEW_SUMMARY.md)

### Specific Guides

- Terraform: [terraform/README.md](./terraform/README.md)
- Cloud-Init: [cloudinit/README.md](./cloudinit/README.md)
- Sec-Ops Infrastructure: [terraform/sec-ops-infra/README.md](./terraform/sec-ops-infra/README.md)
- ZeroTier: [terraform/zerotier/README.md](./terraform/zerotier/README.md)

### Community

- Open an [Issue](https://github.com/cywf/Infraguard/issues) for bugs or questions
- Read our [Code of Conduct](./CODE_OF_CONDUCT.md)
- Check [Contributing Guidelines](./CONTRIBUTING.md) before submitting PRs

## Next Steps

1. **Customize**: Modify configurations for your environment
2. **Test**: Run in a development environment first
3. **Contribute**: Share your improvements back to the project
4. **Learn**: Explore the documentation for advanced features

## Tips for Success

### Security

- Never commit secrets or credentials
- Review terraform plan before applying
- Use terraform workspaces for multiple environments
- Enable MFA on cloud accounts
- Follow principle of least privilege

### Best Practices

- Start with examples and modify incrementally
- Use version control for your customizations
- Test in non-production first
- Document your changes
- Use meaningful resource tags

### Troubleshooting

1. **Terraform errors**: Run `terraform init -upgrade`
2. **Permission errors**: Check cloud provider credentials
3. **State locked**: Manually unlock or wait for timeout
4. **Validation fails**: Read error messages carefully

## Quick Reference

### Terraform Backend Configuration

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "infraguard/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### Common Variables

```hcl
# Environment
environment = "development"

# Region
region = "us-east-1"

# Network
vpc_cidr = "10.0.0.0/16"

# Tags
tags = {
  Project   = "Infraguard"
  ManagedBy = "Terraform"
}
```

## Need More Help?

- 📖 Read the full documentation
- 🐛 Report bugs via GitHub Issues
- 💬 Join discussions
- 🔒 Report security issues per SECURITY.md

---

**Ready to deploy secure infrastructure?** Choose an option above and get started!

For a deeper understanding, see [REVIEW_SUMMARY.md](./REVIEW_SUMMARY.md) for all features and improvements.
