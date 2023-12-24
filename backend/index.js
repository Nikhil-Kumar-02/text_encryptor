const express = require('express')
const app = express()
const port = 3100
const cors = require('cors');

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors()); // Enable CORS for all routes

app.get('/encrypt', (req, res) => {
  const email = req.query.email;
  const encryptedMail = encrypt(email , secretKey);

  res.status(200).json(
    {
      "ecncypted_Text" : encryptedMail.encryptedText
    }
  );
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



const crypto = require('crypto');
const { copyFileSync } = require('fs');

// Encryption function
function encrypt(text, secretKey) {
  const iv = crypto.randomBytes(12); // Initialization vector (IV) should be unique
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return { iv: iv.toString('hex'), encryptedText: encrypted, tag: tag.toString('hex') };
}

// Decryption function
function decrypt(encryptedData, secretKey) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secretKey, 'hex'), Buffer.from(encryptedData.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

  let decrypted = decipher.update(encryptedData.encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}

// Example usage
const secretKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
