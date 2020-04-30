const AWS = require("aws-sdk");
AWS.config.region = process.env.AWS_DEFAULT_REGION || "us-east-1";
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

module.exports = async function s3BucketExists(bucketName) {
  const bucketParams = {
    Bucket: bucketName,
    // ACL: "public-read",
  };

  const exists = await s3
    .headBucket(bucketParams)
    .promise()
    .then(() => {
      console.log("true");
      return true;
    })
    .catch((err) => {
      console.log("false");
      return false;
    });

  return exists;
};
