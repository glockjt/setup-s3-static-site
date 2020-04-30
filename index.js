const core = require("@actions/core");
const github = require("@actions/github");
const createS3Bucket = require("./create-s3-bucket");
const s3BucketExists = require("./s3-bucket-exists");
const syncS3Bucket = require("./sync-s3-bucket");

async function run() {
  try {
    const token = core.getInput("token");
    const buildDir = core.getInput("build-dir");
    // console.log(`username: `, username);
    const prLabel = github.context.payload.pull_request.head.label;

    // console.log(JSON.stringify(payload, null, 2));
    // console.log(`prLabel: `, prLabel.replace(":", "-"));
    const bucketName = prLabel.replace(":", "-");
    const bucketExists = await s3BucketExists(bucketName);

    console.log(`bucketExists: `, bucketExists);

    if (!bucketExists) {
      await createS3Bucket(bucketName);
    }
    core.setOutput(
      "url",
      `http://${bucketName}.s3-website-${
        process.env.AWS_DEFAULT_REGION || "us-east-1"
      }.amazonaws.com`
    );

    const octokit = new github.GitHub(token);
    await octokit.repos.createCommitComment({
      owner: "HE FE Bot",
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
      commit_id: github.context.payload.pull_request.head.sha,
      body: `PR URL: http://${bucketName}.s3-website-${
        process.env.AWS_DEFAULT_REGION || "us-east-1"
      }.amazonaws.com`,
    });

    syncS3Bucket(buildDir, bucketName);
    core.setOutput("status", "Files synced");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
