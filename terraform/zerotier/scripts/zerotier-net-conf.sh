cat << EOF | sudo tee /etc/systemd/network/25-bridge-br0.network
[Match]
Name=$BR_IF

[Network]
Address=$BR_ADDR
Gateway=$GW_ADDR
DNS=9.9.9.9
EOF

cat << EOF | sudo tee /etc/systemd/network/br0.netdev
[NetDev]
Name=$BR_IF
Kind=bridge
EOF

cat << EOF | sudo tee /etc/systemd/network/25-bridge-br0-zt.network
[Match]
Name=$ZT_IF

[Network]
Bridge=$BR_IF
EOF

cat << EOF | sudo tee /etc/systemd/network/25-bridge-br0-en.network   
[Match]
Name=eth0 # might be en*

[Network]
Bridge=$BR_IF
EOF
