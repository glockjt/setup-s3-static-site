const { readFile } = require("fs");
const AWS = require("aws-sdk");
AWS.config.region = process.env.AWS_DEFAULT_REGION || "us-east-1";
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// const bucketParams = {
//   Bucket: process.argv[2],
//   ACL: "public-read",
// };

// const staticHostParams = {
//   Bucket: process.argv[2],
//   WebsiteConfiguration: {
//     IndexDocument: { Suffix: "index.html" },
//     ErrorDocument: { Key: "index.html" },
//   },
// };

// s3.createBucket(bucketParams, function (err, data) {
//   if (err) {
//     console.log(`err: `, err);
//   } else {
//     console.log("Bucket URL: ", data.Location);

//     s3.putBucketWebsite(staticHostParams, function (err, data) {
//       if (err) {
//         console.log(`err: `, err);
//       } else {
//         console.log("Success: ", data);
//       }
//     });
//   }
// });

module.exports = function (bucketName) {
  const bucketParams = {
    Bucket: bucketName,
    // ACL: "public-read",
  };

  const staticHostParams = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      IndexDocument: { Suffix: "index.html" },
      ErrorDocument: { Key: "index.html" },
    },
  };

  const policyParams = {
    Bucket: bucketName,
    Policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }),
  };

  return s3
    .createBucket(bucketParams)
    .promise()
    .then((data, err) => {
      if (err) {
        console.log(`Create Bucket Error: `, err);
      } else {
        console.log("Create Bucket: ", JSON.stringify(data, null, 2));
        return;
      }
    })
    .then(() => {
      s3.putBucketWebsite(staticHostParams)
        .promise()
        .then((data, err) => {
          if (err) {
            console.log(`Put Bucket Website Error: `, err);
          } else {
            console.log("Put Bucket Website: ", JSON.stringify(data, null, 2));
            return data;
          }
        });
    })
    .then(() => {
      s3.putBucketPolicy(policyParams)
        .promise()
        .then((data, err) => {
          if (err) {
            console.log("Put Bucket Policy Error: ", error);
          } else {
            console.log("Put Bucket Policy: ", JSON.stringify(data, null, 2));
            return data;
          }
        });
    })
    .then(() => {
      return readFile("index.html", "utf-8", (err, data) => {
        if (err) {
          console.log("Read File Error: ", err);
        } else {
          return s3
            .putObject({
              Bucket: bucketName,
              Key: "index.html",
              ContentType: "text/html",
              Body: data,
            })
            .promise()
            .then((data, err) => {
              if (err) {
                console.log("Put Bucket Error: ", error);
              } else {
                console.log("Put Bucket: ", JSON.stringify(data, null, 2));
                return data;
              }
            });
        }
      });
    });
};
