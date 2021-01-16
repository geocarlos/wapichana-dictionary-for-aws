import { Construct, StackProps } from "@aws-cdk/core";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import DatabaseStack from './dictionary-db-stack';
import S3BucketStack from "./dictionary-s3-stack";
import TaggingStack from "./tagging-stack";

export default class FunctionStack extends TaggingStack {
    public readonly dictionaryFuction: Function;
    public readonly fileUploadFunction: Function;

    constructor(scope: Construct, id: string, dbStack: DatabaseStack, s3Stack: S3BucketStack, props?: StackProps) {
        super(scope, id, props);

        this.dictionaryFuction = new Function(this, 'wapichana-dictionary-function', {
            functionName: 'wapichana-dictionary-function',
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset('lambda/wapichana-dictionary/dist'),
            initialPolicy: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:PutItem', 'dynamodb:DeleteItem', 'dynamodb:Scan', 'dynamodb:Query'],
                    resources: [dbStack.entries.tableArn, dbStack.entries.tableArn + '/index/*']
                })
            ]
        });

        this.fileUploadFunction = new Function(this, 'wapichana-fileupload-function', {
            functionName: 'wapichana-fileupload-function',
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset('lambda/file-upload/dist'),
            initialPolicy: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:PutObject', 's3:ListObjects'],
                    resources: [s3Stack.wapichanaBucket.bucketArn + '/*']
                })
            ],
            environment: {
                BUCKET_NAME: s3Stack.wapichanaBucket.bucketName
            }
        })
    }
}