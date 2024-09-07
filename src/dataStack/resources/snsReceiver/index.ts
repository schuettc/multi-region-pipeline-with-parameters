import { SNSEvent, SNSHandler } from 'aws-lambda';

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log('Received SNS Event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.Sns.Message);
    console.log('SNS details:', JSON.stringify(snsMessage, null, 2));
  }
};