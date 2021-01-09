import { Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";

export default class DictionaryStack extends Stack {
    public readonly posts: Table;
    public readonly categories: Table;
    public readonly blogFuction: Function;
    
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const languageIndexProps = {
            indexName: 'language',
            partitionKey: {
                name: 'language',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST
        }

        this.posts = new Table(this, 'posts', {
            tableName: 'posts',
            partitionKey: {
                name: 'uri',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN
        });

        this.posts.addGlobalSecondaryIndex(languageIndexProps)

        this.categories = new Table(this, 'categories', {
            tableName: 'categories',
            partitionKey: {
                name: 'name',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN
        });

        this.categories.addGlobalSecondaryIndex(languageIndexProps);

        this.blogFuction = new Function(this, 'blog-function', {
            functionName: 'blog-function',
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset('lambda/blog/dist'),
            initialPolicy: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:PutItem', 'dynamodb:DeleteItem', 'dynamodb:Scan', 'dynamodb:Query'],
                    resources: [this.posts.tableArn, this.categories.tableArn, this.posts.tableArn + '/index/*', this.categories.tableArn + '/index/*']
                })
            ]
        })
    }
}