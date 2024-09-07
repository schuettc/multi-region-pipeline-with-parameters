import { Stage, Stack, StackProps, StageProps } from 'aws-cdk-lib';
import {
  Role,
  AccountPrincipal,
  CompositePrincipal,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { getAllRegions } from './config/regions';
import { DataStack } from './dataStack';
import { RegionStack } from './regionStacks';

interface PipelineStackProps extends StackProps {
  pipelineConfig: {
    pipelineName: string;
    repoOwner: string;
    repoName: string;
    repoBranch: string;
    connectionArn: string;
  };
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const pipelineRole = new Role(this, 'PipelineRole', {
      assumedBy: new CompositePrincipal(
        new AccountPrincipal(this.account),
        new ServicePrincipal('codepipeline.amazonaws.com'),
      ),
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      role: pipelineRole,
      pipelineName: props.pipelineConfig.pipelineName,
      crossAccountKeys: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          `${props.pipelineConfig.repoOwner}/${props.pipelineConfig.repoName}`,
          props.pipelineConfig.repoBranch,
          {
            connectionArn: props.pipelineConfig.connectionArn,
          },
        ),
        commands: [
          'yarn install --frozen-lockfile',
          'yarn build',
          'npx cdk synth',
        ],
      }),
    });

    const dataStage = new DataStage(this, 'DataStage', {
      env: { account: this.account, region: 'us-east-1' },
    });
    pipeline.addStage(dataStage);

    const regionalWave = pipeline.addWave('RegionalDeployments');

    getAllRegions().forEach((region) => {
      const regionalStage = new RegionalStage(this, `RegionalStage-${region}`, {
        env: { account: this.account, region },
      });
      regionalWave.addStage(regionalStage);
    });
  }
}

class DataStage extends Stage {
  public readonly dataStack: DataStack;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    this.dataStack = new DataStack(
      this,
      'DataStack',
      {
        env: { account: this.account, region: 'us-east-1' },
      },
    );
  }
}

interface RegionalStageProps extends StageProps {}

class RegionalStage extends Stage {
  constructor(scope: Construct, id: string, props: RegionalStageProps) {
    super(scope, id, props);

    new RegionStack(this, 'RegionStack', {
      env: props.env,
    });
  }
}
