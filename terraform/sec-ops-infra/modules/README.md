# Security Operations Infrastructure Modules

This directory contains reusable Terraform modules for deploying security operations infrastructure across multiple cloud providers.

## Directory Structure

```
modules/
├── README.md
└── env/                  # Environment-specific modules
    ├── aws/              # AWS provider module
    ├── azure/            # Azure provider module
    ├── gcp/              # GCP provider module
    ├── digitalocean/     # DigitalOcean provider module
    └── linode/           # Linode provider module
```

## Module Organization

Each cloud provider module is organized to provide:

- **Network Infrastructure**: VPCs, subnets, routing, security groups
- **Compute Resources**: VMs, containers, serverless functions
- **Storage**: Object storage, block storage, databases
- **Security**: IAM, encryption, secrets management
- **Monitoring**: Logging, metrics, alerting

## Using Modules

### Basic Module Usage

```hcl
module "aws_secops" {
  source = "./modules/env/aws"
  
  environment = "production"
  region      = "us-east-1"
  vpc_cidr    = "10.0.0.0/16"
  
  tags = {
    Project   = "SecOps"
    ManagedBy = "Terraform"
  }
}
```

## Best Practices

1. **DRY Principle**: Don't repeat yourself - use modules
2. **Version Constraints**: Pin provider versions
3. **Input Validation**: Validate variable inputs
4. **Outputs**: Expose useful information
5. **Documentation**: Keep README up to date
6. **Examples**: Provide working examples
7. **Testing**: Test modules before use
8. **Security**: Follow security best practices

## Contributing New Modules

When adding a new cloud provider module:

1. Follow the standard directory structure
2. Include comprehensive documentation
3. Add usage examples
4. Define clear inputs and outputs
5. Include provider version constraints
6. Add security scanning
7. Test thoroughly

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for detailed guidelines.
