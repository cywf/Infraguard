# Client Configuration
datacenter = "dc1"
data_dir = "/var/lib/nomad"
bind_addr = "0.0.0.0"

# Enable client mode
client {
  enabled = true
  
  # Server addresses (update with your server IPs)
  servers = ["10.0.1.10:4647", "10.0.1.11:4647", "10.0.1.12:4647"]
  
  # Node metadata
  meta {
    node_type = "worker"
    environment = "production"
  }
  
  # Host volumes
  host_volume "docker-sock" {
    path = "/var/run/docker.sock"
    read_only = false
  }
}

# Advertise addresses
advertise {
  http = "{{ GetInterfaceIP \"eth0\" }}"
  rpc  = "{{ GetInterfaceIP \"eth0\" }}"
  serf = "{{ GetInterfaceIP \"eth0\" }}"
}

# Enable plugins
plugin "docker" {
  config {
    allow_privileged = false
    volumes {
      enabled = true
    }
  }
}

plugin "raw_exec" {
  config {
    enabled = false
  }
}

# Enable Consul integration
consul {
  address = "127.0.0.1:8500"
  client_service_name = "nomad-client"
  auto_advertise = true
  client_auto_join = true
}

# Enable Vault integration
vault {
  enabled = true
  address = "https://vault.example.com:8200"
}

# Telemetry
telemetry {
  publish_allocation_metrics = true
  publish_node_metrics = true
  prometheus_metrics = true
}

# TLS Configuration (uncomment and configure for production)
# tls {
#   http = true
#   rpc  = true
#   
#   ca_file   = "/etc/nomad.d/tls/ca.crt"
#   cert_file = "/etc/nomad.d/tls/nomad.crt"
#   key_file  = "/etc/nomad.d/tls/nomad.key"
#   
#   verify_server_hostname = true
# }
