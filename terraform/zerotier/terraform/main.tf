// ----------------------- //
// MAIN CONFIGURATION FILE //
// ----------------------- //

// ZeroTier Network Configuration
// This configuration sets up ZeroTier networking for secure mesh networking

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    zerotier = {
      source  = "zerotier/zerotier"
      version = "~> 1.0"
    }
  }
}

# Configure ZeroTier provider
provider "zerotier" {
  # API token should be set via environment variable: ZEROTIER_API_TOKEN
}

# Example network configuration (uncomment to use)
# resource "zerotier_network" "secure_network" {
#   name        = "infraguard-secure-net"
#   description = "Secure mesh network for Infraguard infrastructure"
#   
#   assignment_pool {
#     start = "10.147.17.1"
#     end   = "10.147.17.254"
#   }
#   
#   route {
#     target = "10.147.17.0/24"
#   }
# }
