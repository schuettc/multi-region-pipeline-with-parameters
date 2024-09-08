const { awscdk } = require('projen');
const { JobPermission } = require('projen/lib/github/workflows-model');
const { UpgradeDependenciesSchedule } = require('projen/lib/javascript');
const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.118.0',
  license: 'MIT-0',
  copyrightOwner: 'Court Schuett',
  appEntrypoint: 'multi-region-pipeline.ts',
  jest: false,
  projenrcTs: true,
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['schuettc'],
  },
  autoApproveUpgrades: true,
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  defaultReleaseBranch: 'main',
  name: 'multi-region-pipeline',
  deps: [
    '@types/aws-lambda',
    '@aws-sdk/client-sns',
    '@aws-sdk/client-lambda',
    '@aws-sdk/client-cloudformation',
    'dotenv',
  ],
});

project.addTask('launch', {
  exec: 'yarn cdk deploy MultiRegionPipelineStack --require-approval never',
});

project.addTask('bootstrapRegions', {
  exec: 'ts-node bootstrapRegions.ts',
});

project.addTask('invokeRegionalLambdas', {
  exec: 'ts-node invokeRegionalLambdas.ts',
});

project.tsconfigDev.file.addOverride('include', [
  'src/**/*.ts',
  './.projenrc.ts',
  './*.ts',
]);

project.eslint.addOverride({
  files: ['src/resources/**/*.ts'],
  rules: {
    'indent': 'off',
    '@typescript-eslint/indent': 'off',
  },
});

project.eslint.addOverride({
  files: ['./*.ts', './**/*.ts'],
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
  },
});

project.eslint.addOverride({
  files: ['src/**/*.ts'],
  rules: {
    'indent': 'off',
    '@typescript-eslint/indent': 'off',
  },
});

const common_exclude = [
  'docker-compose.yaml',
  'cdk.out',
  'yarn-error.log',
  'dependabot.yml',
  '.DS_Store',
  '.env',
  '**/dist/**',
  '**/bin/**',
  '**/lib/**',
  'config.json',
];

project.gitignore.exclude(...common_exclude);

project.gitignore.include('cdk.context.json');

project.synth();
