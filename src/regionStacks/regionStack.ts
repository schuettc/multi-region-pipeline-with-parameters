import { Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import {
  SSMReaders,
  LambdaResources,
} from '.';

export class RegionStack extends Stack {
  constructor(scope: Construct, id: string, _props: StackProps) {
    super(scope, id, _props);

    const ssmReaders = new SSMReaders(this, 'SSMReaders');

    const topic = Topic.fromTopicArn(this, 'ImportedErrorTopic', ssmReaders.errorTopicArn);
    new LambdaResources(this, 'LambdaResources', topic);
  }
}


