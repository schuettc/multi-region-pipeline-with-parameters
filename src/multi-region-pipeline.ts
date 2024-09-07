import { App } from 'aws-cdk-lib';
import { config } from 'dotenv';
import { PipelineStack } from '.';

config();

const app = new App();

// Function to check if an environment variable is set
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

// Check and get required environment variables
const pipelineName = requireEnv('PIPELINE_NAME');
const repoOwner = requireEnv('REPO_OWNER');
const repoName = requireEnv('REPO_NAME');
const repoBranch = requireEnv('REPO_BRANCH');
const connectionArn = requireEnv('CONNECTION_ARN');

new PipelineStack(app, 'MultiRegionPipelineStack', {
  env: {
    account: requireEnv('ACCOUNT_ID'),
    region: 'us-east-1',
  },
  pipelineConfig: {
    pipelineName,
    repoOwner,
    repoName,
    repoBranch,
    connectionArn,
  },
});

app.synth();
