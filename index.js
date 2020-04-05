const core = require("@actions/core");
const github = require("@actions/github");
const createS3Bucket = require("./create-s3-bucket");

async function run() {
  try {
    // const bucketName = core.getInput("bucket-name");
    const username = github.context.actor;
    console.log(`username: `, username);
    const payload = github.context.payload;
    console.log(JSON.stringify(payload, null, 2));
    // const result = await createS3Bucket(bucketName);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
