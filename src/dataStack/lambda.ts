import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class LambdaResources extends Construct {
  public readonly lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, topic: Topic) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, 'SNSReceiver', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'handler',
      entry: 'src/dataStack/resources/snsReceiver/index.ts',
      environment: {
      },
      logRetention: RetentionDays.ONE_WEEK,
    });

    topic.addSubscription(new LambdaSubscription(this.lambdaFunction));
  }
}