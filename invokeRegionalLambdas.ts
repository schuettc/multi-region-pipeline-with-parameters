import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import * as dotenv from 'dotenv';
import { getAllRegions } from './src/config/regions';

dotenv.config();

const account = process.env.CDK_DEFAULT_ACCOUNT;
if (!account) {
  console.error('CDK_DEFAULT_ACCOUNT environment variable is not set');
  process.exit(1);
}

async function invokeLambda(region: string) {
  const client = new LambdaClient({ region });
  const functionName = `RegionalStage-${region}-RegionStack-SNSGenerator`;

  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: JSON.stringify({ test: 'Invoking from script' }),
  });

  try {
    const response = await client.send(command);
    console.log(`Successfully invoked Lambda in ${region}:`, response);
    return response;
  } catch (error) {
    console.error(`Error invoking Lambda in ${region}:`, error);
    return null;
  }
}

async function invokeAllRegionalLambdas() {
  const regions = getAllRegions();
  console.log('Invoking Lambdas in the following regions:', regions.join(', '));

  for (const region of regions) {
    await invokeLambda(region);
  }
}

invokeAllRegionalLambdas()
  .then(() => console.log('Finished invoking all regional Lambdas'))
  .catch((error) => console.error('Error invoking regional Lambdas:', error));