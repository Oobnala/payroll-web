var AWS = require('aws-sdk');
AWS.config.update(
  {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  }
);
var s3 = new AWS.S3();

let retryCounter = 0

export const getDataFromAWS = (bucketName, fileName) => new Promise((resolve,reject) => {
    s3.getObject(
        { Bucket: bucketName, Key: fileName },
        (error, data) => {
            if (error != null) {
                if (error.code === 'NoSuchKey') {
                    console.log("File does not exist yet, retrying in 3 seconds", retryCounter)
                    retryCounter += 1
                    if (retryCounter <= 5) {
                        setTimeout(function() {
                            getDataFromAWS()
                        }, 3000);
                    } else {
                        console.error("Unable to retrieve file within the expected time limit")
                        reject()
                    }
                } else {
                    console.log("Failed to retrieve an object: " + error);
                    reject()
                }
            } else {
                console.log("Loaded " + data.ContentLength + " bytes");
                // do something with data.Body
                console.log(data)
                resolve(data.Body)
            }
          }
        );
})
