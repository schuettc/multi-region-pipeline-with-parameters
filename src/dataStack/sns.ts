
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class SNSResources extends Construct {
    public benchmarkErrorTopic: Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.benchmarkErrorTopic = new Topic(this, 'BenchmarkErrorTopic', {
      topicName: 'benchmark-error-topic',
    });


  }
}
