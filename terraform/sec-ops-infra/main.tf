// ----------------------- //
// Main Configuration File //
// ----------------------- //

// This module deploys security operations infrastructure
// across multiple cloud providers

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

// Example: Deploy to AWS
module "aws_infrastructure" {
  source = "./modules/env/aws"
  
  # Uncomment and configure when ready to deploy
  # vpc_cidr = "10.0.0.0/16"
  # environment = "production"
  # enable_security_hardening = true
}

// Example: Deploy to GCP
# module "gcp_infrastructure" {
#   source = "./modules/env/gcp"
#   
#   project_id = "your-project-id"
#   region     = "us-central1"
# }

// Example: Deploy to Azure
# module "azure_infrastructure" {
#   source = "./modules/env/azure"
#   
#   resource_group_name = "infraguard-rg"
#   location            = "eastus"
# }
