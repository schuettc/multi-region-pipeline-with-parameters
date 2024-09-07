# LLM Benchmarking: Serverless AWS Implementation

## Overview

This project implements a serverless solution for benchmarking Large Language Models (LLMs) using AWS services. It leverages AWS Batch, Step Functions, S3, Athena, and Glue to orchestrate and analyze performance tests for various LLM models across different regions.

## System Architecture

![Architecture Diagram](/images/Overview.png)

The solution consists of six main components:

1. AWS Step Functions: Orchestrates the benchmarking workflow
2. AWS Batch: Executes benchmarking jobs
3. Amazon S3: Stores benchmark results
4. AWS Glue: Defines schema for benchmark data
5. Amazon Athena: Enables SQL-based analysis of results
6. Amazon EventBridge: Schedules periodic benchmarking runs

## Implementation Details

### 1. AWS Step Functions

Orchestrates the benchmarking workflow, iterating through different model and region configurations. The state machine manages the following steps:

- Initializes the benchmarking process
- Submits AWS Batch jobs for each model and region combination
- Handles job completion and error scenarios

### 2. AWS Batch

Runs benchmarking jobs using a managed EC2 compute environment and job queue. Each job:

- Executes the `llmperf` benchmarking tool against specified Bedrock models
- Collects performance metrics and stores results in S3

### 3. Amazon S3

Stores benchmark results securely in a designated bucket, organizing data by timestamp, model, and region.

### 4. AWS Glue

Defines the schema for benchmark data using a Glue Database and Table, making it queryable by Athena. The table structure includes:

- Timestamp
- Model name
- Region
- API type (e.g., completion, embedding)
- Performance metrics (e.g., latency, throughput)

### 5. Amazon Athena

Configures a dedicated workgroup and sample queries for analyzing benchmark data. Users can perform SQL-based analysis on the collected metrics.

### 6. Amazon EventBridge

Triggers the Step Functions state machine periodically, ensuring regular benchmarking runs without manual intervention.

## Benchmarking Process

1. EventBridge rule triggers the Step Functions workflow (or manual initiation).
2. Step Functions iterates through each model and region configuration:
   a. Submits an AWS Batch job with specific parameters.
   b. Job runs `llmperf` against the specified Bedrock model.
   c. Results are stored in the S3 bucket.
3. Glue table automatically recognizes new data in S3.
4. Users query and analyze results using Athena.

## Deployment

The infrastructure is defined using AWS CDK for version-controlled, reproducible deployments. The main stack is defined in the `LLMBenchmarkingStack` class.

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Deploy the stack: `yarn launch`
4. Trigger the Step Functions state machine manually or wait for the EventBridge rule.
5. Use Athena to query and analyze results after benchmarks have run.

## Querying Benchmark Data with Athena

Use the provided sample query in Athena resources to calculate average metrics for each model, region, and API for the current hour. Example queries might include:

- Comparing latency across different models and regions
- Analyzing throughput for specific API types
- Identifying performance trends over time

## License

This project is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file for details.
