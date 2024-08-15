# Configuring JWT Validation in Azure API Management (APIM)
This guide provides instructions for configuring JWT validation in Azure API Management (APIM) and removing the JWT token after verification.

Configuration Steps
1. Configure JWT Validation
Add the validate-jwt policy to your API's policy configuration to validate the JWT token provided in the Authorization header.


```shell 
<validate-jwt
    header-name="name of HTTP header containing the token (alternatively, use query-parameter-name or token-value attribute to specify token)"
    query-parameter-name="name of query parameter used to pass the token (alternative, use header-name or token-value attribute to specify token)"
    token-value="expression returning the token as a string (alternatively, use header-name or query-parameter attribute to specify token)"
    failed-validation-httpcode="HTTP status code to return on failure"
    failed-validation-error-message="error message to return on failure"
    require-expiration-time="true | false"
    require-scheme="scheme"
    require-signed-tokens="true | false"
    clock-skew="allowed clock skew in seconds"
    output-token-variable-name="name of a variable to receive a JWT object representing successfully validated token">
  <openid-config url="full URL of the configuration endpoint, for example, https://login.constoso.com/openid-configuration" />
  <issuer-signing-keys>
    <key>Base64 encoded signing key | certificate-id="mycertificate" | n="modulus" e="exponent"</key>
    <!-- if there are multiple keys, then add additional key elements -->
  </issuer-signing-keys>
  <decryption-keys>
    <key>Base64 encoded signing key | certificate-id="mycertificate" | n="modulus" e="exponent" </key>
    <!-- if there are multiple keys, then add additional key elements -->
  </decryption-keys>
  <audiences>
    <audience>audience string</audience>
    <!-- if there are multiple possible audiences, then add additional audience elements -->
  </audiences>
  <issuers>
    <issuer>issuer string</issuer>
    <!-- if there are multiple possible issuers, then add additional issuer elements -->
  </issuers>
  <required-claims>
    <claim name="name of the claim as it appears in the token" match="all | any" separator="separator character in a multi-valued claim">
      <value>claim value as it is expected to appear in the token</value>
      <!-- if there is more than one allowed value, then add additional value elements -->
    </claim>
    <!-- if there are multiple possible allowed claim, then add additional claim elements -->
  </required-claims>
</validate-jwt>
```

#### The {{jwt-key}} placeholder represents the JWT signing key stored as a named value in APIM. You can also dynamically fetch the key from a third-party source if needed.

For more details on the validate-jwt policy and additional configuration options, refer to the [Azure API Management JWT Validation Policy Documentation.](https://learn.microsoft.com/en-us/azure/api-management/validate-jwt-policy)
