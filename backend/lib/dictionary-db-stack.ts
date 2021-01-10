import { Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";

export default class DatabaseStack extends Stack {
    public readonly entries: Table;
    public readonly dictionaryFuction: Function;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const definitionIndexProps = {
            entry: {
                indexName: 'entry',
                partitionKey: {
                    name: 'entry',
                    type: AttributeType.STRING
                },
                billingMode: BillingMode.PAY_PER_REQUEST
            },
            definition: {
                indexName: 'definition',
                partitionKey: {
                    name: 'definition',
                    type: AttributeType.STRING
                },
                billingMode: BillingMode.PAY_PER_REQUEST
            },

        }

        this.entries = new Table(this, 'wapichana-entries', {
            tableName: 'wapichana-entries',
            partitionKey: {
                name: 'entry_id',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.RETAIN
        });

        this.entries.addGlobalSecondaryIndex(definitionIndexProps.entry);
        this.entries.addGlobalSecondaryIndex(definitionIndexProps.definition);

        this.dictionaryFuction = new Function(this, 'dictionary-function', {
            functionName: 'blog-function',
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset('lambda/blog/dist'),
            initialPolicy: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:PutItem', 'dynamodb:DeleteItem', 'dynamodb:Scan', 'dynamodb:Query'],
                    resources: [this.entries.tableArn, this.entries.tableArn + '/index/*']
                })
            ]
        })
    }
}