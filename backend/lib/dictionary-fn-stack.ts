import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import DatabaseStack from './dictionary-db-stack';
import S3BucketStack from "./dictionary-s3-stack";

export default class FunctionStack extends Stack {
    public readonly dictionaryFuction: Function;

    constructor(scope: Construct, id: string, dbStack: DatabaseStack, s3Stack: S3BucketStack, props?: StackProps) {
        super(scope, id, props);

        this.dictionaryFuction = new Function(this, 'wapichana-dictionary-function', {
            functionName: 'blog-function',
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset('lambda/blog/dist'),
            initialPolicy: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:PutItem', 'dynamodb:DeleteItem', 'dynamodb:Scan', 'dynamodb:Query'],
                    resources: [dbStack.entries.tableArn, dbStack.entries.tableArn + '/index/*']
                }),
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:PutObject', 'ListObjects'],
                    resources: [s3Stack.wapichanaBucket.bucketArn]
                })
            ]
        })
    }
}