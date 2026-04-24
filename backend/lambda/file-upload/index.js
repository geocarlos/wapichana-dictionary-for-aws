const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: 'us-east-2' });
const BASE_URL = '/api/v1/wapichana-file-upload';
const bucketName = process.env.BUCKET_NAME;

function getHeaders() {
    return {
        'Access-Control-Allow-Origin': '*'
    };
}

async function uploadFileToS3Bucket(key) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: 'multipart/form-data'
    });
    try {
        const preSignedURL = await getSignedUrl(s3, command, { expiresIn: 120 });
        return {
            statusCode: 200,
            headers: getHeaders(),
            body: JSON.stringify({
                fileUploadURL: preSignedURL
            })
        };
    } catch (e) {
        return {
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: e.message })
        };
    }
}

exports.handler = (event) => {
    const path = event.resource.replace(BASE_URL, '');
    const method = event.httpMethod.toUpperCase();

    if (method === 'GET' && (path === '' || path === '/')) {
        const filename = event.queryStringParameters ? event.queryStringParameters.filename : null;
        if (filename) {
            console.log('FILE NAME:', filename);
            return uploadFileToS3Bucket(filename);
        } else {
            return {
                statusCode: 400,
                headers: getHeaders(),
                body: 'Missing file!'
            };
        }
    } else {
        return {
            statusCode: 400,
            headers: getHeaders(),
            body: 'Method not supported'
        };
    }
};
