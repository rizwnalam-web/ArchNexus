export interface FdeLifecycleStage {
  id: string;
  stageNumber: number;
  title: string;
  shortName: string;
  objective: string;
  fdeDuty: string;
  icon: string;
  colorTheme: {
    border: string;
    bg: string;
    text: string;
    glow: string;
    pillBg: string;
    pillText: string;
  };
  inputArtifacts: string[];
  outputArtifacts: string[];
  velocityMultiplier: string;
  primaryToolCategory: string;
  methodologyPhaseNumber: number;
}

export interface FdeEcosystemTool {
  id: string;
  name: string;
  lifecycleStageId: string;
  lifecycleStageName: string;
  category: 
    | 'Code Analysis & Reverse-Engineering'
    | 'Infra & Cloud Provisioning'
    | 'Testing & Synthetic Verification'
    | 'Security & Compliance'
    | 'Data & Streaming Pipelines'
    | 'Observability & SRE'
    | 'Agentic Orchestration';
  badgeColor: string;
  technicalDefinition: string;
  fdeResponsibility: string;
  keyCapabilities: string[];
  executionCommand: string;
  roiOrVelocityImpact: string;
  governanceGuardrail: string;
  methodologyPhaseNumber: number;
  sampleUseCases: string[];
}

export const FDE_LIFECYCLE_STAGES: FdeLifecycleStage[] = [
  {
    id: 'discovery_modeling',
    stageNumber: 1,
    title: 'Domain Discovery & Legacy Reverse-Engineering',
    shortName: 'Discovery & Modeling',
    objective: 'Ingest legacy monoliths, parse undocumented schemas, and synthesize Domain-Driven Design (DDD) bounded contexts.',
    fdeDuty: 'Perform automated AST parsing, semantic codebase interrogation, and extract ubiquitous language dictionary with zero legacy team overhead.',
    icon: '🧭',
    colorTheme: {
      border: 'border-blue-500/50',
      bg: 'bg-blue-950/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      pillBg: 'bg-blue-950',
      pillText: 'text-blue-300'
    },
    inputArtifacts: ['Legacy Monolith Repositories', 'Raw SQL DDL Dumps', 'COBOL/Java Jars', 'Unstructured Confluence Docs'],
    outputArtifacts: ['Bounded Context Graph (C4 DSL)', 'Ubiquitous Language Dictionary', 'Domain Event Taxonomy Schema'],
    velocityMultiplier: '4x faster legacy codebase comprehension',
    primaryToolCategory: 'Code Analysis & Reverse-Engineering',
    methodologyPhaseNumber: 1
  },
  {
    id: 'infra_provisioning',
    stageNumber: 2,
    title: 'Cloud-Native Infrastructure Provisioning & Network Topology',
    shortName: 'Infra & Topology',
    objective: 'Synthesize production-grade Infrastructure as Code (IaC) across multi-cloud, container clusters, and zero-trust service meshes.',
    fdeDuty: 'Generate immutable Terraform/Pulumi state definitions, configure VPC peering, and enforce CIS Benchmark hardening automatically.',
    icon: '☁️',
    colorTheme: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-950/20',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      pillBg: 'bg-cyan-950',
      pillText: 'text-cyan-300'
    },
    inputArtifacts: ['Target SLA/NFR Spec', 'Cloud Provider Architecture Blueprint', 'Network Security Policy'],
    outputArtifacts: ['Modular Terraform/Pulumi IaC', 'Kubernetes Helm Manifests', 'Network Security Group & IAM Matrix'],
    velocityMultiplier: '80% reduction in boilerplate IaC authoring',
    primaryToolCategory: 'Infra & Cloud Provisioning',
    methodologyPhaseNumber: 4
  },
  {
    id: 'data_streaming_pipelines',
    stageNumber: 3,
    title: 'Data Polyglot, Schema Migration & Streaming Pipelines',
    shortName: 'Data & Streaming',
    objective: 'Migrate relational legacy structures to polyglot stores (Distributed SQL, Vector DBs, Snowflake) with sub-second streaming CDC.',
    fdeDuty: 'Transpile complex SQL dialects, generate Avro/Protobuf schema registries, and construct Kafka/Debezium streaming topology.',
    icon: '⚡',
    colorTheme: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      pillBg: 'bg-amber-950',
      pillText: 'text-amber-300'
    },
    inputArtifacts: ['OLTP Schema DDL', 'Data Velocity Metrics', 'CDC Source Tables'],
    outputArtifacts: ['Polyglot Database Schemas (Drizzle/Prisma/pgvector)', 'Kafka Streaming Contracts', 'dbt Analytics Transformation DAGs'],
    velocityMultiplier: '5x speedup in schema transpilation & pipeline setup',
    primaryToolCategory: 'Data & Streaming Pipelines',
    methodologyPhaseNumber: 3
  },
  {
    id: 'code_generation_services',
    stageNumber: 4,
    title: 'Core Microservices & Event-Driven Implementation',
    shortName: 'Core Development',
    objective: 'Implement high-performance business logic, asynchronous worker loops, and contract-first gRPC/REST APIs.',
    fdeDuty: 'Rapidly scaffold production microservices following Clean Architecture, strict typing, and idempotency guarantees.',
    icon: '💻',
    colorTheme: {
      border: 'border-indigo-500/50',
      bg: 'bg-indigo-950/20',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/20',
      pillBg: 'bg-indigo-950',
      pillText: 'text-indigo-300'
    },
    inputArtifacts: ['Protobuf / OpenAPI Specifications', 'Domain Event Contracts', 'Architecture Pattern Guide'],
    outputArtifacts: ['Production Microservices Repositories', 'FastStream Kafka Workers', 'gRPC Client/Server Stubs'],
    velocityMultiplier: '3x engineering throughput for boilerplate & domain logic',
    primaryToolCategory: 'Code Analysis & Reverse-Engineering',
    methodologyPhaseNumber: 2
  },
  {
    id: 'testing_verification',
    stageNumber: 5,
    title: 'Automated Testing, Synthetic Verification & Chaos Validation',
    shortName: 'Testing & Verification',
    objective: 'Generate boundary-pushing regression suites, property-based tests, synthetic load profiles, and inject failure scenarios.',
    fdeDuty: 'Guarantee 90%+ branch coverage, fuzz complex financial/logistical boundary conditions, and verify self-healing cluster recovery.',
    icon: '🧪',
    colorTheme: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-950/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      pillBg: 'bg-emerald-950',
      pillText: 'text-emerald-300'
    },
    inputArtifacts: ['Microservice Codebase', 'API Endpoints', 'SLA Latency Budgets'],
    outputArtifacts: ['Unit/Integration Test Suites', 'Playwright Synthetic User Flows', 'Chaos Engineering Scenarios & MTTR Report'],
    velocityMultiplier: '10x test case generation with zero blind-spots',
    primaryToolCategory: 'Testing & Synthetic Verification',
    methodologyPhaseNumber: 5
  },
  {
    id: 'security_compliance',
    stageNumber: 6,
    title: 'Security Auditing, SAST & Policy as Code Governance',
    shortName: 'Security & Policy',
    objective: 'Perform continuous static code analysis, vulnerability remediation, container image vetting, and automated compliance gates.',
    fdeDuty: 'Enforce zero-trust policy checks (OPA Rego), verify cryptographic sanitization, and eliminate CVEs before pull requests merge.',
    icon: '🛡️',
    colorTheme: {
      border: 'border-rose-500/50',
      bg: 'bg-rose-950/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/20',
      pillBg: 'bg-rose-950',
      pillText: 'text-rose-300'
    },
    inputArtifacts: ['Candidate Source Code', 'Container Dockerfiles', 'Cloud IAM Configurations'],
    outputArtifacts: ['SAST Vulnerability Audit Report', 'OPA Rego Policy Gates', 'SBOM & Verified Cryptographic Signatures'],
    velocityMultiplier: 'Near-instant automated vulnerability remediation',
    primaryToolCategory: 'Security & Compliance',
    methodologyPhaseNumber: 6
  },
  {
    id: 'observability_sre',
    stageNumber: 7,
    title: 'Distributed Observability, APM & SRE Incident Triage',
    shortName: 'Observability & SRE',
    objective: 'Instrument unified OpenTelemetry spans, configure AI anomaly detection across logs/metrics, and triage production incidents.',
    fdeDuty: 'Deploy auto-instrumentation, synthesize high-cardinality debugging queries, and eliminate alert fatigue with predictive root cause analysis.',
    icon: '📊',
    colorTheme: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-950/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20',
      pillBg: 'bg-purple-950',
      pillText: 'text-purple-300'
    },
    inputArtifacts: ['Active Telemetry Feeds', 'OTel Collector DaemonSets', 'SLO Error Budgets'],
    outputArtifacts: ['Grafana/Datadog Golden Signal Dashboards', 'Synthetic APM Alert Rules', 'Automated Post-Mortem Incident Timeline'],
    velocityMultiplier: '60% faster Mean Time to Detect (MTTD) & Resolution (MTTR)',
    primaryToolCategory: 'Observability & SRE',
    methodologyPhaseNumber: 5
  },
  {
    id: 'agentic_automation',
    stageNumber: 8,
    title: 'Autonomous Multi-Agent Orchestration & Human-in-the-Loop',
    shortName: 'Agentic Workflows',
    objective: 'Deploy stateful multi-agent DAGs to automate enterprise operations (e.g. customs clearance, claims triage, dispute routing).',
    fdeDuty: 'Construct cyclic agent graphs with strict schema output validation, vector memory isolation, and audit checkpoints for manual approval.',
    icon: '🤖',
    colorTheme: {
      border: 'border-fuchsia-500/50',
      bg: 'bg-fuchsia-950/20',
      text: 'text-fuchsia-400',
      glow: 'shadow-fuchsia-500/20',
      pillBg: 'bg-fuchsia-950',
      pillText: 'text-fuchsia-300'
    },
    inputArtifacts: ['Enterprise Workflow Rules', 'Vector Embedding Datastores', 'Agent Tool APIs'],
    outputArtifacts: ['Stateful LangGraph / Semantic Kernel Pipelines', 'Evaluation Scorecards (TruLens/Ragas)', 'Audit Trail Event Logs'],
    velocityMultiplier: '95% straight-through automated operational processing',
    primaryToolCategory: 'Agentic Orchestration',
    methodologyPhaseNumber: 2
  }
];

