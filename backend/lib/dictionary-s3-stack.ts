import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import { Bucket, HttpMethods } from '@aws-cdk/aws-s3';

export default class S3BucketStack extends Stack {
    public readonly wapichanaBucket: Bucket;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.wapichanaBucket = new Bucket(this, 'wapichana', {
            removalPolicy: RemovalPolicy.RETAIN,
            cors: [
                {
                    maxAge: 3000,
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                    allowedMethods: [
                        HttpMethods.GET,
                        HttpMethods.POST,
                        HttpMethods.PUT,
                        HttpMethods.DELETE,
                        HttpMethods.HEAD
                    ]
                }
            ]
        });

        new CfnOutput(this, 'AttachmentWapichanaBucket', {
            value: this.wapichanaBucket.bucketName
        });
    }
}