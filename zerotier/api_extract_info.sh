TOKEN="<your-api-token>"
ENDPOINT="https://my.zerotier.com/api/v1/status"
STATUS=$(curl -s -X GET -H "Authorization: bearer $TOKEN" $ENDPOINT)
MESSAGE=echo $STATUS | jq -r '. | "API: v.\(.apiVersion)\nUser: \(.user.displayName)\nE-mail: \(.user.email)"'
echo $MESSAGE