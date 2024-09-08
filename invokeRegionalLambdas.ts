import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import * as dotenv from 'dotenv';
import { getAllRegions } from './src/config/regions';

dotenv.config();

const account = process.env.CDK_DEFAULT_ACCOUNT;
if (!account) {
  console.error('CDK_DEFAULT_ACCOUNT environment variable is not set');
  process.exit(1);
}

async function getLambdaFunctionName(region: string): Promise<string | null> {
  const cfClient = new CloudFormationClient({ region });
  const stackName = `RegionalStage-${region}-RegionStack`;

  try {
    const command = new DescribeStacksCommand({ StackName: stackName });
    const response = await cfClient.send(command);
    const outputs = response.Stacks?.[0].Outputs;
    const lambdaOutput = outputs?.find(output => output.OutputKey === 'LambdaFunctionName');
    return lambdaOutput?.OutputValue || null;
  } catch (error) {
    console.error(`Error getting Lambda function name for ${region}:`, error);
    return null;
  }
}

async function invokeLambda(region: string) {
  const functionName = await getLambdaFunctionName(region);
  if (!functionName) {
    console.error(`Could not find Lambda function name for region ${region}`);
    return null;
  }

  const client = new LambdaClient({ region });
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