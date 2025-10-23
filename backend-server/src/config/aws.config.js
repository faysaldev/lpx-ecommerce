// utils/aws-config.js (v3 version)
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGINION,
  credentials: {
    accessKeyId: process.env.AWS_YOUR_ACCESS_KEY,
    secretAccessKey: process.env.AWS_YOUR_SECRET_KEY,
  },
});

module.exports = { s3 };
