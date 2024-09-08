import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import {
  SNSResources,
  LambdaResources,
} from './';

export class DataStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const snsResources = new SNSResources(this, 'SNSResources');
    new LambdaResources(this, 'LambdaResources', snsResources.topic);

    new CfnOutput(this, 'TopicArn', { value: snsResources.topic.topicArn });


    new StringParameter(this, 'TopicArnParam', {
      parameterName: '/mulit-region-pipeline/topic-arn',
      stringValue: snsResources.topic.topicArn,
    });


  }
}

