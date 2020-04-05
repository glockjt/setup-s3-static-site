const core = require("@actions/core");
const github = require("@actions/github");
const createS3Bucket = require("./create-s3-bucket");

async function run() {
  try {
    // const bucketName = core.getInput("bucket-name");
    const username = github.context.actor;
    console.log(`username: `, username);
    const prLabel = github.context.payload.pull_request.head.label;
    // console.log(JSON.stringify(payload, null, 2));
    console.log(`prLabel: `, prLabel.replace(":", "-"));
    const result = await createS3Bucket(prLabel.replace(":", "-"));
    core.setOutput("result", result);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
