const { execSync } = require("child_process");

module.exports = function syncS3Bucket(srcDir, bucketName) {
  const stdout = execSync(
    `AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY} aws s3 sync ${srcDir}/ s3://${bucketName}/`
  );
  console.log(stdout.toString());
  return;
};
