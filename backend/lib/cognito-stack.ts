import { CfnIdentityPool, CfnUserPool, CfnUserPoolClient, CfnUserPoolGroup } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, PolicyDocument, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { CfnOutput, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import TaggingStack from "./tagging-stack";

const USER_POOL_NAME = 'wdUserPool';
const USER_POOL_CLIENT_NAME = 'wdClient';
const USER_IDENTITY_POOL = 'wdIdentityPool';

export default class CognitoStack extends TaggingStack {
    public readonly userPool: CfnUserPool;
    public readonly userPoolClient: CfnUserPoolClient;
    public readonly userIdentityPool: CfnIdentityPool;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.userPool = new CfnUserPool(this, USER_POOL_NAME, {
            userPoolName: USER_POOL_NAME,
            schema: [
                {
                    name: 'email',
                    required: true,
                    mutable: false
                }
            ],
            policies: {
                passwordPolicy: {
                    minimumLength: 8,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireUppercase: true,
                    requireSymbols: true,
                    temporaryPasswordValidityDays: 30
                }
            },
            mfaConfiguration: 'OFF',
            adminCreateUserConfig: {
                allowAdminCreateUserOnly: true
            }
        });

        new CfnOutput(this, 'wdUserPoolId', {
            exportName: 'wdCognitoUserPoolId',
            value: this.userPool.ref
        });

        this.userPoolClient = new CfnUserPoolClient(this, USER_POOL_CLIENT_NAME, {
            clientName: USER_POOL_CLIENT_NAME,
            generateSecret: false,
            userPoolId: this.userPool.ref,
            refreshTokenValidity: 30,
            readAttributes: ['email', 'email_verified'],
            writeAttributes: ['email']
        });

        new CfnOutput(this, 'wdUserPoolclient', {
            exportName: 'wdCognitoUserPoolClient',
            value: this.userPoolClient.ref
        });

        this.userIdentityPool = new CfnIdentityPool(this, USER_IDENTITY_POOL, {
            identityPoolName: USER_IDENTITY_POOL,
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: this.userPoolClient.ref,
                    providerName: this.userPool.attrProviderName,
                    serverSideTokenCheck: true
                }
            ]
        });

        const cognitoPrincipal = new FederatedPrincipal(
            'cognito-identity.amazon.com',
            {
                StringEquals: {
                    'cognito-identity.amazon.com:aud': this.userIdentityPool.ref
                }
            }
        );

        const editorRole = new Role(this, 'EditorRole', {
            roleName: 'EditorRole',
            assumedBy: cognitoPrincipal
        });

        const unauthRole = new Role(this, 'wdUnauthRole', {
            roleName: 'wdUnauthRole',
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazon.com',
                {
                    StringEquals: {
                        'cognito-identity.amazon.com:aud': this.userIdentityPool.ref
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazon.com:amr': 'unauthenticated'
                    }
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
            inlinePolicies: {
                Publish: new PolicyDocument(
                    {
                        statements: [
                            new PolicyStatement({
                                effect: Effect.ALLOW,
                                actions: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
                                resources: ['*']
                            })
                        ]
                    }
                )
            }
        });

        const authRole = new Role(this, 'wdAuthRole', {
            roleName: 'wdAuthRole',
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazon.com',
                {
                    StringEquals: {
                        'cognito-identity.amazon.com:aud': this.userIdentityPool.ref
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazon.com:amr': 'authenticated'
                    }
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
            inlinePolicies: {
                Publish: new PolicyDocument(
                    {
                        statements: [
                            new PolicyStatement({
                                effect: Effect.ALLOW,
                                actions: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
                                resources: ['*']
                            })
                        ]
                    }
                )
            }
        });

        new CfnUserPoolGroup(this, 'DictionaryEditor', {
            userPoolId: this.userPool.ref,
            groupName: 'DictionaryEditor',
            description: 'Group of dictionary editors',
            precedence: 0,
            roleArn: editorRole.roleArn
        })
    }
}