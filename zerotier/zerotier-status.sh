
#!/usr/bin/env bash
# zerotier-status
# bash script for retrieving status of ZeroTier network and connected clients

ZEROTIER_API="https://my.zerotier.com/api/v1"
ZEROTIER_API_TOKEN="<your-api-token>"

# Execute ZeroTier API request
# $1 endpoint
request () {
  local endpoint="$1"
  local response=$(curl -s -X GET -H "Authorization: bearer $ZEROTIER_API_TOKEN" "$ZEROTIER_API/$endpoint" | jq )
  echo $response
}

# Retrieves ZeroTier API status
status () {
  request "status" | jq -r '. | "API: v.\(.apiVersion)\nUser: \(.user.displayName)\n \(.user.email)"'
}

# Retrieves list of networks
networks () {
  local response=$(request "network")
  echo "$response" | jq -r '.[] | "\(.id) \(.config.name)"'
}

# Retrieves identifier of the first network
network () {
  local response=$(request "network")
  local network_id=$(echo "$response" | jq -r '.[0] | "\(.id)"')
  echo $network_id
}

# Retrieves list of clients currently logged into the specified network
# $1 Network identifier
clients () {
  local network_id="$1"
  # request "network/$network_id/member" | jq
  request "network/$network_id/member" | jq -r '.[] | select(.physicalAddress | . != null) | "\(.name) \(.config.ipAssignments[0])"'
}

# Retrieves IP address of a client connected to the specified network
# $1 Network identifier
# $2 Client name
ipOfClient () {
  local network_id="$1"
  local name="$2"
  local all=$(clients "$network_id" "$name")
  local found=$(echo "$all" | grep "$name")
  local arr=($found)
  echo ${arr[1]}
}

# If run with client name, returns client's IP address,
# otherwise shows the whereabouts of your ZeroTier private network.
CLIENT="$1"
if [ "$CLIENT" == "" ]; then
  echo "ZeroTier"
  echo "-------------------------------"
  status
  echo
  echo "Network"
  echo "-------------------------------"
  NETWORK_ID=$(network)
  echo "$NETWORK_ID"
  echo
  echo "Clients"
  echo "-------------------------------"
  clients "$NETWORK_ID"
  echo
else
   NETWORK_ID=$(network)
   ipOfClient "$NETWORK_ID" "$CLIENT"
fi
