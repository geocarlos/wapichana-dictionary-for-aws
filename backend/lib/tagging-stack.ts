import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Tags } from 'aws-cdk-lib';

export default class TaggingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    Tags.of(this).add('Ananda', 'DicionarioWapichana');
  }
}
