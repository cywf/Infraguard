# Hardened Ubuntu 22.04 LTS Packer Template
# Builds a security-hardened Ubuntu image for cloud deployment

packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

# Variables
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ami_name_prefix" {
  type    = string
  default = "infraguard-ubuntu-hardened"
}

# Source configuration for AWS
source "amazon-ebs" "ubuntu" {
  ami_name      = "${var.ami_name_prefix}-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  instance_type = var.instance_type
  region        = var.aws_region
  
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-jammy-22.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"] # Canonical
  }
  
  ssh_username = "ubuntu"
  
  tags = {
    Name        = "Infraguard Hardened Ubuntu"
    OS          = "Ubuntu"
    Version     = "22.04"
    Build_Date  = "{{ isotime }}"
    Hardened    = "true"
  }
}

# Build configuration
build {
  sources = ["source.amazon-ebs.ubuntu"]
  
  # Update system
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install -y fail2ban ufw aide unattended-upgrades"
    ]
  }
  
  # Security hardening
  provisioner "shell" {
    inline = [
      "# Configure SSH hardening",
      "sudo sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config",
      "sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config",
      "sudo sed -i 's/^X11Forwarding.*/X11Forwarding no/' /etc/ssh/sshd_config",
      "",
      "# Configure firewall",
      "sudo ufw default deny incoming",
      "sudo ufw default allow outgoing",
      "sudo ufw allow ssh",
      "",
      "# Enable fail2ban",
      "sudo systemctl enable fail2ban",
      "sudo systemctl start fail2ban",
      "",
      "# Configure automatic updates",
      "echo 'APT::Periodic::Update-Package-Lists \"1\";' | sudo tee -a /etc/apt/apt.conf.d/20auto-upgrades",
      "echo 'APT::Periodic::Unattended-Upgrade \"1\";' | sudo tee -a /etc/apt/apt.conf.d/20auto-upgrades"
    ]
  }
  
  # Install Docker
  provisioner "shell" {
    script = "../../docker/docker_install.sh"
  }
  
  # Cleanup
  provisioner "shell" {
    inline = [
      "sudo apt-get clean",
      "sudo rm -rf /tmp/*",
      "sudo rm -rf /var/tmp/*",
      "history -c"
    ]
  }
}
