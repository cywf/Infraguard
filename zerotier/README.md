# ZeroTier Scripts

See also [these-terraform-scripts](https://githuv.com/cywf/Infraguard/terraform/README.md) to deploy ZeroTier at scale 

---

## Executing API requests

To retrieve your ZeroTier network status:

```bash
curl -s -X GET -H "Authorization: bearer 88205430e4bd" "https://my.zerotier.com/api/v1/status" | jq
```

Example Output:

```json
{
  "online": true,
  "apiVersion": "1",
  "user": {
    "id": "80e468ce-c8a7-41da-a068-37c27af38370",
    "type": "User",
    "displayName": "Tomasz Waraksa",
    "email": "tomasz@waraksa.net"
  }
}
```

Everything you can see and do within the ZeroTier website, you can do with this API. This Includes:
  - Listing your networks
  - Listing clients connected to networks
  - Determining IP addresses of connected clients

---

## Connecting to ZeroTier Clients

I’ve created another script, named zerotier, which uses the previous script to determine client IP and connect using ssh.  Place them both somewhere in the path.  Connecting to home PC is now as easy as:

Run the script without any parameters to display status of the API, your default network and list of clients connected to it

```bash
zerotier-status
```

Run it with client name, to retreive current IP address of the specified client

```bash
zerotier home-pc
```
This will connect to my home PC using the account I’m currently logged in with. You can also connect using different accounts present on the remote machine, for example:

```bash
zerotier home-pc tomasz
```
The script can also be used to display network status and restart the ZeroTier daemon, if there’s any problem:

```bash
zerotier status
zerotier restart
```
Run the script without parameters to see the help

### Code: ZeroTier Shell Script

Find it [here](https://github.com/cywf/Infraguard/../../../../zerotier.sh)