import * as cdk from '@aws-cdk/core';
import ApiStack from './api-stack';
import DatabaseStack from './dictionary-db-stack';
import CognitoStack from './cognito-stack';
import S3BucketStack from './dictionary-s3-stack';
import { Tags } from '@aws-cdk/core';
import FunctionStack from './dictionary-fn-stack';
import { CloudfrontStack } from './cloudfront-stack';
import { FrontendStack } from './frontend-stack';

export default class WapichanaDictionaryAppStack extends cdk.Stack {
  private cognito: CognitoStack;
  private database: DatabaseStack;
  private api: ApiStack;
  private bucket: S3BucketStack;
  private functions: FunctionStack;
  private frontend: FrontendStack;
  private cloudfront: CloudfrontStack;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    this.bucket = new S3BucketStack(scope, 'wapichana-bucket', props);
    this.cognito = new CognitoStack(scope, 'wapichana-cognito', props);
    this.database = new DatabaseStack(scope, 'wapichana-dictionary-db', props);
    this.functions = new FunctionStack(scope, 'wapichana-api-function', this.database, this.bucket, props);
    this.api = new ApiStack(scope, 'wapichana-dictionary-api', this.functions, props);
    this.frontend = new FrontendStack(scope, 'wapichana-dictionary-frontend', props)
    this.cloudfront = new CloudfrontStack(scope, 'wapichana-dictionary-cloudfront', this.frontend, this.api, props);    
  }
}
