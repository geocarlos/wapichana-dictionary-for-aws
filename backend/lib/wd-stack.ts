import * as cdk from '@aws-cdk/core';
import ApiStack from './api-stack';
import DatabaseStack from './dictionary-db-stack';
import CognitoStack from './cognito-stack';
import S3BucketStack from './dictionary-s3-stack';
import { Tags } from '@aws-cdk/core';
import FunctionStack from './dictionary-fn-stack';

export default class ThroughLettersAndCodeStack extends cdk.Stack {
  private cognito: CognitoStack;
  private database: DatabaseStack;
  private api: ApiStack;
  private bucket: S3BucketStack;
  private functions: FunctionStack;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    Tags.of(this).add('Ananda', 'DicionarioWapichana')
    this.bucket = new S3BucketStack(scope, 'wapichana-bucket', props);
    this.cognito = new CognitoStack(scope, 'wapichana-cognito', props);
    this.database = new DatabaseStack(scope, 'wapichana-dictionary-db', props);
    this.functions = new FunctionStack(scope, 'wapichana-api-function', this.database, this.bucket, props);
    this.api = new ApiStack(scope, 'wapichana-dictionary-api', this.functions, props);
  }
}
