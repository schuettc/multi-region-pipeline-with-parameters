import { Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export class SSMReaders extends Construct {
  public readonly topicArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const ssmPolicy = new PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: [`arn:aws:ssm:us-east-1:${Stack.of(this).account}:parameter/mulit-region-pipeline/*`],
    });

    const snsTopicArnReader = new AwsCustomResource(this, 'SNSTopicArnReader', {
      onCreate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: '/mulit-region-pipeline/topic-arn',
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of('TopicArnParameter'),
      },
      onUpdate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: '/mulit-region-pipeline/topic-arn',
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of('TopicArnParameter'),
      },
      policy: AwsCustomResourcePolicy.fromStatements([ssmPolicy]),
    });

    this.topicArn = snsTopicArnReader.getResponseField('Parameter.Value');
  }
}