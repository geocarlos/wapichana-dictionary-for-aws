const AWS = require('aws-sdk');

const s3 = new AWS.S3({signatureVersion: 'v4', region: 'us-east-2'});
const BASE_URL = '/api/v1/wapichana-file-upload';
const bucketName = process.env.BUCKET_NAME;

function getHeaders() {
    return {
        'Access-Control-Allow-Origin': '*'
    };
}

async function uploadFileToS3Bucket(key) {
     const params = {
         Bucket: bucketName,
         Key: key,
         ContentType: "multipart/form-data",
         Expires: 120
     };
     try {
         const preSignedURL = await s3.getSignedUrl("putObject", params);
         let returnObject = {
             statusCode: 200,
             headers: getHeaders(),
             body: JSON.stringify({
                 fileUploadURL: preSignedURL
             })
         };
         return returnObject;
     } catch (e) {
         const response = {
             err: e.message,
             headers: getHeaders(),
             body: "error occured"
         };
         return response;
     }
}

exports.handler = (event) => {
    const path = event.resource.replace(BASE_URL, '');
    const method = event.httpMethod.toUpperCase();

    if (method === 'GET' && path === '' || path === '/') {
        const filename = event.queryStringParameters ? event.queryStringParameters.filename : null;
        if (filename) {
            console.log('FILE NAME:', filename)
            return uploadFileToS3Bucket(filename);
        } else {
            return {
                statusCode: 400,
                headers: getHeaders(),
                body: 'Missing file!'
            }
        }
    } else {
        return {
            statusCode: 400,
            headers: getHeaders(),
            body: 'Method not supported'
        }
    }
}