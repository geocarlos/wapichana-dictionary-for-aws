import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Tags } from '@aws-cdk/core';

export default class TaggingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    Tags.of(this).add('Ananda', 'DicionarioWapichana');
  }
}
