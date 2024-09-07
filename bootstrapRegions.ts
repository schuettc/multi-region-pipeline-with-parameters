import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { getAllRegions } from './src/config/regions';

// Load environment variables from .env file
dotenv.config();

const account = process.env.CDK_DEFAULT_ACCOUNT;
if (!account) {
  console.error('CDK_DEFAULT_ACCOUNT environment variable is not set');
  process.exit(1);
}

const regions = getAllRegions();

console.log('Bootstrapping the following regions:', regions.join(', '));

regions.forEach((region) => {
  console.log(`Bootstrapping region: ${region}`);
  try {
    execSync(`cdk bootstrap aws://${account}/${region}`, {
      stdio: 'inherit',
      env: { ...process.env, CDK_NEW_BOOTSTRAP: '1' },
    });
    console.log(`Successfully bootstrapped ${region}`);
  } catch (error) {
    console.error(`Failed to bootstrap ${region}:`, error);
  }
});

console.log('Bootstrapping complete');