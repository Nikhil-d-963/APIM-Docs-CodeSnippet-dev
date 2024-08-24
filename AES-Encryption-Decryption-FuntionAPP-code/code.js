const crypto = require('crypto');




//Use this code as HTTP trigger in Function app 
// give action in query params 
// give aes-key key in header


// you can use this apim using send request policy 




// Static IV for AES-128-CBC, should be 16 bytes
const STATIC_IV = Buffer.from('0123456789abcdef'); // Ensure this is 16 bytes
const AES_KEY_LENGTH = 16; // AES-128 requires a 16-byte key

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const action = req.query.action || (req.body && req.body.action);
    const key = req.headers['aes-key'];
    
    if (!key) {
        context.res = {
            status: 400,
            body: "AES key is required in the header."
        };
        return;
    }

    let aesKey;
    try {
        aesKey = Buffer.from(key, 'base64');
        if (aesKey.length !== AES_KEY_LENGTH) {
            throw new Error('Invalid AES key length.');
        }
    } catch (err) {
        context.res = {
            status: 400,
            body: `Invalid AES key: ${err.message}`
        };
        return;
    }

    if (!action) {
        context.res = {
            status: 400,
            body: "Action parameter is required. Use 'encrypt' or 'decrypt'."
        };
        return;
    }

    if (action === 'encrypt') {
        const plaintext = JSON.stringify(req.body);
        if (!plaintext) {
            context.res = {
                status: 400,
                body: "Data to encrypt is required in the request body."
            };
            return;
        }

        try {
            const cipher = crypto.createCipheriv('aes-128-cbc', aesKey, STATIC_IV);
            let encrypted = cipher.update(plaintext, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            context.res = {
                status: 200,
                body: { encryptedData: encrypted } // Return encrypted data
            };
        } catch (err) {
            context.res = {
                status: 500,
                body: `Encryption failed: ${err.message}`
            };
        }
    } else if (action === 'decrypt') {
        const encryptedData = req.body.encryptedData;
        if (!encryptedData) {
            context.res = {
                status: 400,
                body: "Encrypted data is required in the request body."
            };
            return;
        }

        try {
            const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, STATIC_IV);
            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');

            context.res = {
                status: 200,
                body: JSON.parse(decrypted) // Return decrypted JSON object
            };
        } catch (err) {
            context.res = {
                status: 500,
                body: `Decryption failed: ${err.message}`
            };
        }
    } else {
        context.res = {
            status: 400,
            body: "Invalid action. Use 'encrypt' or 'decrypt'."
        };
    }
};
