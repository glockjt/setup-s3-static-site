const core = require("@actions/core");
const github = require("@actions/github");
const createS3Bucket = require("./create-s3-bucket");

async function run() {
  try {
    // const bucketName = core.getInput("bucket-name");
    const username = github.context.actor;
    console.log(`username: `, username);
    const pr = github.context.payload.pull_request;
    console.log(`pr: `, pr);
    // const result = await createS3Bucket(bucketName);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
