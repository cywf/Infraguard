# HashiCorp Vault Configuration

This directory contains configurations and guides for deploying HashiCorp Vault for secrets management.

## Overview

HashiCorp Vault secures, stores, and tightly controls access to tokens, passwords, certificates, API keys, and other secrets in modern computing.

## Features

- **Secret Storage**: Securely store and access secrets
- **Dynamic Secrets**: Generate secrets on-demand
- **Data Encryption**: Encrypt/decrypt data without storing it
- **Leasing & Renewal**: All secrets have a lease with automatic renewal
- **Revocation**: Revoke secrets when needed

## Quick Start

### 1. Install Vault

```bash
# On Ubuntu/Debian
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install vault
```

### 2. Start Vault Server

Development mode (DO NOT use in production):
```bash
vault server -dev
```

Production mode:
```bash
vault server -config=vault-config.hcl
```

### 3. Initialize Vault

```bash
# Set Vault address
export VAULT_ADDR='http://127.0.0.1:8200'

# Initialize Vault (production only)
vault operator init

# Unseal Vault (production only)
vault operator unseal <unseal-key-1>
vault operator unseal <unseal-key-2>
vault operator unseal <unseal-key-3>

# Login
vault login <root-token>
```

### 4. Store Secrets

```bash
# Enable KV secrets engine
vault secrets enable -path=secret kv-v2

# Store a secret
vault kv put secret/myapp/config username="admin" password="secret123"

# Read a secret
vault kv get secret/myapp/config

# Delete a secret
vault kv delete secret/myapp/config
```

## Common Use Cases

### Application Secrets

```bash
# Store database credentials
vault kv put secret/database/prod \
    username="dbuser" \
    password="dbpass" \
    host="db.example.com"

# Store API keys
vault kv put secret/api/prod \
    api_key="your-api-key" \
    api_secret="your-api-secret"
```

### SSH Access

```bash
# Enable SSH secrets engine
vault secrets enable ssh

# Configure SSH
vault write ssh/roles/otp_key_role \
    key_type=otp \
    default_user=ubuntu \
    cidr_list=0.0.0.0/0
```

### PKI Certificates

```bash
# Enable PKI secrets engine
vault secrets enable pki

# Configure PKI
vault secrets tune -max-lease-ttl=87600h pki

# Generate root CA
vault write pki/root/generate/internal \
    common_name="example.com" \
    ttl=87600h
```

## Integration with Ansible

Use the `community.hashi_vault` collection:

```yaml
- name: Get secret from Vault
  set_fact:
    db_password: "{{ lookup('hashi_vault', 'secret=secret/database/prod:password') }}"
```

## Integration with Terraform

```hcl
provider "vault" {
  address = "http://127.0.0.1:8200"
}

data "vault_generic_secret" "database" {
  path = "secret/database/prod"
}

resource "aws_db_instance" "example" {
  username = data.vault_generic_secret.database.data["username"]
  password = data.vault_generic_secret.database.data["password"]
}
```

## Security Best Practices

1. **Never run in dev mode in production**
2. **Use TLS/HTTPS** for all Vault communication
3. **Implement proper authentication** (AppRole, LDAP, etc.)
4. **Use policies** for fine-grained access control
5. **Enable audit logging**
6. **Backup unseal keys** securely (use Shamir's Secret Sharing)
7. **Rotate secrets** regularly
8. **Use namespace isolation** for multi-tenancy
9. **Enable auto-unseal** with cloud KMS in production
10. **Monitor and alert** on Vault operations

## Vault Configuration File

Example `vault-config.hcl`:

```hcl
storage "file" {
  path = "/var/lib/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = false
  tls_cert_file = "/etc/vault/tls/vault.crt"
  tls_key_file  = "/etc/vault/tls/vault.key"
}

api_addr = "https://vault.example.com:8200"
cluster_addr = "https://127.0.0.1:8201"
ui = true
```

## Troubleshooting

### Vault is Sealed

```bash
# Check seal status
vault status

# Unseal Vault
vault operator unseal
```

### Connection Issues

```bash
# Verify Vault address
echo $VAULT_ADDR

# Test connection
curl $VAULT_ADDR/v1/sys/health
```

### Token Expired

```bash
# Renew token
vault token renew

# Login again if expired
vault login
```

## Resources

- [Vault Documentation](https://www.vaultproject.io/docs)
- [Vault Learn](https://learn.hashicorp.com/vault)
- [Vault API](https://www.vaultproject.io/api-docs)
- [Best Practices](https://www.vaultproject.io/docs/internals/security)

## Deployment with Ansible

Use the included playbook:
```bash
ansible-playbook ansible/playbooks/setup-vault.yml
```

## Deployment with Terraform

Use the Vault provider:
```bash
cd terraform/vault
terraform init
terraform apply
```
