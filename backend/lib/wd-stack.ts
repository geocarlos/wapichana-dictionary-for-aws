import * as cdk from '@aws-cdk/core';
import ApiStack from './api-stack';
import DictionaryStack from './dictionary-db-stack';
import CognitoStack from './cognito-stack';
import S3BucketStack from './dictionary-s3-stack';
import { Tags } from '@aws-cdk/core';
import FunctionStack from './dictionary-fn-stack';

export default class ThroughLettersAndCodeStack extends cdk.Stack {
  private cognito: CognitoStack;
  private dictionary: DictionaryStack;
  private api: ApiStack;
  private bucket: S3BucketStack;
  private functions: FunctionStack;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    Tags.of(this).add('Ananda', 'DicionarioWapichana')
    this.bucket = new S3BucketStack(scope, 'wapichana-bucket', props);
    this.cognito = new CognitoStack(scope, 'wapichana-cognito', props);
    this.dictionary = new DictionaryStack(scope, 'wapichana-dictionary', props);
    this.functions = new FunctionStack(scope, 'wapichana-api-function')
    this.api = new ApiStack(scope, 'wapichana-dictionary-api', this.dictionary, props);
  }
}
