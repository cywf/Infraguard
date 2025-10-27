# HashiCorp Nomad - Container Orchestration

This directory contains configurations and guides for deploying HashiCorp Nomad for container orchestration and workload management.

## Overview

HashiCorp Nomad is a simple and flexible workload orchestrator to deploy and manage containers and non-containerized applications across on-prem and clouds at scale.

## Features

- **Multi-workload Support**: Containers, VMs, Java applications, and more
- **Simple Operations**: Single binary, easy to deploy and maintain
- **High Performance**: Supports millions of containers
- **Multi-region & Multi-cloud**: Deploy across regions and cloud providers
- **Native Consul & Vault Integration**: Service discovery and secrets management

## Architecture

```
┌─────────────────────────────────────────┐
│           Nomad Servers (3-5)           │
│  (Consensus, Scheduling, State)         │
└─────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼───┐  ┌─────▼────┐
│ Client │  │ Client │  │  Client  │
│ Node 1 │  │ Node 2 │  │  Node 3  │
└────────┘  └────────┘  └──────────┘
```

## Quick Start

### 1. Install Nomad

```bash
# On Ubuntu/Debian
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install nomad
```

### 2. Start Nomad Server

Development mode (single node):
```bash
nomad agent -dev
```

Production mode (server):
```bash
nomad agent -config=/etc/nomad.d/server.hcl
```

Production mode (client):
```bash
nomad agent -config=/etc/nomad.d/client.hcl
```

### 3. Deploy a Job

```bash
# Create a job file (example.nomad)
nomad job run example.nomad

# Check job status
nomad job status example

# View job allocations
nomad alloc status <alloc-id>
```

## Example Job - Nginx Container

Create `nginx.nomad`:

```hcl
job "nginx" {
  datacenters = ["dc1"]
  type = "service"

  group "web" {
    count = 3

    network {
      port "http" {
        to = 80
      }
    }

    task "nginx" {
      driver = "docker"

      config {
        image = "nginx:latest"
        ports = ["http"]
      }

      resources {
        cpu    = 500
        memory = 256
      }

      service {
        name = "nginx"
        port = "http"
        
        check {
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}
```

Deploy it:
```bash
nomad job run nginx.nomad
```

## Common Commands

```bash
# Server management
nomad server members
nomad server join <server-address>

# Node management
nomad node status
nomad node drain <node-id>
nomad node eligibility -enable <node-id>

# Job management
nomad job run <job-file>
nomad job stop <job-name>
nomad job status <job-name>
nomad job logs <alloc-id>

# Monitoring
nomad monitor
nomad alloc logs <alloc-id>
nomad alloc status <alloc-id>
```

## Integration with Consul

Nomad integrates with Consul for service discovery:

```hcl
consul {
  address = "127.0.0.1:8500"
  auto_advertise = true
  server_auto_join = true
  client_auto_join = true
}
```

## Integration with Vault

Secure secrets management with Vault:

```hcl
vault {
  enabled = true
  address = "https://vault.example.com:8200"
}
```

In your job:
```hcl
task "app" {
  vault {
    policies = ["app-policy"]
  }

  template {
    data = <<EOH
{{ with secret "secret/data/myapp" }}
DATABASE_PASSWORD={{ .Data.data.password }}
{{ end }}
EOH
    destination = "secrets/config.env"
    env = true
  }
}
```

## Multi-Region Setup

```hcl
job "multi-region" {
  multiregion {
    strategy {
      max_parallel = 1
      on_failure   = "fail_all"
    }

    region "us-east" {
      count = 3
      datacenters = ["dc1"]
    }

    region "us-west" {
      count = 3
      datacenters = ["dc2"]
    }
  }
}
```

## Monitoring and Observability

Nomad provides metrics via:
- Built-in UI (http://localhost:4646)
- Prometheus integration
- StatsD integration
- Telemetry endpoint

Enable Prometheus metrics:
```hcl
telemetry {
  prometheus_metrics = true
  publish_allocation_metrics = true
  publish_node_metrics = true
}
```

## Security Best Practices

1. **Enable TLS** for all Nomad communication
2. **Use ACL tokens** for authentication
3. **Integrate with Vault** for secrets
4. **Enable audit logging**
5. **Use namespaces** for isolation
6. **Implement resource quotas**
7. **Regular security updates**
8. **Network policies** with CNI plugins

## Deployment with Ansible

```bash
ansible-playbook ansible/playbooks/setup-nomad.yml
```

## Resources

- [Nomad Documentation](https://www.nomadproject.io/docs)
- [Nomad Learn](https://learn.hashicorp.com/nomad)
- [Job Specification](https://www.nomadproject.io/docs/job-specification)
- [API Documentation](https://www.nomadproject.io/api-docs)

## Example Configurations

See the `examples/` directory for:
- Web application deployments
- Batch processing jobs
- System service tasks
- Multi-region deployments
- Vault integration examples
