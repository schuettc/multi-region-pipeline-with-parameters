
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class SNSResources extends Construct {
    public topic: Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new Topic(this, 'MultiRegionPipelineTopic', {
      topicName: 'multi-region-pipeline-topic',
    });


  }
}
