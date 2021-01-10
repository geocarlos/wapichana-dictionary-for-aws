import { Construct, RemovalPolicy, StackProps } from "@aws-cdk/core";
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Function } from "@aws-cdk/aws-lambda";
import TaggingStack from "./tagging-stack";

export default class DatabaseStack extends TaggingStack {
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
                billingMode: BillingMode.PROVISIONED,
                writeCapacity: 1,
                readCapacity: 1
            },
            initialLetter: {
                indexName: 'initialLetter',
                partitionKey: {
                    name: 'initialLetter',
                    type: AttributeType.STRING
                },
                billingMode: BillingMode.PROVISIONED,
                writeCapacity: 1,
                readCapacity: 1
            },
            definition: {
                indexName: 'definition',
                partitionKey: {
                    name: 'definition',
                    type: AttributeType.STRING
                },
                billingMode: BillingMode.PROVISIONED,
                writeCapacity: 1,
                readCapacity: 1
            },

        }

        this.entries = new Table(this, 'wapichana-dictionary', {
            tableName: 'wapichana-dictionary',
            partitionKey: {
                name: 'entry_id',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PROVISIONED,
            writeCapacity: 1,
            readCapacity: 1,
            removalPolicy: RemovalPolicy.RETAIN
        });

        this.entries.addGlobalSecondaryIndex(definitionIndexProps.entry);
        this.entries.addGlobalSecondaryIndex(definitionIndexProps.definition);
        this.entries.addGlobalSecondaryIndex(definitionIndexProps.initialLetter);
    }
}