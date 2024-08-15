
# Steps for Setting Up mTLS in Azure API Management

This guide outlines the steps to set up mutual TLS (mTLS) in Azure API Management (APIM) and configure Postman to test APIs using client certificates.


### Prerequisites
##### Azure API Management (APIM) instance.
##### OpenSSL installed on your Ubuntu system.
##### Postman for testing APIs.


## Step 1: Generate Self-Signed Certificates

#### Generate Client Certificate and Key
```shell
openssl req -newkey rsa:2048 -nodes -keyout client.key -x509 -days 365 -out client.crt
```

#### Convert Certificate and Key to .p12 
```shell
openssl pkcs12 -export -out client.p12 -inkey client.key -in client.crt
```

#### Convert .p12 to .pfx
```shell
openssl pkcs12 -export -out client.pfx -inkey client.key -in client.crt
```

## Step 2: Upload the Server Certificate to Azure API Management
#### 1) Navigate to Azure Portal:
Go to your API Management instance.

#### 2) Upload the Server Certificate:
Under “Security”, select “Certificates”.
Click on “+Add”, select custom and upload your .pfx file.
#### Note the Thumbprint:

After uploading, note the thumbprint of the certificate. You will need this for policy configuration.

add your Thumbprint in code 

```shell
    <choose>
        <when condition="@(context.Request.Certificate == null || context.Request.Certificate.Thumbprint != "Replace to your Thumbprint")">
         <return-response>
                <set-status code="403" reason="Invalid client certificate" />
        </return-response>
        </when>
    </choose>
```



## Step 3: Configure Client Certificate in Postman
Open Postman:
Go to “Settings” (gear icon in the top right).
Navigate to Certificates Tab:

Click on the “Certificates” tab.
Add Client Certificate:

Click on “Add Certificate”.
Enter your API’s domain or IP in the “Host” field.
In “CRT File”, select your .crt file.
In “KEY File”, select your .key file.
Optionally, add a “Passphrase” if your .key file is encrypted.
Make Requests:

Use Postman to make requests to your API. Postman will use the client certificate for authentication.


### Testing mTLS with curl
To test an API with mutual TLS using curl, you need to provide both the client certificate and key. Here’s the basic command structure:
```shell
curl --location -v --cert client.crt --key client.key --request POST 'https://example.com' 
```