export const FDE_ECOSYSTEM_TOOLS: FdeEcosystemTool[] = [
  // 1. CODE ANALYSIS & REVERSE-ENGINEERING
  {
    id: 'cursor-claude-35',
    name: 'Cursor IDE + Claude 3.5 Sonnet',
    lifecycleStageId: 'discovery_modeling',
    lifecycleStageName: 'Domain Discovery & Legacy Reverse-Engineering',
    category: 'Code Analysis & Reverse-Engineering',
    badgeColor: 'border-purple-600 bg-purple-950/60 text-purple-200',
    technicalDefinition: 'AI-first code engineering environment integrating deep AST semantic codebase indexing with frontier LLM reasoning for real-time refactoring, architectural synthesis, and multi-file editing.',
    fdeResponsibility: 'Directly parse 100k+ line legacy monoliths, extract hidden business logic rules, transpile deprecated protocols (e.g., EDIFACT to JSON), and author complex domain models.',
    keyCapabilities: [
      'Whole-repository indexing with local vector embedding caches',
      'Multi-file architectural transformations and cross-module refactors',
      'Complex legacy dialect deciphering (COBOL, PL/SQL, legacy Java)',
      'Sub-second context assembly over enterprise repositories'
    ],
    executionCommand: 'cursor --install-extension anthropics.claude-code && cursor .',
    roiOrVelocityImpact: '3.5x faster onboarding onto undocumented legacy client codebases',
    governanceGuardrail: 'Zero data retention enterprise agreement; all local codebase context stripped of customer PII before inference.',
    methodologyPhaseNumber: 1,
    sampleUseCases: ['Extracting logistics rules from 15-year old monolithic warehouse software', 'Refactoring legacy billing calculators into clean TypeScript domain aggregates']
  },
  {
    id: 'sourcegraph-cody',
    name: 'Sourcegraph Cody Enterprise',
    lifecycleStageId: 'discovery_modeling',
    lifecycleStageName: 'Domain Discovery & Legacy Reverse-Engineering',
    category: 'Code Analysis & Reverse-Engineering',
    badgeColor: 'border-indigo-600 bg-indigo-950/60 text-indigo-200',
    technicalDefinition: 'Enterprise code intelligence platform maintaining a semantic code graph across thousands of multi-repo organization dependencies, enabling context-aware Q&A and cross-repo architectural mapping.',
    fdeResponsibility: 'Query massive polyglot enterprise code estates to map data flow, track dependencies across microservices, and detect monolithic boundary leaks.',
    keyCapabilities: [
      'Multi-repository semantic code graph traversing cross-service API boundaries',
      'Codebase-wide semantic search with hybrid lexical and neural ranking',
      'Automated architectural documentation generation from live ASTs',
      'Role-based access control (RBAC) synchronized with GitHub/GitLab permissions'
    ],
    executionCommand: 'cody context:build --include-repos="enterprise-core/*" --max-tokens=128000',
    roiOrVelocityImpact: 'Reduces cross-team architectural discovery from weeks to 2 hours',
    governanceGuardrail: 'Air-gapped on-premises deployment mode with VPC network isolation.',
    methodologyPhaseNumber: 1,
    sampleUseCases: ['Tracing high-frequency order dispatch events across 42 separate microservice repositories', 'Auditing legacy authentication calls across all enterprise services']
  },
  {
    id: 'sqlglot-ai',
    name: 'sqlglot + Claude 3.5 Transpiler',
    lifecycleStageId: 'data_streaming_pipelines',
    lifecycleStageName: 'Data Polyglot, Schema Migration & Streaming Pipelines',
    category: 'Data & Streaming Pipelines',
    badgeColor: 'border-amber-600 bg-amber-950/60 text-amber-200',
    technicalDefinition: 'Pure Python SQL parser and transpiler coupled with reasoning LLMs to parse, optimize, and translate SQL queries, stored procedures, and DDL across 20+ database dialects.',
    fdeResponsibility: 'Transpile legacy Oracle/SQL Server stored procedures into modern PostgreSQL, Snowflake, and ClickHouse dialects while validating mathematical equivalence.',
    keyCapabilities: [
      'Dialect AST parsing with formal syntactic transformation passes',
      'LLM semantic translation of complex procedural logic and exception handlers',
      'Automated conversion of legacy proprietary locks into optimistic concurrency tokens',
      'Zero-data-loss table partitioning and index translation'
    ],
    executionCommand: 'python3 -m sqlglot.transpile "SELECT * FROM legacy_erp" --read oracle --write postgres',
    roiOrVelocityImpact: '90% automation in database migration and stored procedure rewrites',
    governanceGuardrail: 'Deterministic AST verification run before and after LLM code refactoring.',
    methodologyPhaseNumber: 3,
    sampleUseCases: ['Migrating 450 legacy Oracle PL/SQL financial procedures to modern PostgreSQL plpgsql', 'Transpiling batch data analytics queries to Snowflake dimensional views']
  },

  // 2. INFRASTRUCTURE PROVISIONING & CLOUD
  {
    id: 'pulumi-ai',
    name: 'Pulumi AI Cloud Synthesizer',
    lifecycleStageId: 'infra_provisioning',
    lifecycleStageName: 'Cloud-Native Infrastructure Provisioning & Network Topology',
    category: 'Infra & Cloud Provisioning',
    badgeColor: 'border-cyan-600 bg-cyan-950/60 text-cyan-200',
    technicalDefinition: 'Generative infrastructure as code engine that translates conversational architectural specifications into typed TypeScript/Go/Python infrastructure programs with built-in policy enforcement.',
    fdeResponsibility: 'Provision entire enterprise topologies (AWS EKS, GCP GKE, Azure AKS, VPC Peering, Kafka clusters) in typed, tested infrastructure code with 100% reproducible state.',
    keyCapabilities: [
      'Natural-language to typed TypeScript/Python cloud topology synthesis',
      'CrossGuard policy-as-code guardrails automatically woven into generated modules',
      'Direct integration with cloud provider APIs without intermediate HCL parsing',
      'Built-in preview and drift detection prior to cloud execution'
    ],
    executionCommand: 'pulumi new aws-typescript --ai "Create HA EKS cluster with Istio mesh, Karpenter, and KMS encryption"',
    roiOrVelocityImpact: 'Deploys multi-region cloud infrastructure in 1 day instead of 2 weeks',
    governanceGuardrail: 'Mandatory Pulumi Preview step with required manual approval on destructive updates.',
    methodologyPhaseNumber: 4,
    sampleUseCases: ['Scaffolding production AWS EKS clusters with Karpenter auto-scaling and Cilium CNI', 'Spinning up multi-region Azure Cosmos DB and Event Hubs with private endpoints']
  },
  {
    id: 'k8sgpt-operator',
    name: 'K8sGPT Enterprise Operator',
    lifecycleStageId: 'infra_provisioning',
    lifecycleStageName: 'Cloud-Native Infrastructure Provisioning & Network Topology',
    category: 'Infra & Cloud Provisioning',
    badgeColor: 'border-teal-600 bg-teal-950/60 text-teal-200',
    technicalDefinition: 'Kubernetes-native SRE intelligence tool that scans cluster resources, diagnoses anomalies, analyzes crash logs, and synthesizes root-cause triage using domain-tuned AI models.',
    fdeResponsibility: 'Audit deployed enterprise Kubernetes clusters, validate NetworkPolicies, catch CrashLoopBackOff causes, and optimize pod resource requests.',
    keyCapabilities: [
      'In-cluster operator scanning pods, services, ingress, and PV/PVC manifests',
      'Contextual diagnosis of OOMKilled, ImagePullBackOff, and TLS certificate expiry',
      'Automated integration with Prometheus and OpenTelemetry alert feeds',
      'Local model backend (Ollama/vLLM) support for strict air-gapped defense enclaves'
    ],
    executionCommand: 'k8sgpt analyze --explain --backend openai --output json | jq .results',
    roiOrVelocityImpact: 'Resolves 75% of Kubernetes deployment errors during greenfield bring-up',
    governanceGuardrail: 'Read-only cluster RBAC permissions; no automated state mutation without git-reviewed PR.',
    methodologyPhaseNumber: 4,
    sampleUseCases: ['Diagnosing Istio Envoy proxy sidecar injection failures in zero-trust banking VPC', 'Validating persistent volume claims and storage class bindings across multi-zone Kubernetes nodes']
  },
  {
    id: 'localstack-ai',
    name: 'LocalStack AI Cloud Emulator',
    lifecycleStageId: 'infra_provisioning',
    lifecycleStageName: 'Cloud-Native Infrastructure Provisioning & Network Topology',
    category: 'Infra & Cloud Provisioning',
    badgeColor: 'border-sky-600 bg-sky-950/60 text-sky-200',
    technicalDefinition: 'Fully functional local cloud stack emulator that provides comprehensive mock AWS/Azure APIs on developer workstations with AI-driven pre-flight validation and state snapshotting.',
    fdeResponsibility: 'Validate complex IaC templates, test serverless event loops, and verify IAM roles offline before spending cloud budget or touching client production accounts.',
    keyCapabilities: [
      'Local simulation of 80+ AWS services (SQS, SNS, S3, DynamoDB, Lambda, ECS)',
      'Deterministic ephemeral environment creation for integration test harnesses',
      'Cloud state snapshot save/restore for immediate reproducing of failure conditions',
      'Pre-flight policy simulation to catch permission errors before AWS deployment'
    ],
    executionCommand: 'localstack start -d && awslocal s3 mb s3://enterprise-telemetry-bucket',
    roiOrVelocityImpact: 'Eliminates 90% of cloud dev expenses and deployment feedback delays',
    governanceGuardrail: 'Guarantees zero client data leaves the local development machine during staging tests.',
    methodologyPhaseNumber: 4,
    sampleUseCases: ['Simulating S3 bucket event notifications triggering Lambda microservices', 'Offline testing of KMS envelope encryption before deployment to live AWS accounts']
  },

  // 3. TESTING, SYNTHETIC VERIFICATION & CHAOS
  {
    id: 'qodo-gen-codium',
    name: 'Qodo Gen (formerly CodiumAI)',
    lifecycleStageId: 'testing_verification',
    lifecycleStageName: 'Automated Testing, Synthetic Verification & Chaos Validation',
    category: 'Testing & Synthetic Verification',
    badgeColor: 'border-emerald-600 bg-emerald-950/60 text-emerald-200',
    technicalDefinition: 'Test integrity and code logic verification platform that analyzes non-trivial execution branches, generates comprehensive unit/integration test suites, and flags regressions.',
    fdeResponsibility: 'Generate mathematically exhaustive test suites for core business rules (pricing engines, routing heuristics, order settlement) with focus on boundary edge cases.',
    keyCapabilities: [
      'Dynamic behavior analysis proposing boundary edge cases humans overlook',
      'Full test suite generation for Jest, Vitest, pytest, JUnit, and Go test',
      'Continuous PR test-integrity verification preventing coverage regressions',
      'Mock synthesis for external services with realistic domain fixtures'
    ],
    executionCommand: 'qodo test --source-file="src/services/freightSettlementEngine.ts" --framework=vitest',
    roiOrVelocityImpact: 'Triples production test coverage within 48 hours of service scaffolding',
    governanceGuardrail: 'Generated tests must pass in isolated CI containers without network dependencies.',
    methodologyPhaseNumber: 5,
    sampleUseCases: ['Synthesizing 60+ edge cases for international tariff calculations and currency conversions', 'Generating mock Kafka stream consumer tests with out-of-order event delivery']
  },
  {
    id: 'diffblue-cover',
    name: 'Diffblue Cover Autonomous Test Suite',
    lifecycleStageId: 'testing_verification',
    lifecycleStageName: 'Automated Testing, Synthetic Verification & Chaos Validation',
    category: 'Testing & Synthetic Verification',
    badgeColor: 'border-green-600 bg-green-950/60 text-green-200',
    technicalDefinition: 'Reinforcement learning based autonomous test writing software for enterprise Java/Spring microservices that produces human-readable, deterministic regression unit tests without hallucinations.',
    fdeResponsibility: 'Backfill 100% unit test coverage for legacy enterprise Spring Boot codebases before beginning microservice refactoring or cloud migration.',
    keyCapabilities: [
      'Reinforcement learning engine searching execution paths without hallucination risk',
      'Generates 100% compilable, readable JUnit tests matching existing codebase conventions',
      'Automatic mocking of Spring Data repositories, JPA entities, and REST templates',
      'Continuous regression updating on every Git commit'
    ],
    executionCommand: 'dcover create --working-directory="legacy-core-banking/"',
    roiOrVelocityImpact: 'Writes 10,000 unit tests in 4 hours, replacing 6 months of manual QA work',
    governanceGuardrail: 'Deterministic test assertions proven through JVM symbolic execution.',
    methodologyPhaseNumber: 5,
    sampleUseCases: ['Generating 8,000 unit tests across legacy Java core banking service before microservice split', 'Locking down regression boundaries for enterprise supply chain inventory ledger']
  },
  {
    id: 'gremlin-ai-chaos',
    name: 'Gremlin AI Chaos Resilience Engine',
    lifecycleStageId: 'testing_verification',
    lifecycleStageName: 'Automated Testing, Synthetic Verification & Chaos Validation',
    category: 'Testing & Synthetic Verification',
    badgeColor: 'border-lime-600 bg-lime-950/60 text-lime-200',
    technicalDefinition: 'Enterprise reliability testing platform that simulates real-world infrastructure failures, network latency spikes, packet loss, and CPU hogs with automated blast radius containment.',
    fdeResponsibility: 'Subject microservice clusters to controlled chaos experiments to prove zero-downtime failover, verify circuit breakers (Polly/Resilience4j), and measure MTTR.',
    keyCapabilities: [
      'Automated blast-radius containment with immediate dead-man switch halt',
      'Network latency, blackhole, DNS failure, and clock drift injection',
      'Evaluation of Kubernetes pod disruption budgets and cluster autoscalers',
      'Reliability scorecards benchmarked against DORA and enterprise SLAs'
    ],
    executionCommand: 'gremlin attack latency --length 60 --delay 300 --ip 10.0.4.12',
    roiOrVelocityImpact: 'Proves 99.99% SLA availability and avoids $500k+ unplanned outages',
    governanceGuardrail: 'Executed only in staging with mandatory automated halt triggers on SLA breach.',
    methodologyPhaseNumber: 5,
    sampleUseCases: ['Injecting 200ms latency on Redis cache to test read-through fallback to CockroachDB', 'Simulating AWS Availability Zone outage to verify cross-region Kafka replica election']
  },

  // 4. SECURITY SCANNING & COMPLIANCE
  {
    id: 'snyk-deepcode',
    name: 'Snyk DeepCode AI Security Engine',
    lifecycleStageId: 'security_compliance',
    lifecycleStageName: 'Security Auditing, SAST & Policy as Code Governance',
    category: 'Security & Compliance',
    badgeColor: 'border-rose-600 bg-rose-950/60 text-rose-200',
    technicalDefinition: 'Hybrid AI SAST security platform combining symbolic logic solvers with machine learning models to detect complex semantic vulnerabilities, injection flaws, and authorization bypasses with zero false positives.',
    fdeResponsibility: 'Audit full application source code, scan container base images, discover open-source license violations, and generate automated pull requests with context-aware fixes.',
    keyCapabilities: [
      'Fast semantic taint analysis detecting multi-hop SQL injection and SSRF',
      'Automated fix generation that compiles and passes existing unit tests',
      'Software Bill of Materials (SBOM) generation complying with US Executive Order 14028',
      'Continuous IDE and CI/CD pull request gatekeeper'
    ],
    executionCommand: 'snyk code test --severity-threshold=high --json > snyk-report.json',
    roiOrVelocityImpact: 'Eliminates 92% of critical security vulnerabilities prior to staging deployment',
    governanceGuardrail: 'Mandatory CI build failure on any unmitigated High or Critical CWE vulnerability.',
    methodologyPhaseNumber: 6,
    sampleUseCases: ['Catching JWT token bypass vulnerability in newly written gRPC interceptor', 'Auditing npm/pip/Maven dependency tree against known CVE zero-days']
  },
  {
    id: 'opa-rego-ai',
    name: 'Open Policy Agent (OPA) + Styra AI',
    lifecycleStageId: 'security_compliance',
    lifecycleStageName: 'Security Auditing, SAST & Policy as Code Governance',
    category: 'Security & Compliance',
    badgeColor: 'border-red-600 bg-red-950/60 text-red-200',
    technicalDefinition: 'Open-source, general-purpose policy engine that enables unified, context-aware policy enforcement across Kubernetes admission control, microservice API authorization, and cloud infrastructure.',
    fdeResponsibility: 'Write and enforce deterministic Rego policies controlling which Docker images can execute, which user roles can access sensitive endpoints, and validating data residency.',
    keyCapabilities: [
      'Declarative Rego policy evaluation decoupled from application business logic',
      'Sub-millisecond policy evaluation suitable for high-throughput API gateways',
      'Kubernetes Gatekeeper admission control integration',
      'Comprehensive audit logging of every policy allow/deny decision'
    ],
    executionCommand: 'opa eval --data policies/security.rego --input payload.json "data.enterprise.authz.allow"',
    roiOrVelocityImpact: 'Standardizes authorization policies across 100% of enterprise microservices',
    governanceGuardrail: 'Fail-closed architecture: default deny on all unevaluated API routes and clusters.',
    methodologyPhaseNumber: 6,
    sampleUseCases: ['Enforcing that no container runs as root across any enterprise Kubernetes namespace', 'Validating that EU citizen logistics records cannot be written to US-East S3 buckets']
  },

  // 5. OBSERVABILITY & SRE
  {
    id: 'datadog-watchdog',
    name: 'Datadog Watchdog AI & APM',
    lifecycleStageId: 'observability_sre',
    lifecycleStageName: 'Distributed Observability, APM & SRE Incident Triage',
    category: 'Observability & SRE',
    badgeColor: 'border-purple-600 bg-purple-950/60 text-purple-200',
    technicalDefinition: 'Algorithmic observability engine embedded in enterprise APM that automatically discovers abnormal latency distributions, error rate spikes, and memory leaks across distributed microservices.',
    fdeResponsibility: 'Configure continuous tracing across gRPC and HTTP services, establish SLI/SLO error budgets, and configure automated root-cause detection for zero-touch SRE triage.',
    keyCapabilities: [
      'Automated baseline calculation and seasonal trend outlier detection',
      'Correlated distributed tracing across tens of microservices',
      'Database query performance profiling and slow-query regression alerts',
      'Automated anomaly timeline synthesis during incident post-mortems'
    ],
    executionCommand: 'dd-trace-run node dist/server.js --env=production --service=logistics-dispatch',
    roiOrVelocityImpact: 'Cuts production Mean Time to Detect (MTTD) from 45 minutes to 30 seconds',
    governanceGuardrail: 'Automatic obfuscation of customer PII, credit card numbers, and auth tokens in traces.',
    methodologyPhaseNumber: 5,
    sampleUseCases: ['Detecting thread pool starvation in payment gateway 10 minutes before customer timeout', 'Isolating an unindexed database query degrading checkout latency during flash sale']
  },
  {
    id: 'honeycomb-ai-query',
    name: 'Honeycomb AI Query Assistant',
    lifecycleStageId: 'observability_sre',
    lifecycleStageName: 'Distributed Observability, APM & SRE Incident Triage',
    category: 'Observability & SRE',
    badgeColor: 'border-fuchsia-600 bg-fuchsia-950/60 text-fuchsia-200',
    technicalDefinition: 'High-cardinality observability platform featuring an AI query assistant that translates natural-language incident questions into complex BubbleUp queries across millions of distributed events.',
    fdeResponsibility: 'Investigate elusive "needle-in-a-haystack" production bugs affecting single tenants or specific regions by querying high-cardinality telemetry datasets.',
    keyCapabilities: [
      'High-cardinality tracing supporting billions of unique customer/order IDs',
      'BubbleUp analysis highlighting outliers between baseline and anomalous requests',
      'Natural-language query generation for OpenTelemetry spans and metrics',
      'Direct correlation between frontend user sessions and backend microservice spans'
    ],
    executionCommand: 'honeycomb query --query-ai="Why did tenant_id=492 experience 504 gateway timeouts at 14:00?"',
    roiOrVelocityImpact: 'Resolves complex multi-tenant production issues in minutes instead of days',
    governanceGuardrail: 'Sampled retention pipelines to prevent unbounded cloud storage costs.',
    methodologyPhaseNumber: 5,
    sampleUseCases: ['Pinpointing a misconfigured regional DNS proxy causing packet drops for Singapore users', 'Correlating mobile client app versions with server 500 error spikes in staging']
  },

  // 6. AGENTIC ORCHESTRATION & HUMAN-IN-THE-LOOP
  {
    id: 'langgraph-engine',
    name: 'LangGraph Cyclic Agent Orchestrator',
    lifecycleStageId: 'agentic_automation',
    lifecycleStageName: 'Autonomous Multi-Agent Orchestration & Human-in-the-Loop',
    category: 'Agentic Orchestration',
    badgeColor: 'border-fuchsia-600 bg-fuchsia-950/60 text-fuchsia-200',
    technicalDefinition: 'Stateful, cyclic multi-agent workflow orchestration framework supporting persistent checkpointing, human-in-the-loop review nodes, and deterministic conditional routing.',
    fdeResponsibility: 'Build autonomous enterprise agents capable of iterative problem solving (e.g., automated customs classification, invoice reconciliation) with strict fail-safes and manual review gates.',
    keyCapabilities: [
      'Cyclic graph topologies with durable state persistence and recovery',
      'Built-in human-in-the-loop approval nodes that pause execution for human sign-off',
      'Deterministic schema output validation preventing hallucinated API payloads',
      'Full state time-travel debugging and replay capability'
    ],
    executionCommand: 'python3 -m langgraph.server --port 8000 --config langgraph.json',
    roiOrVelocityImpact: '95% straight-through automated document processing with 100% auditability',
    governanceGuardrail: 'Mandatory human approval checkpoint on any action with financial impact exceeding $10,000.',
    methodologyPhaseNumber: 2,
    sampleUseCases: ['Autonomous Harmonized Tariff Code assignment with human customs broker sign-off', 'Multi-agent freight claim resolution validating bills of lading and insurance policies']
  },
  {
    id: 'semantic-kernel',
    name: 'Microsoft Semantic Kernel Enterprise',
    lifecycleStageId: 'agentic_automation',
    lifecycleStageName: 'Autonomous Multi-Agent Orchestration & Human-in-the-Loop',
    category: 'Agentic Orchestration',
    badgeColor: 'border-blue-600 bg-blue-950/60 text-blue-200',
    technicalDefinition: 'Enterprise SDK for integrating frontier LLMs into C#/.NET and Python applications with native dependency injection, telemetry, vector memory connectors, and plugin architectures.',
    fdeResponsibility: 'Integrate AI reasoning natively into enterprise .NET Core microservices, connecting to Microsoft Entra ID, Azure OpenAI, and SAP ERP connectors.',
    keyCapabilities: [
      'Native C#/.NET and Python integration with enterprise dependency injection',
      'Pluggable memory stores with Azure AI Search, Qdrant, and pgvector',
      'Automatic function calling and plan generation with strict type safety',
      'Enterprise logging and telemetry via Microsoft Application Insights'
    ],
    executionCommand: 'dotnet add package Microsoft.SemanticKernel --version 1.30.0',
    roiOrVelocityImpact: 'Enables native AI agent execution within legacy enterprise .NET frameworks',
    governanceGuardrail: 'Role-based access control (RBAC) enforced via Microsoft Entra ID tokens on every tool invocation.',
    methodologyPhaseNumber: 2,
    sampleUseCases: ['Scaffolding an automated ERP procurement agent in C# connecting directly to SAP HANA', 'Real-time semantic chat assistant over confidential internal enterprise policy documents']
  }
];

export const TOOL_CATEGORIES = [
  'All Tools',
  'Code Analysis & Reverse-Engineering',
  'Infra & Cloud Provisioning',
  'Testing & Synthetic Verification',
  'Security & Compliance',
  'Data & Streaming Pipelines',
  'Observability & SRE',
  'Agentic Orchestration'
] as const;
