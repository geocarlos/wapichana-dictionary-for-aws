import * as cdk from '@aws-cdk/core';
import ApiStack from './api-stack';
import DictionaryStack from './dictionary-db-stack';
import CognitoStack from './cognito-stack';

export default class ThroughLettersAndCodeStack extends cdk.Stack {
  private cognito: CognitoStack;
  private dictionary: DictionaryStack;
  private api: ApiStack;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.cognito = new CognitoStack(scope, 'tlc-cognito', props);
    this.dictionary = new DictionaryStack(scope, 'tlc-blog', props);
    this.api = new ApiStack(scope, 'tlc-api', this.dictionary, props);
  }
}
