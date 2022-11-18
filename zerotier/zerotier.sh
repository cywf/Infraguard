#!/usr/bin/env bash
# zerotier
# bash script for connecting to ZeroTier clients using ssh

# ZeroTier client to connect or command to execute is passed as first parameter
CLIENT="$1"
COMMAND="$1"

# User account to login as is passed as second parameter.
# If not specified, current account is used, unless
# you have defined below another default account for that machine
LOGIN="$2"

# Default accounts used to log into clients
declare -A USERS
USERS=(
    ["jerry-pc"]="jerry"
    ["mary-pc"]="mary"
    ["bob-pc"]="bob"
)

if [ "$CLIENT" == "" ]; then
  echo "Connects to ZeroTier client in your private network using SSH"
  echo
  echo "Syntax:"
  echo
  echo "  zerotier <client> <user>"
  echo "  zerotier <command>"
  echo
  echo "  client:    Name of ZeroTier network client to log into"
  echo "  user:      Account to login as"
  echo "  command:   Command to execute:"
  echo "    restart  Restarts ZeroTier daemon"
  echo "    status   Displays status of ZeroTier network"
  echo
  
elif [ "$COMMAND" == "restart" ]; then
  echo "Restarting ZeroTier ..."
  sudo systemctl restart zerotier-one
  echo "Done."
  
elif [ "$COMMAND" == "status" ]; then
  zerotier-status.sh
  
else
  # Determine account to log in as.
  # It can be passed explicitly as second parameter.
  # If not present, check if defined above.
  # Finally, if none defined, assume currently logged in user.
  [[ "$LOGIN" == "" ]] && LOGIN="${USERS[$CLIENT]}"
  LOGIN="${LOGIN:-$USER}"
  echo "Connecting to ZeroTier client $CLIENT ..."
  echo "Fetching IP address ..."
  IP=$(zerotier-status.sh "$CLIENT")
  if [ "$IP" == "" ]; then
    echo "Client $CLIENT is invalid or currently not connected"
  else
    echo "Establishing SSH connection $LOGIN@$IP ..."
    ssh $LOGIN@$IP
  fi
fi