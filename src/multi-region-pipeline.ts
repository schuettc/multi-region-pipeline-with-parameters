import { App } from 'aws-cdk-lib';
import { PipelineStack } from '.';

const app = new App();

const pipelineName = 'MultiRegionPipeline';
const repoOwner = 'schuettc';
const repoName = 'multi-region-pipeline-with-parameters';
const repoBranch = 'main';
const connectionArn = 'arn:aws:codeconnections:sa-east-1:104621577074:connection/xxxxxxxxxxxxx';
const accountId = '104621577074';


new PipelineStack(app, 'MultiRegionPipelineStack', {
  env: {
    account: accountId,
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
