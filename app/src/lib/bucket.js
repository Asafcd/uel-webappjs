const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv")
dotenv.config()

const BUCKET="unlo-img-bucket"
const BUCKET_REGION="us-east-2"
const ACCESS_KEY="AKIA432VRHMFB7QNJYPH"
const SECRET_AKEY="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"

const client = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_AKEY,
  },  
  region: BUCKET_REGION || "us-east-2"
})

module.exports = { client, BUCKET}