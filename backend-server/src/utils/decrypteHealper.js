const crypto = require("crypto-js");

function decryptData(encryptedData) {
  const bytes = crypto.AES.decrypt(encryptedData, process.env.ENCRYPTION_KEY);
  return bytes.toString(crypto.enc.Utf8);
}

module.exports = { decryptData };
