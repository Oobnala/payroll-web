import server from '../../api/server';
var AWS = require('aws-sdk');

let accessKeyId;
let secretAccessKey;
if (typeof process.env.REACT_APP_AWS_ACCESS_KEY === 'undefined') {
  console.error(
    'UNABLE TO GET ENV VAR ACCESS KEY ID',
    process.env.REACT_APP_AWS_ACCESS_KEY
  );
  console.error(
    'UNABLE TO GET ENV VAR ACCESS KEY ID',
    process.env.AWS_ACCESS_KEY
  );
} else {
  accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY;
}

if (typeof process.env.REACT_APP_AWS_SECRET_KEY === 'undefined') {
  console.error(
    'UNABLE TO GET ENV VAR SECRET KEY',
    process.env.REACT_APP_AWS_SECRET_KEY
  );
  console.error('UNABLE TO GET ENV VAR SECRET KEY', process.env.AWS_SECRET_KEY);
} else {
  secretAccessKey = process.env.REACT_APP_AWS_SECRET_KEY;
}

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});
var s3 = new AWS.S3();

let retryCounter = 0;

export const getDataFromAWS = (bucketName, fileName) =>
  new Promise((resolve, reject) => {
    s3.getObject({ Bucket: bucketName, Key: fileName }, (error, data) => {
      if (error != null) {
        if (error.code === 'NoSuchKey') {
          console.log(
            'File does not exist yet, retrying in 3 seconds',
            retryCounter
          );
          retryCounter += 1;
          if (retryCounter <= 5) {
            setTimeout(function () {
              getDataFromAWS();
            }, 3000);
          } else {
            console.error(
              'Unable to retrieve file within the expected time limit'
            );
            reject();
          }
        } else {
          console.log('Failed to retrieve an object: ' + error);
          reject();
        }
      } else {
        console.log('Loaded ' + data.ContentLength + ' bytes');
        // do something with data.Body
        console.log(data);
        resolve(data.Body);
      }
    });
  });

export const emailPDF = (period) => async (dispatch) => {
  await server
    .post(`email/${period}`)
    .then((response) => {
      console.log(response);
      if (response.data === 'OK') {
        console.log('PDF email successful');
      }

      if (response.data === 'ERROR') {
        console.log('An error occured with emailing the PDF');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
