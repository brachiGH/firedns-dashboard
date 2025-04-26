1. Generate Self-Signed Certificate and Key (for local development):

You can use openssl for this. Run these commands in your terminal:

```
# Generate a private key
openssl genpkey -algorithm RSA -out server.key

# Generate a Certificate Signing Request (CSR)
# You'll be prompted for information, you can leave most fields blank for local dev
openssl req -new -key server.key -out server.csr

# Generate a self-signed certificate valid for 365 days
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```