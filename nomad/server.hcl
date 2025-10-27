# Server Configuration
datacenter = "dc1"
data_dir = "/var/lib/nomad"
bind_addr = "0.0.0.0"

# Enable server mode
server {
  enabled = true
  
  # Bootstrap expect (number of servers in cluster)
  bootstrap_expect = 3
  
  # Encrypt gossip communication
  # encrypt = "your-encryption-key"
}

# Advertise addresses
advertise {
  http = "{{ GetInterfaceIP \"eth0\" }}"
  rpc  = "{{ GetInterfaceIP \"eth0\" }}"
  serf = "{{ GetInterfaceIP \"eth0\" }}"
}

# Enable Consul integration
consul {
  address = "127.0.0.1:8500"
  server_service_name = "nomad"
  client_service_name = "nomad-client"
  auto_advertise = true
  server_auto_join = true
  client_auto_join = true
}

# Enable Vault integration
vault {
  enabled = true
  address = "https://vault.example.com:8200"
  create_from_role = "nomad-cluster"
}

# ACL configuration
acl {
  enabled = true
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
#   verify_https_client    = true
# }
