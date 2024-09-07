import { Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export class SSMReaders extends Construct {
  public readonly firehoseDeliveryStreamArn: string;
  public readonly errorTopicArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const ssmPolicy = new PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: [`arn:aws:ssm:us-east-1:${Stack.of(this).account}:parameter/llm-benchmark/*`],
    });

    const firehoseArnReader = new AwsCustomResource(this, 'FirehoseArnReader', {
      onCreate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: '/llm-benchmark/firehose-arn',
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of('FirehoseArnParameter'),
      },
      onUpdate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: '/llm-benchmark/firehose-arn',
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of('FirehoseArnParameter'),
      },
      policy: AwsCustomResourcePolicy.fromStatements([ssmPolicy]),
    });

    const snsTopicArnReader = new AwsCustomResource(this, 'SNSTopicArnReader', {
      onCreate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: '/llm-benchmark/error-topic-arn',
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of('ErrorTopicArnParameter'),
      },
      onUpdate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: '/llm-benchmark/error-topic-arn',
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of('ErrorTopicArnParameter'),
      },
      policy: AwsCustomResourcePolicy.fromStatements([ssmPolicy]),
    });

    this.firehoseDeliveryStreamArn = firehoseArnReader.getResponseField('Parameter.Value');
    this.errorTopicArn = snsTopicArnReader.getResponseField('Parameter.Value');
  }
}