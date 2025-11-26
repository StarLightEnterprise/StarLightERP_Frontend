#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define output files
KEY_FILE="$SCRIPT_DIR/starlighterp.key"
CRT_FILE="$SCRIPT_DIR/starlighterp.crt"
CONFIG_FILE="$SCRIPT_DIR/openssl.cnf"

# Create a temporary OpenSSL config file
cat > "$CONFIG_FILE" <<EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext
x509_extensions = v3_req

[dn]
C = US
ST = State
L = City
O = Organization
CN = StarlightERP.com

[req_ext]
subjectAltName = @alt_names

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = starlighterp.com
DNS.2 = localhost
EOF

# Generate self-signed SSL certificate using the config file
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CRT_FILE" \
  -config "$CONFIG_FILE"

# Remove the temporary config file
rm "$CONFIG_FILE"

# Set proper permissions (read/write for owner only for key)
chmod 600 "$KEY_FILE"
chmod 644 "$CRT_FILE"

echo "SSL certificates generated successfully!"
echo "Certificate: $CRT_FILE"
echo "Private Key: $KEY_FILE"
