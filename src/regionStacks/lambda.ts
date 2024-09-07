import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class LambdaResources extends Construct {
  public readonly lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, topic: ITopic) {
    super(scope, id);

    // Create the Lambda function
    this.lambdaFunction = new NodejsFunction(this, 'SNSGenerator', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'handler',
      entry: 'src/regionStacks/resources/snsGenerator/index.ts',
      environment: {
        TOPIC_ARN: topic.topicArn,
      },
      logRetention: RetentionDays.ONE_WEEK,
    });

    // Subscribe the Lambda to the SNS topic
    topic.addSubscription(new LambdaSubscription(this.lambdaFunction));
  }
}