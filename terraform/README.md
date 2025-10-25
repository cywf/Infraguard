# Terraform Infrastructure as Code

This directory contains Terraform configurations for deploying and managing Security Operations infrastructure across multiple cloud providers.

## Structure

```
terraform/
├── sec-ops-infra/        # Security Operations infrastructure deployment
├── zerotier/             # ZeroTier network configuration and management
└── terraform-structure/  # Documentation on organizing Terraform code
```

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- Cloud provider CLI tools configured with appropriate credentials
- [ZeroTier](https://www.zerotier.com/) account (for ZeroTier configurations)

## Supported Cloud Providers

- Amazon Web Services (AWS)
- Microsoft Azure
- Google Cloud Platform (GCP)
- DigitalOcean
- Linode

## Quick Start

1. Navigate to the desired infrastructure directory:
   ```bash
   cd sec-ops-infra
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Create a `terraform.tfvars` file with your configuration:
   ```hcl
   # Example variables
   environment = "production"
   region      = "us-east-1"
   ```

4. Plan your deployment:
   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

## Security Best Practices

- **Never commit** `*.tfvars` files containing sensitive information
- Use [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) or [HashiCorp Vault](https://www.vaultproject.io/) for secrets management
- Enable state locking with remote backends
- Use workspaces to manage multiple environments
- Implement least-privilege IAM policies

## Documentation

- [Organizing Terraform Code](./terraform-structure/organizing-tf.md)
- [Security Operations Infrastructure](./sec-ops-infra/README.md)
- [ZeroTier Configuration](./zerotier/README.md)

## Contributing

When adding new Terraform modules:
1. Follow the established directory structure
2. Include a README.md with usage examples
3. Document all variables in `variables.tf`
4. Define outputs in `outputs.tf`
5. Use modules for reusable components

## Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)
- [HashiCorp Learn](https://learn.hashicorp.com/terraform)
