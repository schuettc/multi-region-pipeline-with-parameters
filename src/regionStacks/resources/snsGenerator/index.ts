import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

export const handler = async (event: any) => {
  const topicArn = process.env.TOPIC_ARN;

  if (!topicArn) {
    throw new Error('TOPIC_ARN environment variable is not set');
  }

  const message = {
    timestamp: new Date().toISOString(),
    event: event,
  };

  const params = {
    Message: JSON.stringify(message),
    TopicArn: topicArn,
  };

  try {
    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    console.log('Message published successfully:', result.MessageId);
    return {
      statusCode: 200,
      body: JSON.stringify({ messageId: result.MessageId }),
    };
  } catch (error) {
    console.error('Error publishing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to publish message' }),
    };
  }
};
