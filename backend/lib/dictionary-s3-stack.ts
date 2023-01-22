import { CfnOutput, RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { Bucket, BucketAccessControl, HttpMethods } from 'aws-cdk-lib/aws-s3';
import TaggingStack from "./tagging-stack";

export default class S3BucketStack extends TaggingStack {
    public readonly wapichanaBucket: Bucket;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.wapichanaBucket = new Bucket(this, 'wapichana', {
            removalPolicy: RemovalPolicy.RETAIN,
            accessControl: BucketAccessControl.PUBLIC_READ,
            publicReadAccess: true,
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