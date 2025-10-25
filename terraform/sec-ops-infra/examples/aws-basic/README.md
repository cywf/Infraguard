# Basic AWS Security Operations Infrastructure Example

This example demonstrates a basic deployment of security operations infrastructure on AWS.

## Prerequisites

- AWS CLI configured with credentials
- Terraform >= 1.0

## Usage

1. Copy this example to a working directory:
   ```bash
   cp -r terraform/sec-ops-infra/examples/aws-basic /tmp/my-deployment
   cd /tmp/my-deployment
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Create a `terraform.tfvars` file:
   ```hcl
   aws_region  = "us-east-1"
   environment = "development"
   project_name = "my-secops"
   ```

4. Plan and apply:
   ```bash
   terraform plan
   terraform apply
   ```

5. When done, destroy:
   ```bash
   terraform destroy
   ```

## What Gets Created

- VPC with CIDR 10.0.0.0/16
- Public and private subnets across 2 availability zones
- Internet Gateway and NAT Gateway
- Security groups for common services
- CloudWatch log groups

## Estimated Cost

This basic setup will cost approximately $30-50/month on AWS, primarily for:
- NAT Gateway (~$30/month)
- EC2 instances (if deployed)
- Data transfer

## Security Considerations

- NAT Gateway is used for private subnet internet access
- Security groups follow least-privilege principle
- CloudWatch logging is enabled for audit trails
- All resources are tagged for cost allocation

## Outputs

After deployment, you'll see:
- VPC ID
- Subnet IDs
- Security group IDs
- NAT Gateway public IP
