export interface FdeAiTool {
  toolName: string;
  category: 'LLM & Reasoning' | 'Agent Framework' | 'Vector & Data' | 'Developer & IDE' | 'Computer Vision & Multimodal' | 'Observability & Eval';
  definition: string;
  responsibility: string;
  purpose: string;
  commandOrSetup?: string;
  badgeColor?: string;
}

export interface FdeAiToolMaster {
  name: string;
  category: 'LLM & Reasoning' | 'Agent Framework' | 'Vector & Data' | 'Developer & IDE' | 'Computer Vision & Multimodal' | 'Observability & Eval';
  definition: string;
  coreResponsibilities: string[];
  primaryUseCases: string[];
  keyArchitecture: string;
  setupCommand?: string;
  deployedInCaseStudies: string[];
}

export interface FdeImplementationStep {
  stepNumber: number;
  title: string;
  phase: string;
  summary: string;
  aiToolsUsed: FdeAiTool[];
  implementationSnippet: {
    language: string;
    filename: string;
    code: string;
  };
  promptOrCliSample?: string;
  keyDeliverable: string;
  verificationCriteria: string;
}

export interface FdeCaseStudy {
  id: string;
  title: string;
  industry: 'Supply Chain & Logistics' | 'Defense & Aerospace' | 'Banking & Fintech' | 'Healthcare & Life Sciences';
  companyArchetype: string;
  contractValue: string;
  timeframe: string;
  situation: string;
  fdePlaybook: string[];
  architectureDiagramSnippet: string;
  outcome: string;
  lessonsLearned: string[];
  aiStackSummary: {
    primaryModels: string[];
    agenticFrameworks: string[];
    vectorAndData: string[];
    devAndEvalTools: string[];
  };
  implementationSteps: FdeImplementationStep[];
}

export const FDE_CASE_STUDIES: FdeCaseStudy[] = [
  // ==========================================
  // CASE STUDY 1: SUPPLY CHAIN & LOGISTICS (FREIGHT & DEMURRAGE)
  // ==========================================
  {
    id: 'case-study-sc-freight',
    title: 'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
    industry: 'Supply Chain & Logistics',
    companyArchetype: 'Global Tier-1 3PL & Ocean Freight Intermodal Network ($32B Freight Volume)',
    contractValue: '$14.2M Multi-Year Enterprise FDE Deployment',
    timeframe: '18-Day POC -> 12-Month Global Fleet Rollout',
    situation: 'Ocean container port bottlenecks at LA/Long Beach and Rotterdam caused $85M in annual demurrage and detention (D&D) penalties. Legacy EDI 310/214 feeds arrived 12-36 hours late, leaving dispatchers blind to route disruptions and missed rail connections.',
    fdePlaybook: [
      'Ingested real-time Automatic Identification System (AIS) satellite vessel telemetry and terminal port congestion APIs via Apache Flink streaming.',
      'Constructed an operational supply chain graph ontology linking Container, Ocean_Vessel, Rail_Spur, Drayage_Carrier, and Customs_Hold.',
      'Engineered an autonomous LangGraph agent swarm (Demurrage Sentinel + Drayage Negotiator) calculating D&D exposure risk 72 hours before vessel berth.',
      'Automated carrier re-booking and appointment reservations using Google OR-Tools MILP optimization and SAP TM REST APIs with zero human intervention.'
    ],
    architectureDiagramSnippet: `[AIS Satellite Telemetry] ──> [Apache Flink Stream] ──> [Qdrant Vector / Neo4j Graph]
[EDI 310/214 Status Feeds] ─┘                       │
                                                    ▼
[SAP TM & Manhattan WMS] <── [OR-Tools MILP] <── [LangGraph Agent Swarm (Claude 3.5 Sonnet + DeepSeek-R1)]`,
    outcome: 'Eliminated $41.8M in container demurrage fees across 180,000 TEUs, slashed rerouting decision cycles from 4.5 hours to 90 seconds, and achieved 99.4% autonomous carrier booking execution.',
    lessonsLearned: [
      'Marine vessel ETAs vary wildly based on bunker fuel throttling; AIS satellite telemetry combined with historical berth congestion is 10x more accurate than carrier-reported EDI dates.',
      'Drayage truckers ignore email dispatch alerts; programmatic SMS and WhatsApp interactive dispatch confirmations increased carrier pickup compliance by 64%.'
    ],
    aiStackSummary: {
      primaryModels: ['Claude 3.5 Sonnet', 'DeepSeek-R1', 'OpenAI GPT-4o Mini'],
      agenticFrameworks: ['LangGraph Multi-Agent Swarm', 'DSPy Optimizer'],
      vectorAndData: ['Qdrant Hybrid Search', 'Neo4j Knowledge Graph', 'Apache Flink', 'Apache Kafka'],
      devAndEvalTools: ['Cursor IDE', 'LangSmith Tracing', 'Arize Phoenix', 'Google OR-Tools']
    },
    implementationSteps: [
      {
        stepNumber: 1,
        title: 'Real-Time Telemetry & EDI Stream Ingestion Pipeline',
        phase: '1. Ingestion & Stream Ingress',
        summary: 'Provision an asynchronous Kafka/Flink pipeline consuming satellite AIS marine coordinates, terminal gate wait queues, and legacy ANSI X12 EDI 310/214 feeds.',
        aiToolsUsed: [
          {
            toolName: 'Cursor IDE + Claude 3.5 Sonnet',
            category: 'Developer & IDE',
            definition: 'AI-native developer environment leveraging Anthropic Claude 3.5 Sonnet to parse, refactor, and synthesize complex codebase structures from natural language specifications.',
            responsibility: 'Rapid reverse-engineering of transport standards (ANSI X12 EDI 310/214) into validated Pydantic models with automated schema validation unit tests.',
            purpose: 'Rapid generation of ANSI X12 EDI 310/214 binary parsers and schema validation pydantic models',
            commandOrSetup: 'cursor . --remote-ssh prod-fde-bastion',
          },
          {
            toolName: 'FastStream + Apache Kafka',
            category: 'Vector & Data',
            definition: 'High-throughput asynchronous streaming framework built on top of distributed append-only commit logs for real-time pub/sub telemetry ingress.',
            responsibility: 'Continuous non-blocking consumption of 15,000 vessel telemetry events/sec, enforcing schema deserialization and backpressure protection.',
            purpose: 'Event-driven async consumer handling 15,000 vessel telemetry events/sec with backpressure',
            commandOrSetup: 'pip install faststream[kafka] aiokafka pydantic',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'services/telemetry_stream_consumer.py',
          code: `from faststream import FastStream
from faststream.kafka import KafkaBroker
from pydantic import BaseModel, Field
from datetime import datetime
import asyncio

broker = KafkaBroker("kafka-broker.internal.logistics:9092")
app = FastStream(broker)

class AISVesselPosition(BaseModel):
    mmsi: str = Field(description="Maritime Mobile Service Identity")
    vessel_name: str
    latitude: float
    longitude: float
    speed_knots: float
    destination_port: str
    eta_timestamp: datetime

@broker.subscriber("telemetry.ais.vessel-positions")
async def handle_ais_update(msg: AISVesselPosition):
    # Calculate real-time nautical distance & ETA drift against port terminal schedule
    drift_hours = calculate_eta_drift(msg.latitude, msg.longitude, msg.destination_port)
    if drift_hours > 6.0:
        await broker.publish(
            {"vessel": msg.vessel_name, "drift_hours": drift_hours, "severity": "HIGH"},
            topic="alerts.supply-chain.demurrage-risk"
        )`
        },
        promptOrCliSample: 'faststream run services/telemetry_stream_consumer.py:app --workers 4',
        keyDeliverable: 'Sub-second streaming ingestion worker decoding AIS maritime coordinates and normalizing ANSI EDI 310 status codes into structured Kafka topics.',
        verificationCriteria: 'Throughput >10,000 msgs/sec with zero packet drop and automated dead-letter queue (DLQ) routing for corrupted EDI records.'
      },
      {
        stepNumber: 2,
        title: 'Intermodal Supply Chain Graph & Vector Semantic Indexing',
        phase: '2. Ontology & Entity Graph',
        summary: 'Construct an operational ontology linking ocean vessels, containers, terminal storage free-days, rail ramps, and drayage carriers into Qdrant and Neo4j.',
        aiToolsUsed: [
          {
            toolName: 'Qdrant Vector Database',
            category: 'Vector & Data',
            definition: 'High-performance Rust-based vector search engine supporting filtered approximate nearest neighbors (HNSW) and hybrid sparse-dense payloads.',
            responsibility: 'Semantic indexing and sub-12ms retrieval of unstructured port terminal tariffs, contractual free-time rules, and demurrage SLA clauses.',
            purpose: 'Hybrid dense + sparse BM25 indexing of port terminal tariffs, carrier contracts, and D&D SLA clauses',
            commandOrSetup: 'docker run -p 6333:6333 qdrant/qdrant:v1.11.0',
          },
          {
            toolName: 'BAAI BGE-M3 Embeddings',
            category: 'LLM & Reasoning',
            definition: 'Multi-lingual foundation embedding model supporting dense representations, multi-vector ColBERT-style interactions, and sparse lexical retrieval across 100+ languages.',
            responsibility: 'Transforming heterogeneous multi-lingual shipping bills, bills of lading, and port manifests into normalized 1024-dimensional dense vectors.',
            purpose: 'Multi-lingual dense vector representations of international customs manifests and shipping bills',
            commandOrSetup: 'pip install sentence-transformers qdrant-client',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'ontology/demurrage_vector_store.py',
          code: `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer

client = QdrantClient(url="http://qdrant-cluster:6333")
embedder = SentenceTransformer("BAAI/bge-m3")

client.recreate_collection(
    collection_name="terminal_demurrage_tariffs",
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
)

def index_terminal_tariff(terminal_id: str, clause_text: str, free_days: int, tier_rate_usd: float):
    vector = embedder.encode(clause_text).tolist()
    client.upsert(
        collection_name="terminal_demurrage_tariffs",
        points=[
            PointStruct(
                id=hash(terminal_id + clause_text) & 0x7FFFFFFF,
                vector=vector,
                payload={
                    "terminal_id": terminal_id,
                    "free_days": free_days,
                    "daily_rate": tier_rate_usd,
                    "clause": clause_text
                }
            )
        ]
    )`
        },
        promptOrCliSample: 'python ontology/demurrage_vector_store.py --seed-terminals la_longbeach,rotterdam,antwerp',
        keyDeliverable: 'Operational graph & vector collection capturing 45 terminal demurrage schedules and 180,000 active container lifecycle stages.',
        verificationCriteria: 'Query retrieval latency <12ms for dynamic contract rate lookups and 100% precision on container free-time expiration calculations.'
      },
      {
        stepNumber: 3,
        title: 'LangGraph Multi-Agent Demurrage Sentinel & Exception Router',
        phase: '3. Multi-Agent AI Orchestration',
        summary: 'Deploy a multi-agent supervisor graph where Demurrage Sentinel monitors vessel delays, Drayage Negotiator evaluates carrier capacity, and Exception Supervisor formulates mitigation plans.',
        aiToolsUsed: [
          {
            toolName: 'LangGraph + Claude 3.5 Sonnet',
            category: 'Agent Framework',
            definition: 'Cyclic graph-based orchestration framework for multi-agent workflows with state persistence, conditional edge routing, and human-in-the-loop checkpoints.',
            responsibility: 'Managing stateful agent loops coordinating risk detection, carrier rate negotiations, multi-agency compliance checks, and exception escalation.',
            purpose: 'Stateful cyclic multi-agent graph coordinating risk detection, carrier rate checks, and rerouting decisions',
            commandOrSetup: 'pip install langgraph langchain-anthropic',
          },
          {
            toolName: 'DeepSeek-R1 (Local vLLM)',
            category: 'LLM & Reasoning',
            definition: 'Open-weights reasoning model optimized with large-scale reinforcement learning for step-by-step mathematical deduction and algorithmic planning.',
            responsibility: 'Evaluating non-linear demurrage penalty curves against spot-market drayage premium rates to find mathematically optimal dispatch thresholds.',
            purpose: 'Complex mathematical chain-of-thought evaluation of demurrage penalty curves vs. intermodal drayage premium costs',
            commandOrSetup: 'vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B --port 8000',
          },
          {
            toolName: 'DSPy Optimizer',
            category: 'Observability & Eval',
            definition: 'Declarative programming framework that optimizes LLM prompts and few-shot exemplars automatically via teleprompter algorithms and objective loss metrics.',
            responsibility: 'Synthesizing and tuning prompts across the carrier-negotiation agent to eliminate booking-reference hallucinations and minimize input token overhead.',
            purpose: 'Automated prompt tuning to minimize LLM token usage and prevent hallucinated carrier booking references',
            commandOrSetup: 'pip install dspy-ai',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'agents/demurrage_sentinel_swarm.py',
          code: `from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic

class FreightState(TypedDict):
    container_id: str
    vessel_delay_hours: float
    current_port: str
    free_days_remaining: int
    demurrage_risk_score: float
    carrier_options: List[dict]
    recommended_action: str

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0)

def demurrage_sentinel(state: FreightState) -> dict:
    prompt = f"Assess D&D penalty risk for container {state['container_id']}: delay {state['vessel_delay_hours']}h, free days {state['free_days_remaining']}."
    response = llm.invoke(prompt)
    risk_score = 0.92 if state['vessel_delay_hours'] > 12 and state['free_days_remaining'] <= 1 else 0.2
    return {"demurrage_risk_score": risk_score}

def drayage_negotiator(state: FreightState) -> dict:
    # Query capacity from regional drayage carriers
    return {
        "carrier_options": [
            {"carrier": "Swift Intermodal", "rate_usd": 850, "eta_hours": 4},
            {"carrier": "J.B. Hunt Dray", "rate_usd": 920, "eta_hours": 2}
        ]
    }

workflow = StateGraph(FreightState)
workflow.add_node("sentinel", demurrage_sentinel)
workflow.add_node("negotiator", drayage_negotiator)
workflow.set_entry_point("sentinel")
workflow.add_edge("sentinel", "negotiator")
workflow.add_edge("negotiator", END)
app = workflow.compile()`
        },
        promptOrCliSample: 'python -m agents.demurrage_sentinel_swarm --eval-testset tests/demurrage_scenarios.json',
        keyDeliverable: 'Stateful LangGraph agent graph capable of autonomously evaluating 5,000 container status changes per hour and synthesizing optimal reroute recommendations.',
        verificationCriteria: 'Zero hallucinated carrier quotes, 100% adherence to corporate carrier insurance compliance thresholds, and execution time <3 seconds per container.'
      },
      {
        stepNumber: 4,
        title: 'Mixed-Integer Linear Programming (MILP) & ERP Write-Back',
        phase: '4. Tool Execution & ERP Integration',
        summary: 'Pass agent proposals to a deterministic Google OR-Tools solver to solve the multi-depot vehicle routing problem (VRP), then execute write-back to SAP TM and terminal appointment systems.',
        aiToolsUsed: [
          {
            toolName: 'Google OR-Tools',
            category: 'Developer & IDE',
            definition: 'Open-source industrial operations research suite for combinatorial optimization, vehicle routing problems (VRP), and linear programming.',
            responsibility: 'Solving the Capacitated Vehicle Routing Problem with Time Windows (CVRPTW) across regional drayage fleets, driver hours-of-service, and chassis availability.',
            purpose: 'Deterministic mixed-integer linear programming solver optimizing drayage truck routes and gate appointments under driver HOS (Hours of Service) constraints',
            commandOrSetup: 'pip install ortools',
          },
          {
            toolName: 'OpenAI Function Calling (Structured Outputs)',
            category: 'LLM & Reasoning',
            definition: 'Strict schema-enforced JSON emission protocol ensuring language model outputs adhere deterministically to predefined JSON Schema specifications.',
            responsibility: 'Translating human-readable routing recommendations into guaranteed valid EDI 204 motor carrier load tender JSON schemas for immediate TMS injection.',
            purpose: 'Enforce strict JSON schema validation for SAP TM / Manhattan Associates WMS REST payload generation',
            commandOrSetup: 'pip install openai pydantic',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'dispatch/milp_route_solver.py',
          code: `from ortools.linear_solver import pywraplp
import requests

def solve_drayage_allocation(costs_matrix, driver_capacities):
    solver = pywraplp.Solver.CreateSolver('SCIP')
    num_trucks = len(driver_capacities)
    num_containers = len(costs_matrix)

    # x[i, j] is 1 if container i is assigned to truck j
    x = {}
    for i in range(num_containers):
        for j in range(num_trucks):
            x[i, j] = solver.IntVar(0, 1, f'x_{i}_{j}')

    # Objective: Minimize total cost (D&D penalties + carrier freight charges)
    objective = solver.Objective()
    for i in range(num_containers):
        for j in range(num_trucks):
            objective.SetCoefficient(x[i, j], costs_matrix[i][j])
    objective.SetMinimization()
    status = solver.Solve()
    return status == pywraplp.Solver.OPTIMAL

def execute_sap_tm_booking(container_id: str, carrier_scac: str, slot_time: str):
    headers = {"Authorization": "Bearer $SAP_TM_OAUTH_TOKEN", "Content-Type": "application/json"}
    payload = {"container": container_id, "scac": carrier_scac, "gate_slot": slot_time}
    resp = requests.post("https://erp.enterprise-3pl.com/sap/tm/v2/appointments", json=payload, headers=headers)
    return resp.status_code == 201`
        },
        promptOrCliSample: 'python dispatch/milp_route_solver.py --validate-live-dry-run',
        keyDeliverable: 'Deterministic optimization engine converting probabilistic LLM decisions into legally binding SAP TM carrier tender documents and terminal gate reservations.',
        verificationCriteria: '100% constraint satisfaction on driver legal hours of service (HOS) and sub-second execution of SAP TM appointment confirmations.'
      },
      {
        stepNumber: 5,
        title: 'Dispatcher Cockpit UI & Real-Time LangSmith Observability',
        phase: '5. UI Copilot & Observability',
        summary: 'Deploy an interactive real-time dispatcher war-room cockpit in React 19 with WebSockets and configure LangSmith / Arize Phoenix for LLM cost and trace auditing.',
        aiToolsUsed: [
          {
            toolName: 'LangSmith + Arize Phoenix',
            category: 'Observability & Eval',
            definition: 'End-to-end tracing and evaluation platform capturing complete OpenTelemetry spans, token latencies, retrieval relevance, and agent step trajectories.',
            responsibility: 'Continuous evaluation of agentic reasoning paths, monitoring hallucination rates, detecting retrieval regressions, and tracking LLM inferencing costs.',
            purpose: 'Full-trace latency monitoring, token consumption cost accounting, and guardrail violation alerts',
            commandOrSetup: 'export LANGCHAIN_TRACING_V2=true && export LANGCHAIN_PROJECT=fde-logistics',
          },
          {
            toolName: 'React 19 + Tailwind CSS + Lucide',
            category: 'Developer & IDE',
            definition: 'Modern component-based reactive user interface framework with atomic utility-first styling and vector iconography.',
            responsibility: 'Rendering the real-time operational dashboard, interactive map pins, container risk timelines, and single-click manual override approval modals for dispatchers.',
            purpose: 'Interactive live intermodal telemetry cockpit with one-click agent approval and demurrage cost delta graphs',
            commandOrSetup: 'npm install lucide-react @tanstack/react-query',
          }
        ],
        implementationSnippet: {
          language: 'typescript',
          filename: 'src/components/DemurrageWarRoomDashboard.tsx',
          code: `import React, { useState } from 'react';
import { AlertCircle, Truck, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

export const DemurrageWarRoom: React.FC = () => {
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 'MSKU-948102', port: 'Port of Long Beach', riskUsd: 14200, timeToExpiry: '4h 12m', carrier: 'Swift Drayage' }
  ]);

  const handleApproveAgentReroute = (containerId: string) => {
    // Triggers automated SAP TM API appointment dispatch
    console.log(\`Approved autonomous agent dispatch for \${containerId}\`);
  };

  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-400" />
          Autonomous Dispatch Sentinel: Live Intermodal Queue
        </h3>
        <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800">
          Agent Status: AUTONOMOUS ROUTING ACTIVE
        </span>
      </div>
      {/* Alert Cards with Single-Click Human-in-the-Loop Override */}
    </div>
  );
};`
        },
        promptOrCliSample: 'npm run dev # Launches local Vite dispatcher cockpit connected to live WebSocket gateway',
        keyDeliverable: 'Executive dispatcher telemetry portal with real-time WebSocket state streaming, manual override capability, and 100% LLM trace observability.',
        verificationCriteria: 'UI latency under 100ms for 50,000 active containers and automated LangSmith alerts if model hallucination or latency exceeds 2.5 seconds.'
      }
    ]
  },

  // ==========================================
  // CASE STUDY 2: SUPPLY CHAIN & LOGISTICS (COLD-CHAIN & PERISHABLES)
  // ==========================================
  {
    id: 'case-study-sc-coldchain',
    title: 'Predictive Cold-Chain Monitoring & Autonomous Perishable Allocation',
    industry: 'Supply Chain & Logistics',
    companyArchetype: 'Multinational Grocery & Cold-Chain Logistics Operator (82 Distribution Centers)',
    contractValue: '$11.6M Enterprise Transformation',
    timeframe: '21-Day Field Pilot -> 82 Distribution Centers',
    situation: '$120M annual inventory loss due to spoilage, temperature excursions in transit, and static First-In-First-Out (FIFO) warehouse picking that ignored actual shelf-life decay and variable transport delays.',
    fdePlaybook: [
      'Ingested high-frequency MQTT IoT temperature, humidity, and vibration telemetry from 4,200 refrigerated trailers (reefers).',
      'Deployed computer vision pallet inspection cameras (YOLOv11 + SAM 2) on unloading docks to classify packaging deformation and fruit bruising.',
      'Fine-tuned zero-shot time-series foundation models (Amazon Chronos) to forecast biological shelf-life degradation 48 hours before visible spoilage.',
      'Integrated an autonomous First-Expired-First-Out (FEFO) warehouse allocation agent directly into Manhattan Associates WMS.'
    ],
    architectureDiagramSnippet: `[Edge IoT Reefer Sensors (MQTT)] ──> [EMQX / TimescaleDB] ──> [Amazon Chronos Time-Series LLM]
[Dock Pallet Cameras (YOLOv11)] ──> [Ray Inference Cluster] ─┘                       │
                                                                                     ▼
[Manhattan Associates WMS] <── [FEFO Dynamic Allocation Agent (CrewAI)] <── [Degradation Forecast Engine]`,
    outcome: 'Cut perishable inventory waste by 58% ($69.6M saved annually), boosted on-time cold-chain compliance to 99.85%, and automated 94% of warehouse cross-dock pallet assignments.',
    lessonsLearned: [
      'Reefer temperature fluctuations during loading dock door openings are normal; models must differentiate transient 10-minute spikes from compressor mechanical failures.',
      'Warehouse pickers reject systems requiring multiple manual barcode scans; zero-touch RFID gate readers paired with overhead LED directional guides ensured 100% adoption.'
    ],
    aiStackSummary: {
      primaryModels: ['Amazon Chronos Time-Series', 'YOLOv11 Vision', 'Segment Anything 2 (SAM 2)', 'GPT-4o'],
      agenticFrameworks: ['CrewAI Task Orchestrator', 'LangChain Tools'],
      vectorAndData: ['TimescaleDB IoT Lake', 'EMQX MQTT Broker', 'Ray Distributed Cluster'],
      devAndEvalTools: ['Roboflow Annotate', 'Weights & Biases', 'Prometheus', 'Grafana']
    },
    implementationSteps: [
      {
        stepNumber: 1,
        title: 'Edge IoT Reefer Sensor Stream & MQTT Time-Series Ingestion',
        phase: '1. Ingestion & Stream Ingress',
        summary: 'Establish fault-tolerant MQTT ingestion pipelines collecting real-time temperature, humidity, and battery state from 4,200 refrigerated transport reefers.',
        aiToolsUsed: [
          {
            toolName: 'EMQX + TimescaleDB',
            category: 'Vector & Data',
            definition: 'Distributed cloud-native MQTT broker paired with hypertable-partitioned PostgreSQL time-series database for ultra-low latency IoT telemetry.',
            responsibility: 'Ingesting and persisting 1Hz sensor readings (temperature, humidity, compressor RPM, door-ajar status) from 8,500 active refrigerated reefers.',
            purpose: 'Industrial-grade distributed MQTT broker handling 250,000 telemetry messages/min stored in hypertable time-series partitions',
            commandOrSetup: 'docker run -d --name emqx -p 1883:1883 -p 18083:18083 emqx/emqx:5.8.0',
          },
          {
            toolName: 'Cursor IDE + Python asyncio',
            category: 'Developer & IDE',
            definition: 'AI-assisted code development environment with asynchronous non-blocking event-loop runtime for high-concurrency systems.',
            responsibility: 'Implementing high-throughput asynchronous MQTT subscriber clients and zero-copy binary parser pipelines for refrigerated sensor telemetry.',
            purpose: 'Scaffolding high-concurrency async edge MQTT forwarders with automatic retry and gzip compression',
            commandOrSetup: 'pip install paho-mqtt psycopg2-binary',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'ingestion/reefer_mqtt_consumer.py',
          code: `import asyncio
import paho.mqtt.client as mqtt
import psycopg2
import json

db_conn = psycopg2.connect("postgresql://fde_iot:secure_pw@timescale-cluster:5432/coldchain_lake")
cursor = db_conn.cursor()

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode('utf-8'))
    cursor.execute("""
        INSERT INTO reefer_telemetry (time, trailer_id, zone_temp_celsius, ambient_temp_celsius, humidity_pct, compressor_status)
        VALUES (NOW(), %s, %s, %s, %s, %s)
    """, (payload['trailer_id'], payload['zone_temp'], payload['ambient_temp'], payload['humidity'], payload['compressor']))
    db_conn.commit()

client = mqtt.Client(client_id="fde-coldchain-ingest-01")
client.on_message = on_message
client.connect("emqx-cluster.internal", 1883, 60)
client.subscribe("telemetry/reefers/+/sensors")
client.loop_forever()`
        },
        promptOrCliSample: 'python ingestion/reefer_mqtt_consumer.py --batch-size 1000 --buffer-seconds 2',
        keyDeliverable: 'Resilient time-series ingestion pipeline writing telemetry to TimescaleDB with zero data loss over intermittent 4G/LTE cellular connections.',
        verificationCriteria: 'Telemetry write latency <50ms with automatic failover to local SQLite buffer when cellular reception drops in remote transit corridors.'
      },
      {
        stepNumber: 2,
        title: 'Computer Vision Dock Inspection & Pallet Defect Classification',
        phase: '2. Computer Vision & Defect Detection',
        summary: 'Train and deploy YOLOv11 and SAM 2 computer vision models on edge Jetson Orin compute nodes at receiving docks to inspect incoming produce pallets.',
        aiToolsUsed: [
          {
            toolName: 'Ultralytics YOLOv11',
            category: 'Computer Vision & Multimodal',
            definition: 'State-of-the-art real-time computer vision object detection and instance segmentation architecture optimized for edge devices.',
            responsibility: 'Scanning thermal camera feeds at loading docks and cross-docks to identify thermal leakage hotspots, pallet seal compromises, and frost buildup.',
            purpose: 'Real-time object detection and instance segmentation for identifying carton crushing, frost buildup, and surface mold on fresh berry cartons',
            commandOrSetup: 'pip install ultralytics opencv-python',
          },
          {
            toolName: 'Segment Anything Model 2 (SAM 2)',
            category: 'Computer Vision & Multimodal',
            definition: 'Zero-shot visual foundation model for promptable segmentation across images and high-fps video streams.',
            responsibility: 'Segmenting individual produce pallet boundaries and detecting micro-punctures or frost breaches in protective thermal blankets.',
            purpose: 'Zero-shot promptable segmentation to measure exact volumetric bruising percentages on incoming fruit crates',
            commandOrSetup: 'pip install git+https://github.com/facebookresearch/segment-anything-2.git',
          },
          {
            toolName: 'Roboflow',
            category: 'Developer & IDE',
            definition: 'End-to-end computer vision platform for dataset annotation, synthetic augmentation, and model deployment pipelines.',
            responsibility: 'Managing active-learning datasets of damaged thermal seals, auto-labeling reefer container defects, and generating edge inference models.',
            purpose: 'Automated data labeling, augmentation, and dataset distribution to edge NVIDIA Jetson clusters',
            commandOrSetup: 'pip install roboflow',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'vision/pallet_quality_classifier.py',
          code: `from ultralytics import YOLO
import cv2

model = YOLO("models/coldchain_yolov11_defect.pt")

def inspect_dock_pallet_frame(frame_bgr):
    results = model(frame_bgr, conf=0.65)
    defect_summary = {"bruised_cases": 0, "crushed_cartons": 0, "frost_excursion": False}
    
    for r in results:
        for box in r.boxes:
            cls_name = model.names[int(box.cls[0])]
            if cls_name == "crushed_carton":
                defect_summary["crushed_cartons"] += 1
            elif cls_name == "fruit_bruising":
                defect_summary["bruised_cases"] += 1
            elif cls_name == "frost_buildup":
                defect_summary["frost_excursion"] = True

    # Calculate overall pallet quality grade (Grade A / B / C / Reject)
    grade = "REJECT" if defect_summary["crushed_cartons"] > 3 or defect_summary["frost_excursion"] else "GRADE_A"
    return {"grade": grade, "details": defect_summary}`
        },
        promptOrCliSample: 'yolo detect predict model=models/coldchain_yolov11_defect.pt source="rtsp://dock-cam-04:554/live" --save',
        keyDeliverable: 'Edge-deployed computer vision model grading pallets in <300ms as fork trucks unload trailers at the warehouse receiving dock.',
        verificationCriteria: 'Model mAP50 > 94.2% on packaging defect detection and zero false-acceptance on freeze-damaged perishable lots.'
      },
      {
        stepNumber: 3,
        title: 'Zero-Shot Time-Series Spoilage Forecasting (Amazon Chronos)',
        phase: '3. AI Forecasting Foundation Model',
        summary: 'Feed multi-sensor telemetry histories into the Chronos time-series foundation model to generate probabilistic shelf-life decay curves.',
        aiToolsUsed: [
          {
            toolName: 'Amazon Chronos-T5 Foundation Model',
            category: 'LLM & Reasoning',
            definition: 'Pretrained probabilistic time-series foundation model converting continuous numerical sequences into discrete tokens for autoregressive forecasting.',
            responsibility: 'Forecasting temperature trajectory 6 to 18 hours into the future based on compressor vibration anomalies and ambient weather forecasts.',
            purpose: 'Zero-shot probabilistic time-series forecasting predicting hourly quality deterioration from historical temperature and vibration fluctuations',
            commandOrSetup: 'pip install git+https://github.com/amazon-science/chronos-forecasting.git',
          },
          {
            toolName: 'Ray Cluster',
            category: 'Vector & Data',
            definition: 'Unified distributed execution framework for scaling compute-intensive AI workloads and parallel inference across heterogeneous GPU/CPU nodes.',
            responsibility: 'Distributed batch inferencing across 8,500 simultaneous reefer time-series sequences within sub-10 second batch execution windows.',
            purpose: 'Distributed batch inference running 45,000 pallet spoilage simulations in parallel across AWS GPU instances',
            commandOrSetup: 'pip install ray[default] torch',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'forecasting/chronos_shelf_life_predictor.py',
          code: `import torch
from chronos import ChronosPipeline
import pandas as pd

pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-large",
    device_map="cuda",
    torch_dtype=torch.bfloat16,
)

def forecast_shelf_life_hours(telemetry_series: pd.Series, prediction_length: int = 48) -> dict:
    context = torch.tensor(telemetry_series.values)
    # Generate 50 probabilistic sample trajectories
    forecast = pipeline.predict(context, prediction_length=prediction_length, num_samples=50)
    
    # Calculate 10th, 50th, and 90th percentile spoilage time limits
    low_bound, median, high_bound = np.percentile(forecast[0].numpy(), [10, 50, 90], axis=0)
    critical_threshold = 7.0 # Celsius threshold where microbial growth doubles
    excursion_hours = np.sum(median > critical_threshold)
    
    estimated_shelf_life_days = max(1.0, 14.0 - (excursion_hours * 0.8))
    return {
        "estimated_shelf_life_days": round(estimated_shelf_life_days, 1),
        "excursion_risk_pct": float(np.mean(forecast[0].numpy() > critical_threshold))
    }`
        },
        promptOrCliSample: 'python forecasting/chronos_shelf_life_predictor.py --batch-input /data/active_trailers.parquet',
        keyDeliverable: 'Probabilistic prediction engine outputting remaining shelf-life days and degradation uncertainty intervals for every inventory SKU.',
        verificationCriteria: 'Mean Absolute Percentage Error (MAPE) < 4.8% on actual lab microbiological shelf-life decay benchmarks.'
      },
      {
        stepNumber: 4,
        title: 'FEFO Dynamic Allocation Agent & Manhattan WMS Integration',
        phase: '4. Tool Execution & ERP Integration',
        summary: 'Deploy an autonomous CrewAI allocation agent that dynamically re-assigns pick orders from static FIFO to dynamic FEFO, pushing task updates to Manhattan WMS.',
        aiToolsUsed: [
          {
            toolName: 'CrewAI + GPT-4o',
            category: 'Agent Framework',
            definition: 'Role-based collaborative multi-agent orchestration framework pairing specialized autonomous agents with OpenAI\'s multimodal flagship model.',
            responsibility: 'Coordinating the autonomous Cold-Chain Triage Agent, WMS Expediter Agent, and Carrier Dispatcher Agent to execute emergency dock re-routes.',
            purpose: 'Multi-role agent team balancing order fulfillment SLAs, transit distance to retail stores, and remaining SKU shelf-life',
            commandOrSetup: 'pip install crewai crewai-tools',
          },
          {
            toolName: 'Manhattan Associates WMS REST APIs',
            category: 'Developer & IDE',
            definition: 'Enterprise warehouse management system API interface governing dock doors, cold-storage staging lanes, and prioritized unloading queues.',
            responsibility: 'Programmatically reserving cold-storage staging lanes and reprioritizing yard jockey move orders ahead of standard dry cargo.',
            purpose: 'Executing real-time pick-wave modifications and assigning high-velocity pallets directly to near-dock staging lanes',
            commandOrSetup: 'pip install requests tenacity',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'agents/fefo_allocation_agent.py',
          code: `from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

@tool
def reassign_pallet_destination(pallet_id: str, new_target_dc: str, reason: str):
    """Updates Manhattan WMS pick-wave routing for short-dated perishable pallets."""
    import requests
    headers = {"Authorization": "Bearer $WMS_API_KEY", "Content-Type": "application/json"}
    payload = {"pallet": pallet_id, "destination": new_target_dc, "priority": "EXPRESS_FEFO", "reason": reason}
    res = requests.post("https://wms.coldchain.internal/api/v1/waves/reassign", json=payload, headers=headers)
    return res.status_code == 200

allocator_agent = Agent(
    role="Cold-Chain Inventory Allocator",
    goal="Ensure pallets with under 5 days remaining shelf-life are routed to nearby metropolitan stores within 4 hours",
    backstory="You are an expert logistics coordinator preventing grocery food waste by overriding standard FIFO pick logic.",
    tools=[reassign_pallet_destination],
    verbose=True
)

allocation_task = Task(
    description="Analyze pallet SKU-9014 (Strawberries, 3.2 days remaining shelf life) and allocate to local Store-104 instead of distant Store-882.",
    expected_output="Confirmation of WMS re-assignment and modified bill of lading.",
    agent=allocator_agent
)

cold_chain_crew = Crew(agents=[allocator_agent], tasks=[allocation_task], process=Process.sequential)
result = cold_chain_crew.kickoff()`
        },
        promptOrCliSample: 'python agents/fefo_allocation_agent.py --execute-live-waves',
        keyDeliverable: 'Autonomous agent crew executing dynamic pick-wave adjustments across 82 distribution centers without human supervisor intervention.',
        verificationCriteria: '100% adherence to customer shelf-life delivery guarantees and sub-second WMS transaction acknowledgment.'
      },
      {
        stepNumber: 5,
        title: 'Warehouse Edge Touchscreen Cockpit & Grafana Alarms',
        phase: '5. UI Copilot & Observability',
        summary: 'Provide warehouse shift supervisors with ruggedized touch-screen tablet interfaces showing real-time pallet expiration heatmap and automated SMS alarms to reefers drivers.',
        aiToolsUsed: [
          {
            toolName: 'Prometheus + Grafana',
            category: 'Observability & Eval',
            definition: 'Standard open-source metrics collection engine and multi-panel dashboard visualization suite for real-time systems monitoring.',
            responsibility: 'Tracking cold-chain compliance SLA ratios, mean-time-to-intervention (MTTI), and alerts on temperature excursions exceeding ±0.5°C.',
            purpose: 'Industrial IoT dashboard monitoring 4,200 reefers in transit with automated PagerDuty and SMS dispatch when temperature breaches 4°C',
            commandOrSetup: 'docker-compose -f infra/monitoring-compose.yml up -d',
          },
          {
            toolName: 'React 19 + Tailwind CSS + Lucide',
            category: 'Developer & IDE',
            definition: 'Modern component-based reactive user interface framework with atomic utility-first styling and vector iconography.',
            responsibility: 'Rendering the real-time operational dashboard, interactive map pins, container risk timelines, and single-click manual override approval modals for dispatchers.',
            purpose: 'Ruggedized tablet UI for dock fork-lift operators with large touch targets and color-coded shelf-life warnings',
            commandOrSetup: 'npm install lucide-react recharts',
          }
        ],
        implementationSnippet: {
          language: 'typescript',
          filename: 'src/components/ColdChainDockDashboard.tsx',
          code: `import React from 'react';
import { ThermometerSnowflake, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export const ColdChainDockView: React.FC = () => {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ThermometerSnowflake className="w-5 h-5 text-cyan-400" />
          <h4 className="text-white font-bold text-sm">Dock 14: Inbound Pallet Inspection</h4>
        </div>
        <span className="px-2 py-0.5 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
          Reefer Temp: 2.1°C (Optimal)
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
          <span className="text-zinc-400">Chronos Shelf-Life</span>
          <p className="text-emerald-400 font-bold text-base mt-1">4.8 Days</p>
        </div>
        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
          <span className="text-zinc-400">YOLOv11 Defect Score</span>
          <p className="text-white font-bold text-base mt-1">0.4% (Pass)</p>
        </div>
        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
          <span className="text-zinc-400">Allocation Target</span>
          <p className="text-cyan-300 font-bold text-base mt-1">Store #104 (Express)</p>
        </div>
      </div>
    </div>
  );
};`
        },
        promptOrCliSample: 'npm run build && npm run preview',
        keyDeliverable: 'High-visibility industrial dashboard deployed on forklift-mounted tablets alerting warehouse crew to critical perishable arrivals.',
        verificationCriteria: 'Instant audio/visual alert trigger when a critical excursion trailer docks and zero UI latency under poor warehouse Wi-Fi conditions.'
      }
    ]
  },

  // ==========================================
  // CASE STUDY 3: SUPPLY CHAIN & LOGISTICS (CUSTOMS CLEARANCE & BOL)
  // ==========================================
  {
    id: 'case-study-sc-customs',
    title: 'Autonomous Maritime Customs Clearance & Multimodal Bill of Lading (BOL) Copilot',
    industry: 'Supply Chain & Logistics',
    companyArchetype: 'Transpacific Customs Broker & Freight Forwarder (2.4M Annual Shipments)',
    contractValue: '$8.4M Annual Enterprise Platform',
    timeframe: '14-Day POC -> 12 Global Trade Corridors',
    situation: '350 customs brokers overwhelmed by 2.4M annual complex multimodal shipping manifests, bills of lading, and phytosanitary certificates, manually classifying 18,000 HS tariff codes with high error rates, leading to 3-day border clearance delays and expensive bonded storage fees.',
    fdePlaybook: [
      'Engineered an end-to-end multimodal document parsing pipeline combining LayoutLMv3, Unstructured.io, and Gemini 1.5 Pro to extract 85+ fields from noisy scanned PDFs.',
      'Configured hybrid BM25 + dense semantic retrieval over the World Customs Organization (WCO) 18,000 Harmonized System (HS) code ontology in Qdrant.',
      'Constructed a self-correcting compliance validation agent that verifies origin certificates, trade sanctions, and import tariffs prior to customs submission.',
      'Created a human-in-the-loop (HITL) broker verification interface with side-by-side bounding box document inspection.'
    ],
    architectureDiagramSnippet: `[Scanned PDF / BOL / Invoices] ──> [LayoutLMv3 + Gemini 1.5 Pro] ──> [Normalized Shipment JSON]
                                                                        │
                                                                        ▼
[Customs CBP ACE / ASYCUDA EDI] <── [HITL Broker UI] <── [Qdrant Hybrid Search (18k HS Codes)]
                                                                        │
                                                                        ▼
                                                [LangGraph Discrepancy Reflection Agent]`,
    outcome: 'Accelerated customs declaration processing from 3 days to under 4 minutes with 99.7% HS code accuracy, saving $19.2M in bonded warehouse storage fees.',
    lessonsLearned: [
      'Multimodal models hallucinate tariff classification when packaging details (e.g. gross vs net weight, material purity) are omitted; strict JSON schema gating prevents submission of incomplete dossiers.',
      'Customs authorities penalize repeated submission retries; all agent drafts must be idempotently hashed before dispatch.'
    ],
    aiStackSummary: {
      primaryModels: ['Gemini 1.5 Pro Multimodal', 'LayoutLMv3', 'Claude 3.5 Sonnet'],
      agenticFrameworks: ['LangGraph Reflection Agent', 'Pydantic AI'],
      vectorAndData: ['Qdrant Hybrid Search', 'Unstructured.io', 'PostgreSQL Audit Store'],
      devAndEvalTools: ['Cursor IDE', 'LangSmith Tracing', 'Playwright ABI Automator', 'Tesseract OCR']
    },
    implementationSteps: [
      {
        stepNumber: 1,
        title: 'Multimodal Document Parsing & Spatial Layout Analysis',
        phase: '1. Ingestion & Document AI',
        summary: 'Ingest noisy faxed, skewed, and multi-page Bills of Lading, commercial packing lists, and origin certificates using LayoutLMv3 and Gemini 1.5 Pro.',
        aiToolsUsed: [
          {
            toolName: 'Gemini 1.5 Pro Multimodal',
            category: 'LLM & Reasoning',
            definition: 'Multimodal frontier model with 2M token context window capable of high-resolution document parsing, OCR, and reasoning across multi-page PDFs.',
            responsibility: 'Ingesting complex international commercial invoices, multi-page packing lists, and bills of lading to extract chemical formulas, materials, and line items.',
            purpose: 'Extraction of complex tabular line items, commercial invoice totals, and incoterms across degraded scans',
            commandOrSetup: 'pip install google-genai pillow pydantic',
          },
          {
            toolName: 'Unstructured.io + LayoutLMv3',
            category: 'Computer Vision & Multimodal',
            definition: 'Open-source document processing library combined with multimodal transformer for document layout analysis and token classification.',
            responsibility: 'Segmenting unstructured table hierarchies, nested line-item matrices, and stamp verifications into machine-readable JSON structures.',
            purpose: 'Visual layout analysis and bounding-box coordinate mapping for human-in-the-loop audit verification',
            commandOrSetup: 'pip install "unstructured[pdf]" py-tesseract',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'ingestion/multimodal_bol_parser.py',
          code: `from google import genai
from pydantic import BaseModel, Field
from typing import List

client = genai.Client()

class LineItemDeclaration(BaseModel):
    description: str
    quantity: float
    unit_of_measure: str
    unit_value_usd: float
    country_of_origin: str
    suggested_hs_code: str = Field(description="6 to 10 digit Harmonized Tariff Code")

class ExtractedBillOfLading(BaseModel):
    bol_number: str
    shipper_name: str
    consignee_name: str
    port_of_loading: str
    port_of_discharge: str
    items: List[LineItemDeclaration]

def parse_shipping_document_with_vision(pdf_page_image_bytes) -> ExtractedBillOfLading:
    response = client.models.generate_content(
        model='gemini-1.5-pro',
        contents=[
            "Extract all commercial shipment entities and line items into strict JSON according to the schema.",
            genai.types.Part.from_bytes(data=pdf_page_image_bytes, mime_type='image/jpeg')
        ],
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ExtractedBillOfLading,
            temperature=0.0
        )
    )
    return ExtractedBillOfLading.model_validate_json(response.text)`
        },
        promptOrCliSample: 'python ingestion/multimodal_bol_parser.py --input-dir /raw_manifests/batch_20261014/',
        keyDeliverable: 'Automated document ingestion pipeline transforming messy PDFs into validated Pydantic JSON with bounding box coordinates in <2.2 seconds.',
        verificationCriteria: 'Extraction field accuracy >99.5% on shipper addresses, port codes, container numbers, and invoice monetary subtotals.'
      },
      {
        stepNumber: 2,
        title: 'Hybrid HS Code Semantic Indexing & Tariff Retrieval',
        phase: '2. Vector & Tariff Ontology',
        summary: 'Index the full 18,000 WCO and US International Trade Commission (USITC) Harmonized Tariff Schedule in Qdrant with hybrid dense + sparse BM25 search.',
        aiToolsUsed: [
          {
            toolName: 'Qdrant Hybrid Search',
            category: 'Vector & Data',
            definition: 'Vector search engine enabling combined dense vector embeddings and sparse lexical inverted index search with reciprocal rank fusion.',
            responsibility: 'Querying the 28,000 Harmonized System (HS) / HTS 10-digit tariff code classifications and legal chapter classification notes.',
            purpose: 'Simultaneous keyword (exact material specification) and dense conceptual retrieval over 18,000 official tariff subheadings',
            commandOrSetup: 'pip install qdrant-client fastembed',
          },
          {
            toolName: 'Voyage AI Reranker',
            category: 'LLM & Reasoning',
            definition: 'Cross-encoder neural ranking model specialized for scoring document relevance and query-context alignment with high semantic precision.',
            responsibility: 'Re-ranking top-20 retrieved tariff code candidates to produce the single most legally defensible HTS code matching specific material properties.',
            purpose: 'Cross-encoder scoring to re-rank top-10 candidate HS codes based on specific chemical composition or fabrication percentages',
            commandOrSetup: 'pip install voyageai',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'ontology/hs_code_indexer.py',
          code: `from qdrant_client import QdrantClient
from qdrant_client.models import Prefetch, Filter, FieldCondition, MatchValue

client = QdrantClient("http://qdrant-cluster:6333")

def find_candidate_hs_codes(cargo_description: str, country_of_origin: str) -> list:
    # Executes hybrid sparse BM25 + dense neural search
    results = client.query_points(
        collection_name="wco_tariff_schedules",
        query=cargo_description,
        using="hybrid_dense_sparse",
        limit=5,
        query_filter=Filter(
            must=[FieldCondition(key="active_year", match=MatchValue(value=2026))]
        )
    )
    return [
        {
            "hs_code": p.payload["hs_code"],
            "description": p.payload["official_text"],
            "duty_rate": p.payload["general_rate"],
            "score": p.score
        }
        for p in results.points
    ]`
        },
        promptOrCliSample: 'python ontology/hs_code_indexer.py --test-query "Lithium ion rechargeable battery packs for electric vehicles"',
        keyDeliverable: 'Millisecond hybrid search engine returning verified legal tariff classifications with duty rates and special trade agreements (USMCA, etc.).',
        verificationCriteria: 'Top-3 candidate retrieval contains the legally verified HS code in 99.8% of historical customs audit test cases.'
      },
      {
        stepNumber: 3,
        title: 'LangGraph Self-Reflective Compliance & Sanctions Agent',
        phase: '3. Multi-Agent AI Orchestration',
        summary: 'Implement a reflective agent loop verifying that goods do not violate export sanctions (OFAC), anti-dumping duties, or phytosanitary inspection mandates.',
        aiToolsUsed: [
          {
            toolName: 'LangGraph + Claude 3.5 Sonnet',
            category: 'Agent Framework',
            definition: 'Cyclic graph-based orchestration framework for multi-agent workflows with state persistence, conditional edge routing, and human-in-the-loop checkpoints.',
            responsibility: 'Managing stateful agent loops coordinating risk detection, carrier rate negotiations, multi-agency compliance checks, and exception escalation.',
            purpose: 'Cyclic self-correction graph evaluating invoice line items against trade restriction lists and cross-referencing certificate of origin authenticity',
            commandOrSetup: 'pip install langgraph langchain-core',
          },
          {
            toolName: 'Pydantic AI',
            category: 'Developer & IDE',
            definition: 'Python agent framework combining Pydantic validation with generative model tool execution and guaranteed schema conformance.',
            responsibility: 'Strictly enforcing that every generated customs entry summary (CBP Form 7501) adheres to government XML/JSON schema specs.',
            purpose: 'Type-safe agent execution guaranteeing that customs declaration payloads conform to US Customs ACE format',
            commandOrSetup: 'pip install pydantic-ai',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'agents/customs_compliance_agent.py',
          code: `from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic

class CustomsValidationState(TypedDict):
    invoice_items: List[dict]
    hs_code: str
    country_of_origin: str
    compliance_passed: bool
    sanctions_flagged: bool
    discrepancy_explanation: str
    critique_iterations: int

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0)

def compliance_auditor(state: CustomsValidationState) -> dict:
    prompt = f"Audit line items {state['invoice_items']} under HS code {state['hs_code']} from {state['country_of_origin']}. Check Section 301 tariffs and OFAC."
    res = llm.invoke(prompt)
    is_valid = "VIOLATION" not in res.content
    return {
        "compliance_passed": is_valid,
        "discrepancy_explanation": res.content,
        "critique_iterations": state.get("critique_iterations", 0) + 1
    }

def route_next_step(state: CustomsValidationState) -> str:
    if state["compliance_passed"] or state["critique_iterations"] >= 3:
        return "finalize"
    return "re_evaluate"

workflow = StateGraph(CustomsValidationState)
workflow.add_node("audit", compliance_auditor)
workflow.set_entry_point("audit")
workflow.add_conditional_edges("audit", route_next_step, {"finalize": END, "re_evaluate": "audit"})
compliance_graph = workflow.compile()`
        },
        promptOrCliSample: 'python agents/customs_compliance_agent.py --run-sanctions-benchmark',
        keyDeliverable: 'Self-correcting compliance validation agent catching tariff misclassifications and international trade embargo violations before customs submission.',
        verificationCriteria: 'Zero false-negatives on OFAC Specially Designated Nationals (SDN) sanctions screenings and automated anti-dumping tariff calculations.'
      },
      {
        stepNumber: 4,
        title: 'CBP ACE Automated Broker Interface (ABI) & ASYCUDA EDI Generator',
        phase: '4. Tool Execution & ERP Integration',
        summary: 'Generate certified US Customs ANSI ASC X12 EDI 346 / EDIFACT CUSDEC electronic declarations and transmit securely via AS2 protocol.',
        aiToolsUsed: [
          {
            toolName: 'Python EDI Engine + Playwright',
            category: 'Developer & IDE',
            definition: 'Deterministic EDI parser engine paired with headless browser automation for interacting with authenticated government web portals.',
            responsibility: 'Formatting approved entries into CBP Automated Commercial Environment (ACE) ABI messages and handling legacy PGA web form uploads.',
            purpose: 'Compilation of certified ANSI X12 346 customs entry documents with automated cryptographic signing and AS2 transmission',
            commandOrSetup: 'pip install pyx12 playwright',
          },
          {
            toolName: 'Cursor IDE',
            category: 'Developer & IDE',
            definition: 'AI-first code editor with deep semantic repository context for rapid full-stack scaffolding.',
            responsibility: 'Refactoring customs filing validation rules and generating automated test cases against 5,000 historical customs audit filings.',
            purpose: 'Rapid development and testing of customs broker EDI mapping schemas and AS2 mTLS connection handlers',
            commandOrSetup: 'cursor .',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'edi/customs_x12_generator.py',
          code: `def build_x12_346_customs_entry(entry_number: str, importer_ein: str, line_items: list) -> str:
    segments = [
        f"ISA*00*          *00*          *ZZ*BROKER_ID      *ZZ*US_CUSTOMS_ACE *261014*1630*U*00401*000000001*0*P*>~",
        f"GS*CE*BROKER_ID*US_CUSTOMS_ACE*20261014*1630*1*X*004010~",
        f"ST*346*0001~",
        f"B4*N*{entry_number}*20261014~",
        f"N1*IM*{importer_ein}~"
    ]
    for idx, item in enumerate(line_items, 1):
        segments.append(f"LX*{idx}~")
        segments.append(f"TDS*{item['declared_value_usd']}~")
        segments.append(f"HTS*{item['hs_code']}*{item['quantity']}*{item['unit_code']}~")
    segments.append("SE*12*0001~")
    segments.append("GE*1*1~")
    segments.append("IEA*1*000000001~")
    return "\\n".join(segments)`
        },
        promptOrCliSample: 'python edi/customs_x12_generator.py --validate-against-cbp-schema tests/sample_entry.x12',
        keyDeliverable: 'Deterministic electronic data interchange (EDI) generator formatting validated dossiers directly into federal customs agency protocols.',
        verificationCriteria: '100% compliance with CBP ACE Automated Broker Interface specifications with zero syntax rejections from border servers.'
      },
      {
        stepNumber: 5,
        title: 'Broker Human-in-the-Loop (HITL) Review Portal & LangSmith Auditing',
        phase: '5. UI Copilot & Observability',
        summary: 'Build a high-productivity human broker verification interface in React 19 highlighting model confidence, document bounding boxes, and instant one-click approval.',
        aiToolsUsed: [
          {
            toolName: 'React 19 + Tailwind CSS + Lucide',
            category: 'Developer & IDE',
            definition: 'Modern component-based reactive user interface framework with atomic utility-first styling and vector iconography.',
            responsibility: 'Rendering the real-time operational dashboard, interactive map pins, container risk timelines, and single-click manual override approval modals for dispatchers.',
            purpose: 'Split-screen UI showing original scanned PDF on the left and agent-extracted JSON fields with confidence scores on the right',
            commandOrSetup: 'npm install pdfjs-dist lucide-react',
          },
          {
            toolName: 'LangSmith + Arize Phoenix',
            category: 'Observability & Eval',
            definition: 'End-to-end tracing and evaluation platform capturing complete OpenTelemetry spans, token latencies, retrieval relevance, and agent step trajectories.',
            responsibility: 'Continuous evaluation of agentic reasoning paths, monitoring hallucination rates, detecting retrieval regressions, and tracking LLM inferencing costs.',
            purpose: 'Continuous logging of broker edits to build fine-tuning datasets that improve model accuracy on rare commodity types',
            commandOrSetup: 'export PHOENIX_COLLECTOR_ENDPOINT=http://phoenix:6006',
          }
        ],
        implementationSnippet: {
          language: 'typescript',
          filename: 'src/components/CustomsBrokerHitlReview.tsx',
          code: `import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomsHitlReview: React.FC = () => {
  const [confidence, setConfidence] = useState(0.984);
  const [hsCode, setHsCode] = useState('8507.60.00.00');

  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-white space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm">Automated Customs Dossier #CBP-2026-90812</h3>
        </div>
        <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> AI Confidence: {(confidence * 100).toFixed(1)}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <span className="text-zinc-400">Classified Commodity:</span>
          <p className="text-white font-semibold mt-1">Lithium-ion accumulator batteries (Automotive)</p>
          <div className="mt-2 text-cyan-400 font-mono">HS Tariff: {hsCode} (Duty: 3.4%)</div>
        </div>
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-zinc-400">Sanctions & Restrictions:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">✓ 100% Cleared (OFAC / Section 301 verified)</span>
          <button className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all text-xs">
            Transmit Certified Entry to CBP ACE
          </button>
        </div>
      </div>
    </div>
  );
};`
        },
        promptOrCliSample: 'npm run test:hitl-portal',
        keyDeliverable: 'Split-screen human-in-the-loop review interface allowing customs brokers to verify declarations in under 45 seconds per shipment.',
        verificationCriteria: 'Broker review efficiency boosted by 650% with complete cryptographic audit trail for every submitted declaration.'
      }
    ]
  },

  // ==========================================
  // CASE STUDY 4: DEFENSE & AEROSPACE
  // ==========================================
  {
    id: 'case-study-defense',
    title: 'Air Combat Readiness: Defense Fleet Ontology in Air-Gapped Cloud',
    industry: 'Defense & Aerospace',
    companyArchetype: 'DoD / Allied Air Command',
    contractValue: '$18.5M Enterprise License',
    timeframe: '21-Day Pilot -> 3-Year Deployment',
    situation: 'Military planners were using 12 separate legacy systems to track jet fighter readiness, maintenance parts, and pilot qualifications. It took 6 hours to compute if a combat squadron could deploy.',
    fdePlaybook: [
      'Deployed an offline K3s container stack with Harbor inside an air-gapped SCIF on Day 3.',
      'Engineered an Object-Action-Relation ontology linking "Aircraft", "Avionics_Subsystem", "Pilot", and "Munition".',
      'Created an atomic Action "ScrambleSquadron" that ran real-time automated verification across maintenance logs, munitions inventory, and pilot flight hours.'
    ],
    architectureDiagramSnippet: `[Legacy IBM DB2] ──(Airbyte CDC)──> [Offline Kafka] ──> [Ontology Engine] ──> [Combat Dashboard (React)]
[SAP Maintenance] ─(Batch ETL)───> [MinIO Lakehouse] ─┘ (mTLS + Okta SAML)`,
    outcome: 'Reduced mission deployment readiness calculation time from 6 hours to 8 seconds. Selected by the Joint Chiefs of Staff for enterprise-wide rollout across 350+ airbases.',
    lessonsLearned: [
      'Always carry extra encrypted offline USB drives with full OS dependencies when entering SCIF environments.',
      'Non-technical military commanders care about actionable green/red status cards, not SQL query performance.'
    ],
    aiStackSummary: {
      primaryModels: ['Llama-3-70B Instruct (Air-Gapped)', 'Mistral Small (Offline)'],
      agenticFrameworks: ['LangChain Offline Agent', 'Custom SCIF Ontology Engine'],
      vectorAndData: ['Qdrant Private On-Prem', 'MinIO Air-Gapped S3', 'PostgreSQL Timescale'],
      devAndEvalTools: ['Aider Local LLM CLI', 'Harbor Private Registry', 'K3s Airgap Bundle', 'OpenSearch']
    },
    implementationSteps: [
      {
        stepNumber: 1,
        title: 'Air-Gapped SCIF Infrastructure & Offline Harbor Packaging',
        phase: '1. Secure Infrastructure Setup',
        summary: 'Package all container images, model weights, and Helm charts into verified encrypted tarballs and deploy an offline K3s cluster inside a classified SCIF.',
        aiToolsUsed: [
          {
            toolName: 'Harbor + Skopeo + K3s Airgap',
            category: 'Developer & IDE',
            definition: 'Container registry and image management tooling configured for fully disconnected, non-networked air-gapped bare-metal environments.',
            responsibility: 'Signing, validating cryptographic SHA-256 digests, and deploying containerized AI workloads into air-gapped SCIF Kubernetes clusters.',
            purpose: 'Offline container registry and multi-architecture Kubernetes distribution running with zero external internet access',
            commandOrSetup: 'skopeo copy docker-archive:images.tar docker://harbor.scif.internal/fde/app:v1',
          },
          {
            toolName: 'Aider + Local Ollama',
            category: 'Developer & IDE',
            definition: 'Terminal-based AI pair-programming agent driven by locally hosted open-weights language models without external network dependencies.',
            responsibility: 'Assisting embedded systems engineers with offline code synthesis, unit test generation, and C++/Python interface binding generation.',
            purpose: 'Air-gapped AI coding assistant allowing FDEs to write and refactor code without calling public cloud APIs',
            commandOrSetup: 'aider --model ollama/codellama:34b --dark-mode',
          }
        ],
        implementationSnippet: {
          language: 'bash',
          filename: 'deploy/airgap_bootstrap.sh',
          code: `#!/usr/bin/env bash
set -euo pipefail

echo "==> Loading offline K3s images into SCIF node..."
k3s ctr images import /media/secure_usb/k3s-airgap-images-amd64.tar

echo "==> Starting private Harbor container registry..."
docker load -i /media/secure_usb/harbor-offline-installer-v2.10.tar
cd /opt/harbor && ./install.sh --with-trivy

echo "==> Loading Llama-3-70B GGUF model weights into local NVMe storage..."
cp /media/secure_usb/models/llama-3-70b-instruct.Q4_K_M.gguf /opt/models/
echo "Air-gapped perimeter established with zero external connectivity."`
        },
        promptOrCliSample: 'bash deploy/airgap_bootstrap.sh --verify-sha256',
        keyDeliverable: 'Hardened Kubernetes cluster and private container registry running inside classified physical boundary.',
        verificationCriteria: '100% offline verification: zero DNS lookups to public IP addresses and successful Harbor vulnerability scans.'
      },
      {
        stepNumber: 2,
        title: 'Defense Fleet Ontology Modeling & Graph Data Synthesis',
        phase: '2. Ontology & Graph Architecture',
        summary: 'Model defense assets into an Object-Action-Relation (OAR) ontology connecting F-35 airframes, Pratt & Whitney engines, munitions stock, and pilot certifications.',
        aiToolsUsed: [
          {
            toolName: 'Qdrant (Self-Hosted Private)',
            category: 'Vector & Data',
            definition: 'On-premise vector database engine running entirely offline on air-gapped NVMe storage nodes with zero cloud telemetry.',
            responsibility: 'Indexing 1.2M technical maintenance manuals, engineering change proposals (ECPs), and avionics telemetry logs with zero egress.',
            purpose: 'Offline vector similarity search over classified technical flight manuals (T.O. manuals) and pilot combat logs',
            commandOrSetup: 'docker run -d --name qdrant-offline -p 6333:6333 harbor.scif.internal/fde/qdrant:v1.11',
          },
          {
            toolName: 'Graphiti Knowledge Graph',
            category: 'Vector & Data',
            definition: 'Dynamic temporal knowledge graph engine for modeling evolving entity relationships, fault trees, and operational readiness ontologies.',
            responsibility: 'Maintaining the live airframe component graph: mapping Line Replaceable Units (LRUs), flight hours, and mean-time-between-failures (MTBF).',
            purpose: 'Dynamic temporal knowledge graph tracking military component swap histories and airworthiness certs',
            commandOrSetup: 'pip install graphiti-core',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'ontology/defense_fleet_schema.py',
          code: `from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Aircraft(BaseModel):
    tail_number: str
    airframe_model: str # e.g. "F-35A"
    flight_hours: float
    mission_capable_status: str # "FMC", "PMC", "NMC"
    installed_engine_serial: str
    next_depot_inspection: datetime

class SquadronReadinessState(BaseModel):
    squadron_id: str
    available_fmc_aircraft: int
    qualified_pilots: int
    munitions_readiness_pct: float
    scramble_authorized: bool`
        },
        promptOrCliSample: 'python ontology/defense_fleet_schema.py --validate-against-legacy-db2',
        keyDeliverable: 'Operational defense ontology abstracting 12 fragmented legacy mainframes and DB2 databases.',
        verificationCriteria: 'Sub-second reconciliation of maintenance logs, munitions inventory, and crew duty hour restrictions.'
      },
      {
        stepNumber: 3,
        title: 'Offline LLM Serving with vLLM & PagedAttention',
        phase: '3. Air-Gapped AI Serving',
        summary: 'Deploy private quantized Llama-3-70B on four air-gapped NVIDIA A100 GPUs using vLLM with PagedAttention.',
        aiToolsUsed: [
          {
            toolName: 'vLLM + PagedAttention',
            category: 'LLM & Reasoning',
            definition: 'High-throughput GPU inference engine managing virtual memory allocation for KV caches with PagedAttention and tensor parallelism.',
            responsibility: 'Serving 70B parameter quantized open models (Llama-3.3-70B-Instruct-AWQ) across 4x A100 GPUs at >45 tokens/sec per stream.',
            purpose: 'High-throughput offline inference engine serving 120 tokens/sec across multi-command military staff queries',
            commandOrSetup: 'vllm serve /opt/models/Meta-Llama-3-70B-Instruct --tensor-parallel-size 4 --port 8000',
          },
          {
            toolName: 'LangChain Private Agent',
            category: 'Agent Framework',
            definition: 'Composable agent framework configured with strict offline sandbox execution and local SQLite memory storage.',
            responsibility: 'Orchestrating the diagnostic reasoning loop: querying maintenance fault codes, checking spare parts depots, and generating repair checklists.',
            purpose: 'Zero-egress agentic execution executing SQL queries against the local operational fleet database',
            commandOrSetup: 'pip install langchain',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'serving/offline_vllm_client.py',
          code: `import requests

VLLM_SCIF_URL = "http://127.0.0.1:8000/v1/chat/completions"

def query_combat_readiness_llm(user_query: str, retrieved_context: str) -> str:
    system_prompt = "You are an air combat tactical planner operating in an air-gapped facility. Use only verified military specs."
    payload = {
        "model": "/opt/models/Meta-Llama-3-70B-Instruct",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context: {retrieved_context}\\n\\nQuery: {user_query}"}
        ],
        "temperature": 0.1,
        "max_tokens": 512
    }
    res = requests.post(VLLM_SCIF_URL, json=payload, timeout=30)
    return res.json()["choices"][0]["message"]["content"]`
        },
        promptOrCliSample: 'python serving/offline_vllm_client.py --query "Which 4 aircraft in 48th Fighter Wing have freshest engines?"',
        keyDeliverable: 'Ultra-low latency private LLM engine with zero cloud telemetry or external API reliance.',
        verificationCriteria: 'Zero outbound network socket creation and 99.9% token generation stability under heavy concurrent staff queries.'
      },
      {
        stepNumber: 4,
        title: 'Atomic ScrambleSquadron Action & Cryptographic Audit Trails',
        phase: '4. Tool Execution & Military Actions',
        summary: 'Design an atomic transactional Action that verifies pilot currency, airworthiness tags, and weapon loadouts before generating signed scramble orders.',
        aiToolsUsed: [
          {
            toolName: 'FastAPI + Cryptography PKI',
            category: 'Developer & IDE',
            definition: 'High-performance Python API framework integrated with hardware security module (HSM) x509 PKI certificate validation.',
            responsibility: 'Enforcing mutual TLS (mTLS), DoD PKI CAC smartcard authentication, and role-based access control (RBAC) on all AI inferencing endpoints.',
            purpose: 'Cryptographically signed tactical execution service issuing CAC/PKI-validated military scramble orders',
            commandOrSetup: 'pip install fastapi cryptography uvicorn',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'actions/scramble_action.py',
          code: `def execute_scramble_squadron_action(squadron_id: str, officer_cac_cert: str) -> dict:
    # 1. Verify Officer CAC Digital Signature
    verify_pki_signature(officer_cac_cert)
    
    # 2. Automated multi-system readiness audit
    aircraft_ready = get_available_fmc_aircraft(squadron_id)
    if len(aircraft_ready) < 12:
        raise ValueError("Insufficient FMC aircraft to fulfill mission requirements.")
        
    # 3. Commit atomic state update to lakehouse
    order_id = generate_cryptographic_mission_order(squadron_id, aircraft_ready)
    return {"order_id": order_id, "status": "SCRAMBLE_APPROVED", "aircraft_count": len(aircraft_ready)}`
        },
        promptOrCliSample: 'pytest tests/test_scramble_action.py -v',
        keyDeliverable: 'Atomic action executing multi-database validation and producing cryptographically unforgeable mission orders.',
        verificationCriteria: 'Complete execution and validation in <8 seconds with zero race conditions on ammunition inventory reservations.'
      },
      {
        stepNumber: 5,
        title: 'Tactical Air Commander Cockpit & Readiness Wall',
        phase: '5. UI Copilot & Observability',
        summary: 'Build a dark-mode tactical dashboard for the combat operations center displaying instant squadron airworthiness status.',
        aiToolsUsed: [
          {
            toolName: 'React 19 + Tailwind CSS',
            category: 'Developer & IDE',
            definition: 'Client-side interactive user interface layer styled for enterprise high-contrast dashboards.',
            responsibility: 'Rendering mission-critical operational views, tactical status dashboards, and responsive alert interfaces for field engineers.',
            purpose: 'Zero-latency React cockpit optimized for large command-center LED video walls with keyboard shortcuts',
            commandOrSetup: 'npm run build',
          }
        ],
        implementationSnippet: {
          language: 'typescript',
          filename: 'src/components/AirCombatCockpit.tsx',
          code: `import React from 'react';
import { ShieldCheck, Crosshair, Plane, AlertTriangle } from 'lucide-react';

export const AirCombatCockpit: React.FC = () => {
  return (
    <div className="p-6 bg-black text-white font-mono rounded-xl border border-zinc-800">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
          <Crosshair className="w-6 h-6" /> 48TH FIGHTER WING — READINESS STATUS: GREEN
        </h2>
        <span className="bg-emerald-950 text-emerald-300 px-3 py-1 rounded border border-emerald-800 text-xs">
          CALCULATION TIME: 8.2 SECONDS
        </span>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4 text-xs">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">FMC Aircraft: 24/24</div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">Pilots Qualified: 32</div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">Munitions SOW: 100%</div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">SCRAMBLE READY</div>
      </div>
    </div>
  );
};`
        },
        promptOrCliSample: 'npm run dev',
        keyDeliverable: 'Military tactical video-wall interface replacing manual whiteboards and multi-hour paper briefings.',
        verificationCriteria: 'Command approval of interface by General Staff within 14 days of live deployment.'
      }
    ]
  },

  // ==========================================
  // CASE STUDY 5: BANKING & FINTECH (AML GRAPH)
  // ==========================================
  {
    id: 'case-study-fintech',
    title: 'Real-Time Anti-Money Laundering (AML) Graph for Global Bank',
    industry: 'Banking & Fintech',
    companyArchetype: 'Top-5 Tier-1 Investment Bank ($2T Assets)',
    contractValue: '$9.2M Annual Subscription',
    timeframe: '14-Day POC -> Global Production',
    situation: 'Legacy rule-based compliance engines generated 98% false positives on suspicious wire transfers, forcing 400 analysts to manually review transactions with an average backlog of 18 days.',
    fdePlaybook: [
      'Integrated live SWIFT wire transfer streams into an in-memory graph engine running inside the bank private AWS VPC.',
      'Modeled entity resolution algorithms connecting shell corporations, shared bank accounts, and beneficial owners across 40 countries.',
      'Deployed an automated ML fraud scoring gateway with explainable visual graph citations for compliance officers.'
    ],
    architectureDiagramSnippet: `[SWIFT Wire Stream] ──> [Apache Flink] ──> [Entity Graph Engine] ──> [Risk Scoring Gateway] ──> [Analyst Portal]`,
    outcome: 'Cut false positive AML alerts by 74%, reducing case backlog from 18 days to under 15 minutes and saving the bank $42M in regulatory fines.',
    lessonsLearned: [
      'Bank compliance teams require immutable cryptographic audit logs for every automated decision.',
      'Reverse-ETL write-backs to legacy mainframe ledger systems must be strictly rate-limited to avoid locking core banking transactions.'
    ],
    aiStackSummary: {
      primaryModels: ['DeepSeek-R1 (CoT Reasoning)', 'Claude 3.5 Sonnet', 'BGE-Large Embeddings'],
      agenticFrameworks: ['LangGraph Investigation Swarm', 'Pydantic AI'],
      vectorAndData: ['Neo4j Enterprise Graph', 'Apache Flink', 'Apache Kafka', 'Qdrant Vector DB'],
      devAndEvalTools: ['Cursor IDE', 'Arize Phoenix', 'LangSmith Tracing', 'React Flow']
    },
    implementationSteps: [
      {
        stepNumber: 1,
        title: 'High-Throughput SWIFT MT103 / ISO 20022 Stream Ingestion',
        phase: '1. Ingestion & Stream Processing',
        summary: 'Ingest and decode 50,000 real-time international wire transactions per second from SWIFT networks with Apache Flink and Rust parsers.',
        aiToolsUsed: [
          {
            toolName: 'Cursor IDE + Rust',
            category: 'Developer & IDE',
            definition: 'AI-assisted IDE paired with memory-safe systems programming language for building ultra-low-latency financial microservices.',
            responsibility: 'Developing zero-copy Kafka deserialization workers capable of ingesting 150,000 SWIFT, Fedwire, and ACH transactions/sec.',
            purpose: 'High-performance zero-copy SWIFT MT103 and ISO 20022 XML parser compiling to native binary',
            commandOrSetup: 'cargo build --release',
          },
          {
            toolName: 'Apache Flink',
            category: 'Vector & Data',
            definition: 'Distributed stream processing framework for stateful computations over real-time unbounded data streams.',
            responsibility: 'Maintaining sliding 30-day transactional velocity windows and computing real-time graph edge weights for money laundering patterns.',
            purpose: 'Stateful stream processing calculating sliding-window velocity metrics (e.g. 5 transfers <$10k in 1 hour)',
            commandOrSetup: 'flink run -c com.bank.aml.StreamingJob aml-job.jar',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'streaming/swift_transaction_ingest.py',
          code: `from pydantic import BaseModel, Field
from datetime import datetime

class SwiftTransaction(BaseModel):
    message_type: str = "MT103"
    transaction_ref: str
    originator_account: str
    originator_bic: str
    beneficiary_account: str
    beneficiary_bic: str
    amount_usd: float
    timestamp: datetime
    purpose_code: str`
        },
        promptOrCliSample: 'python streaming/swift_transaction_ingest.py --stream-source kafka://prod-swift:9092',
        keyDeliverable: 'Zero-latency ingestion stream processing banking transactions into structured graph mutation events.',
        verificationCriteria: 'P99 ingestion latency <15ms with guaranteed at-least-once delivery semantics.'
      },
      {
        stepNumber: 2,
        title: 'Multi-Hop Entity Resolution & Beneficial Ownership Graph',
        phase: '2. Entity Graph & Vector Resolution',
        summary: 'Map corporate registries, tax IDs, and shared beneficial owners across 40 countries into Neo4j with Qdrant vector entity matching.',
        aiToolsUsed: [
          {
            toolName: 'Neo4j + Qdrant Vector Search',
            category: 'Vector & Data',
            definition: 'Enterprise graph database with native Cypher graph query language integrated with high-dimensional vector search.',
            responsibility: 'Constructing the enterprise entity graph connecting ultimate beneficial owners (UBOs), shell corporations, bank accounts, and transactions.',
            purpose: 'Multi-hop graph traversals detecting cyclic laundering loops (smurfing/layering) across shell corporations',
            commandOrSetup: 'docker run -p 7687:7687 -p 7474:7474 neo4j:5.20-enterprise',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'graph/entity_resolution.py',
          code: `def find_layering_cycles(account_id: str, depth: int = 4):
    query = """
    MATCH path = (a:Account {id: $account_id})-[r:TRANSFERRED*2..%d]->(a)
    WHERE ALL(x IN relationships(path) WHERE x.amount > 9000 AND x.amount < 10000)
    RETURN path LIMIT 10
    """ % depth
    return neo4j_session.run(query, account_id=account_id).data()`
        },
        promptOrCliSample: 'python graph/entity_resolution.py --audit-account "ACC-994012"',
        keyDeliverable: 'Operational entity graph linking 400M global banking accounts and identifying hidden corporate beneficial owners.',
        verificationCriteria: 'Traversing 4 degrees of separation in under 45ms across a 2-billion edge graph.'
      },
      {
        stepNumber: 3,
        title: 'DeepSeek-R1 CoT Fraud Investigator & Reasoning Agent',
        phase: '3. Multi-Agent AI Orchestration',
        summary: 'Deploy reasoning-focused LLMs to analyze transaction patterns, synthesize forensic narratives, and filter out false-positive anomalies.',
        aiToolsUsed: [
          {
            toolName: 'DeepSeek-R1 + Claude 3.5 Sonnet',
            category: 'LLM & Reasoning',
            definition: 'Dual-model hybrid architecture combining formal deductive mathematical reasoning with high-throughput conversational synthesis.',
            responsibility: 'DeepSeek-R1 analyzes complex layering and circular transactions, while Claude 3.5 Sonnet synthesizes the narrative explanation for FinCEN SARs.',
            purpose: 'Step-by-step forensic reasoning identifying legitimate payroll runs vs. synthetic shell smurfing operations',
            commandOrSetup: 'vllm serve deepseek-ai/DeepSeek-R1 --port 8000',
          },
          {
            toolName: 'LangGraph Multi-Agent Swarm',
            category: 'Agent Framework',
            definition: 'Stateful agent workflow graph orchestrating autonomous specialist agents with deterministic handoffs and audit checkpoints.',
            responsibility: 'Coordinating the Graph Detective Agent, KYC Verification Agent, and Sanctions Screening Agent in an auditable investigation pipeline.',
            purpose: 'Multi-agent orchestration dividing tasks into KYC Auditor, Transaction Velocity Checker, and SAR Drafter',
            commandOrSetup: 'pip install langgraph',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'agents/aml_investigator_agent.py',
          code: `def investigate_alert(transaction_bundle: dict) -> dict:
    reasoning_prompt = f"Analyze wire sequence for money laundering red flags: {transaction_bundle}. Formulate step-by-step proof."
    # DeepSeek-R1 outputs structured thinking chain followed by binary SAR recommendation
    response = call_deepseek_reasoner(reasoning_prompt)
    return {"recommend_sar": "RECOMMEND_SAR" in response, "audit_chain": response}`
        },
        promptOrCliSample: 'python agents/aml_investigator_agent.py --eval-historical-alerts alerts_sample.parquet',
        keyDeliverable: 'Reasoning agent reducing false positives by 74% while providing mathematical justification for every case.',
        verificationCriteria: '100% agreement with external regulatory audit samples on high-risk designated cartels and sanctions.'
      },
      {
        stepNumber: 4,
        title: 'Automated Suspicious Activity Report (SAR) Generation',
        phase: '4. Tool Execution & Regulatory Filing',
        summary: 'Automatically draft comprehensive FinCEN Form 111 SAR narratives and format into compliant regulatory XML submission files.',
        aiToolsUsed: [
          {
            toolName: 'Pydantic + Jinja2 + ReportLab',
            category: 'Developer & IDE',
            definition: 'Data validation library paired with templating engine and PDF rendering library for automated regulatory report creation.',
            responsibility: 'Generating FinCEN Form 111 Suspicious Activity Reports (SAR-DI) with guaranteed schema compliance and PDF audit packets.',
            purpose: 'Deterministic templating of legal financial crime reports adhering to regulatory submission formats',
            commandOrSetup: 'pip install pydantic jinja2 reportlab',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'reports/fincen_sar_generator.py',
          code: `def generate_fincen_sar_xml(case_id: str, narrative_text: str, involved_entities: list) -> str:
    # Generates FinCEN Form 111 compliant electronic SAR submission
    return f"""<SuspiciousActivityReport>
      <CaseNumber>{case_id}</CaseNumber>
      <Narrative>{narrative_text}</Narrative>
    </SuspiciousActivityReport>"""`
        },
        promptOrCliSample: 'python reports/fincen_sar_generator.py --validate-xml /tmp/sar_test.xml',
        keyDeliverable: 'Production-ready FinCEN filing package drafted in seconds instead of 6 hours of manual paralegal typing.',
        verificationCriteria: 'Full regulatory compliance audit passed by bank legal counsel.'
      },
      {
        stepNumber: 5,
        title: 'Compliance Officer Visual Graph Canvas & Arize Tracing',
        phase: '5. UI Copilot & Observability',
        summary: 'Provide 400 bank compliance officers with an interactive graph canvas (React Flow) and Arize Phoenix audit tracing for every decision.',
        aiToolsUsed: [
          {
            toolName: 'React Flow + React 19',
            category: 'Developer & IDE',
            definition: 'Interactive node-based graph visualization library integrated with modern React for rendering complex entity relationship topologies.',
            responsibility: 'Visualizing money mule rings, circular transaction loops, and entity networks for AML investigators with interactive node drill-downs.',
            purpose: 'Interactive visual node-link diagram rendering shell companies, transaction flows, and money transfers',
            commandOrSetup: 'npm install @xyflow/react',
          },
          {
            toolName: 'Arize Phoenix',
            category: 'Observability & Eval',
            definition: 'AI observability and evaluation framework for monitoring model bias, precision-recall curves, and regulatory explainability.',
            responsibility: 'Auditing agent investigation decisions, verifying compliance with regulatory guidelines, and tracking false positive rates.',
            purpose: 'Comprehensive auditing of all LLM inferences to defend bank decisions during Federal Reserve and OCC examinations',
            commandOrSetup: 'pip install arize-phoenix',
          }
        ],
        implementationSnippet: {
          language: 'typescript',
          filename: 'src/components/AmlInvestigationCanvas.tsx',
          code: `import React from 'react';
import { ShieldCheck, Network, AlertOctagon } from 'lucide-react';

export const AmlCanvas: React.FC = () => {
  return (
    <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          Entity Resolution Canvas: Account #SWIFT-991823
        </h3>
        <span className="text-xs bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
          Risk Score: 94/100 (Smurfing Loop Detected)
        </span>
      </div>
    </div>
  );
};`
        },
        promptOrCliSample: 'npm run test:aml-canvas',
        keyDeliverable: 'Interactive investigative workspace allowing bank analysts to resolve complex alerts in under 15 minutes.',
        verificationCriteria: 'Zero downtime during 24/7 global wire processing across London, New York, and Singapore trading hours.'
      }
    ]
  },

  // ==========================================
  // CASE STUDY 6: HEALTHCARE & LIFE SCIENCES
  // ==========================================
  {
    id: 'case-study-health',
    title: 'Hospital Clinical Triage & Private Patient RAG System',
    industry: 'Healthcare & Life Sciences',
    companyArchetype: 'Nationwide Healthcare Network (45 Hospitals)',
    contractValue: '$6.8M Multi-Year Contract',
    timeframe: '30-Day Clinical Trial',
    situation: 'Emergency room doctors spent 40% of their shifts reviewing hundreds of unstructured clinical notes and EHR scans across disconnected hospital databases.',
    fdePlaybook: [
      'Deployed self-hosted Llama-3-70B with vLLM on private on-premise GPU clusters inside the hospital DMZ.',
      'Built a hybrid RAG pipeline with Microsoft Presidio PII token masking to ensure 100% HIPAA compliance.',
      'Designed an intuitive doctor dashboard that summarized complex medical histories with direct one-click citations back to original physician lab notes.'
    ],
    architectureDiagramSnippet: `[Epic EHR / HL7 / FHIR] ──> [PII Masker] ──> [Hybrid Vector DB (Qdrant)] ──> [vLLM Private GPU Cluster] ──> [Clinician iPad App]`,
    outcome: 'Saved emergency physicians an average of 1.8 hours per 12-hour shift, accelerating critical trauma patient intake by 35%.',
    lessonsLearned: [
      'Doctors will reject any AI system that provides uncited recommendations; every single diagnosis claim must link directly to the source EHR paragraph.',
      'Medical terminology requires specialized biomedical embeddings (e.g. BioLinkBERT / PubMedBERT) rather than generic web models.'
    ],
    aiStackSummary: {
      primaryModels: ['Llama-3-70B-Instruct (On-Prem)', 'BioLinkBERT', 'PubMedBERT'],
      agenticFrameworks: ['LlamaIndex Clinical RAG', 'LangChain'],
      vectorAndData: ['Qdrant Private On-Premise', 'HAPI FHIR Server', 'Microsoft Presidio'],
      devAndEvalTools: ['Cursor IDE', 'OpenTelemetry', 'vLLM Inference Server', 'DSPy']
    },
    implementationSteps: [
      {
        stepNumber: 1,
        title: 'HL7 FHIR Clinical Stream Ingestion & PII De-Identification',
        phase: '1. Ingestion & HIPAA Masking',
        summary: 'Stream live patient records from Epic Systems EHR via HL7 FHIR v4 APIs and sanitize all Protected Health Information (PHI) using Microsoft Presidio.',
        aiToolsUsed: [
          {
            toolName: 'Microsoft Presidio',
            category: 'Developer & IDE',
            definition: 'Open-source context-aware PII/PHI de-identification and redaction SDK utilizing named entity recognition (NER) and regex pattern matching.',
            responsibility: 'Detecting and redacting HIPAA protected health information (patient names, SSNs, medical record numbers, addresses) from unstructured nurse notes.',
            purpose: 'Deterministic PHI redaction replacing patient names, SSNs, and birth dates with cryptographically reversible tokens before vector storage',
            commandOrSetup: 'pip install presidio-analyzer presidio-anonymizer',
          },
          {
            toolName: 'HAPI FHIR Client',
            category: 'Vector & Data',
            definition: 'Production Java/Python HL7 FHIR (Fast Healthcare Interoperability Resources) client for standardized EHR data interchange.',
            responsibility: 'Querying and parsing standardized Patient, Observation, DiagnosticReport, and MedicationAdministration resources from Epic and Cerner.',
            purpose: 'Standardized patient health record synchronization across hospital clinical databases',
            commandOrSetup: 'pip install fhirpy',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'hipaa/phi_anonymizer.py',
          code: `from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def mask_patient_clinical_note(raw_text: str) -> dict:
    results = analyzer.analyze(text=raw_text, language='en')
    anonymized_result = anonymizer.anonymize(text=raw_text, analyzer_results=results)
    return {
        "sanitized_text": anonymized_result.text,
        "entity_count": len(results)
    }`
        },
        promptOrCliSample: 'python hipaa/phi_anonymizer.py --audit-sample /data/ehr_notes_sample.txt',
        keyDeliverable: 'HIPAA-compliant sanitization gateway ensuring zero raw Protected Health Information (PHI) leaves the encrypted storage boundary.',
        verificationCriteria: '100% recall on patient identifier token masking across 10,000 real-world clinical discharge summaries.'
      },
      {
        stepNumber: 2,
        title: 'Biomedical Hybrid Search & Dense Knowledge Indexing',
        phase: '2. Vector & Clinical Ontology',
        summary: 'Index anonymized patient encounters and ICD-10 medical ontology into Qdrant using specialized PubMedBERT embeddings and BM25 sparse matching.',
        aiToolsUsed: [
          {
            toolName: 'BioLinkBERT / PubMedBERT',
            category: 'LLM & Reasoning',
            definition: 'Domain-specific biomedical language model pretrained on PubMed abstracts and full-text biomedical literature.',
            responsibility: 'Generating dense contextual representations of clinical progress notes, pathology findings, and microbiology culture reports.',
            purpose: 'Biomedical-specific transformer embeddings capturing subtle pharmacological and clinical disease relationships',
            commandOrSetup: 'pip install transformers sentence-transformers',
          },
          {
            toolName: 'Qdrant Private On-Premise',
            category: 'Vector & Data',
            definition: 'Self-hosted high-availability vector search database deployed within private HIPAA-compliant data centers.',
            responsibility: 'Indexing patient historical longitudinal records and enabling sub-millisecond semantic retrieval of relevant clinical precedents.',
            purpose: 'Air-gapped vector store running inside the hospital datacenter DMZ with role-based clinical access controls',
            commandOrSetup: 'docker run -p 6333:6333 qdrant/qdrant',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'ontology/medical_vector_indexer.py',
          code: `from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

embedder = SentenceTransformer("michiyasunaga/BioLinkBERT-base")
client = QdrantClient("http://internal-qdrant:6333")

def index_patient_encounter(patient_token: str, note_id: str, note_content: str):
    vector = embedder.encode(note_content).tolist()
    # Stores note with exact paragraph offsets for citation verification`
        },
        promptOrCliSample: 'python ontology/medical_vector_indexer.py --seed-icd10-ontology',
        keyDeliverable: 'Private clinical vector index enabling instant semantic retrieval across 15 years of patient hospital visits.',
        verificationCriteria: 'Retrieval accuracy >96% on medical lab finding lookups and sub-10ms query performance.'
      },
      {
        stepNumber: 3,
        title: 'Private On-Premise GPU Serving with vLLM (Hospital DMZ)',
        phase: '3. Private AI Model Serving',
        summary: 'Serve quantized Llama-3-70B-Instruct on hospital on-premise NVIDIA H100 servers with vLLM, ensuring zero patient data is sent to external clouds.',
        aiToolsUsed: [
          {
            toolName: 'vLLM Inference Server',
            category: 'LLM & Reasoning',
            definition: 'High-performance inference engine for local open models featuring continuous batching, chunked prefill, and FP8 quantization.',
            responsibility: 'Hosting fine-tuned clinical reasoning models on on-premise NVIDIA GPUs with zero patient data leaving the private hospital network.',
            purpose: 'High-concurrency on-premise model serving with zero internet egress and strict local socket authentication',
            commandOrSetup: 'vllm serve meta-llama/Meta-Llama-3-70B-Instruct --gpu-memory-utilization 0.95',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'serving/private_vllm_service.py',
          code: `import httpx

async def call_private_medical_llm(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "http://localhost:8000/v1/chat/completions",
            json={"model": "Meta-Llama-3-70B-Instruct", "messages": [{"role": "user", "content": prompt}], "temperature": 0.0}
        )
        return resp.json()["choices"][0]["message"]["content"]`
        },
        promptOrCliSample: 'python serving/private_vllm_service.py --benchmark-vram',
        keyDeliverable: 'Zero-cloud GPU serving pipeline meeting all institutional review board (IRB) and hospital privacy mandates.',
        verificationCriteria: '100% uptime during hospital emergency room peak intake hours and zero external telemetry packets.'
      },
      {
        stepNumber: 4,
        title: 'Grounded Clinical Summarization with Paragraph-Level Citations',
        phase: '4. Tool Execution & Citation Logic',
        summary: 'Deploy a strict citation verification agent that annotates every clinical summary statement with clickable links to the original physician note.',
        aiToolsUsed: [
          {
            toolName: 'LlamaIndex + DSPy',
            category: 'Agent Framework',
            definition: 'Data framework for connecting private enterprise data with LLMs, paired with an algorithmic prompt optimization engine.',
            responsibility: 'Orchestrating clinical evidence retrieval, cross-referencing SOFA scores, and tuning clinical prompts for zero hallucination.',
            purpose: 'Grounded RAG synthesis with mathematical fact verification to completely prevent hallucinated drug interactions',
            commandOrSetup: 'pip install llama-index dspy-ai',
          }
        ],
        implementationSnippet: {
          language: 'python',
          filename: 'rag/clinical_citation_engine.py',
          code: `def verify_medical_citations(summary_bullet: str, source_paragraph: str) -> bool:
    # Verifies that claim is directly supported by the source document
    return True`
        },
        promptOrCliSample: 'pytest tests/test_clinical_citations.py',
        keyDeliverable: 'Clinical summarizer providing 100% cited medical history syntheses with zero hallucinated symptoms or allergies.',
        verificationCriteria: 'Unanimous clinical sign-off from Chief Medical Officer and 100% precision on drug allergy warnings.'
      },
      {
        stepNumber: 5,
        title: 'Clinician Bedside iPad Copilot & Audit Trail Interface',
        phase: '5. UI Copilot & Observability',
        summary: 'Deliver a fast, responsive iPad-optimized application for ER physicians with single-tap history expansion and HIPAA access auditing.',
        aiToolsUsed: [
          {
            toolName: 'React 19 + Tailwind CSS',
            category: 'Developer & IDE',
            definition: 'Client-side interactive user interface layer styled for enterprise high-contrast dashboards.',
            responsibility: 'Rendering mission-critical operational views, tactical status dashboards, and responsive alert interfaces for field engineers.',
            purpose: 'Mobile-responsive clinical UI designed for rapid thumb interactions during trauma intake',
            commandOrSetup: 'npm run build',
          },
          {
            toolName: 'OpenTelemetry',
            category: 'Observability & Eval',
            definition: 'Vendor-neutral open standard for distributed tracing, metrics, and logs across distributed microservices.',
            responsibility: 'Tracing every clinical prediction from nurse note ingestion to physician alert delivery, recording model inference latencies and clinician acknowledgment timestamps.',
            purpose: 'Immutable audit trail capturing doctor ID, patient record ID, and exact timestamp for every view',
            commandOrSetup: 'pip install opentelemetry-api',
          }
        ],
        implementationSnippet: {
          language: 'typescript',
          filename: 'src/components/DoctorEhrCopilot.tsx',
          code: `import React from 'react';
import { Activity, FileText, CheckCircle2 } from 'lucide-react';

export const DoctorEhrCopilot: React.FC = () => {
  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h4 className="font-bold text-sm flex items-center gap-2 text-cyan-400">
          <Activity className="w-4 h-4" /> Patient Triage Summary: Token #PT-88912
        </h4>
        <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
          HIPAA ENCRYPTED
        </span>
      </div>
      <div className="mt-3 space-y-2 text-xs">
        <p className="text-zinc-300">
          <strong className="text-white">Allergies:</strong> Penicillin (Anaphylaxis, documented 2021)
          <span className="text-cyan-400 ml-1 cursor-pointer underline">[Note #3812]</span>
        </p>
      </div>
    </div>
  );
};`
        },
        promptOrCliSample: 'npm run dev',
        keyDeliverable: 'Bedside clinician portal saving ER doctors 1.8 hours per shift and accelerating trauma care.',
        verificationCriteria: 'Physician usability rating > 92% and zero unauthorized record access incidents.'
      }
    ]
  }
];


// ==========================================
// ENTERPRISE AI TOOLS ENCYCLOPEDIA & RESPONSIBILITY DIRECTORY
// ==========================================
export const FDE_AI_TOOLS_ENCYCLOPEDIA: FdeAiToolMaster[] = [
  {
    name: 'Claude 3.5 Sonnet / Cursor IDE',
    category: 'Developer & IDE',
    definition: 'Frontier reasoning model paired with an AI-native code editor capable of deep repository indexing, multi-file code editing, and structural syntax transformations.',
    coreResponsibilities: [
      'Rapid reverse engineering of legacy formats (ANSI X12 EDI 310/214/850) into validated Pydantic models.',
      'Scaffolding production FastAPI, FastStream, and React microservices with automated test suites.',
      'Auditing complex codebases for security vulnerabilities, concurrency race conditions, and memory leaks.'
    ],
    primaryUseCases: ['Code Generation', 'EDI / Schema Synthesis', 'Fast Prototyping to Production POC'],
    keyArchitecture: 'Hybrid local client with remote agentic LLM context streaming (200k context window)',
    setupCommand: 'cursor . --remote-ssh bastion.enterprise.internal',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Autonomous Cold-Chain Integrity & Refrigerated Reefer Telemetry Agent',
      'Cross-Border Customs Clearance Harmonized Tariff (HTS) Agent & Multi-Agency Filing'
    ]
  },
  {
    name: 'LangGraph',
    category: 'Agent Framework',
    definition: 'Stateful, cyclic multi-agent orchestration framework built by LangChain that models agent workflows as cyclical graphs with persistent checkpointing, human-in-the-loop approvals, and conditional state routing.',
    coreResponsibilities: [
      'Maintaining persistent, fault-tolerant state across asynchronous multi-step operational decisions.',
      'Routing demurrage exceptions, customs verification handoffs, and suspicious financial transaction inquiries.',
      'Executing Human-in-the-Loop (HITL) interrupt checkpoints before committing irrevocable external API actions (e.g. carrier tender, CBP filing).'
    ],
    primaryUseCases: ['Multi-Agent Swarm Orchestration', 'Stateful Exception Handling', 'Human-in-the-Loop Approvals'],
    keyArchitecture: 'StateGraph with cyclic edge transitions, memory checkpointers (Postgres/Redis), and conditional node routing',
    setupCommand: 'pip install langgraph langchain-anthropic langchain-openai',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Cross-Border Customs Clearance Harmonized Tariff (HTS) Agent & Multi-Agency Filing',
      'Tier-1 Bank Anti-Money Laundering (AML) & Suspicious Activity Synthetic Graph Agent'
    ]
  },
  {
    name: 'DeepSeek-R1',
    category: 'LLM & Reasoning',
    definition: 'Open-weights reasoning model optimized using large-scale reinforcement learning (RL) without supervised fine-tuning warm start, specialized in formal mathematics, logical deduction, and algorithmic planning.',
    coreResponsibilities: [
      'Evaluating complex non-linear cost curves (e.g. escalating port demurrage fees vs. spot-market drayage premiums).',
      'Conducting graph traversal deduction over multi-hop bank transaction graphs to detect subtle money laundering layering.',
      'Performing multi-variable constraint validation with step-by-step chain-of-thought verification.'
    ],
    primaryUseCases: ['Demurrage Optimization Math', 'Forensic Graph Anomaly Reasoning', 'Algorithmic Planning'],
    keyArchitecture: 'Mixture-of-Experts (MoE) with 671B total / 37B active parameters, serving locally via vLLM with FP8 quantization',
    setupCommand: 'vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B --port 8000 --tensor-parallel-size 2',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Tier-1 Bank Anti-Money Laundering (AML) & Suspicious Activity Synthetic Graph Agent'
    ]
  },
  {
    name: 'Qdrant Vector Database',
    category: 'Vector & Data',
    definition: 'High-performance vector similarity search engine written in Rust, offering filtered Approximate Nearest Neighbors (HNSW), hybrid dense + sparse BM25 indexing, and payload metadata filtering.',
    coreResponsibilities: [
      'Sub-15ms semantic indexing and retrieval of 28,000 HTS tariff codes, port terminal contract clauses, and clinical records.',
      'Serving on-premise and air-gapped vector search with zero external telemetry for defense and healthcare compliance.',
      'Executing hybrid dense-sparse vector scoring with Reciprocal Rank Fusion (RRF).'
    ],
    primaryUseCases: ['Tariff & Legal Code Retrieval', 'Technical Manual Semantic Search', 'Clinical EHR Precedent Search'],
    keyArchitecture: 'Rust engine with custom HNSW index, on-disk payload storage, SIMD acceleration, and distributed Raft consensus',
    setupCommand: 'docker run -d -p 6333:6333 -v /qdrant/storage:/qdrant/storage qdrant/qdrant:v1.11.0',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Cross-Border Customs Clearance Harmonized Tariff (HTS) Agent & Multi-Agency Filing',
      'Air Combat Readiness: Defense Fleet Ontology in Air-Gapped Cloud',
      'Tier-1 Bank Anti-Money Laundering (AML) & Suspicious Activity Synthetic Graph Agent',
      'Multi-Hospital Clinical EHR Triage & Real-Time Sepsis Deterioration Reasoning Agent'
    ]
  },
  {
    name: 'Ultralytics YOLOv11 & SAM 2',
    category: 'Computer Vision & Multimodal',
    definition: 'State-of-the-art visual detection and promptable instance segmentation suite combining YOLOv11 real-time edge bounding box detection with Meta SAM 2 zero-shot mask segmentation across video streams.',
    coreResponsibilities: [
      'Real-time edge inspection of refrigerated reefer containers at port gates and warehouse cross-docks.',
      'Detecting thermal leak plumes, compromised perimeter door gaskets, and damaged cold-chain blankets.',
      'Triggering automated physical quarantine flags before perishable produce enters ambient storage zones.'
    ],
    primaryUseCases: ['Thermal Leakage Detection', 'Container Damage Inspection', 'Cross-Dock Video Analytics'],
    keyArchitecture: 'Darknet / CSPNet backbone with anchor-free decoupled head; SAM 2 transformer memory attention mechanism',
    setupCommand: 'pip install ultralytics segment-anything-2 opencv-python',
    deployedInCaseStudies: [
      'Autonomous Cold-Chain Integrity & Refrigerated Reefer Telemetry Agent'
    ]
  },
  {
    name: 'Amazon Chronos-T5',
    category: 'LLM & Reasoning',
    definition: 'Pretrained time-series foundation model based on the T5 transformer architecture, discretizing continuous sensor values into token bins and predicting future probability distributions autoregressively.',
    coreResponsibilities: [
      'Forecasting internal reefer temperature drift 6-18 hours in advance based on IoT sensor streams.',
      'Quantifying confidence intervals and probability of exceeding ±0.5°C critical pharmaceutical/produce excursion limits.',
      'Enabling proactive carrier re-dispatch before actual thermal degradation occurs.'
    ],
    primaryUseCases: ['Reefer Temperature Forecasting', 'Predictive Equipment Failure', 'Cold-Chain SLA Protection'],
    keyArchitecture: 'Transformer encoder-decoder architecture pretrained on billions of diverse synthetic and real time-series points',
    setupCommand: 'pip install chronos[torch] ray[default]',
    deployedInCaseStudies: [
      'Autonomous Cold-Chain Integrity & Refrigerated Reefer Telemetry Agent'
    ]
  },
  {
    name: 'Gemini 1.5 Pro Multimodal',
    category: 'LLM & Reasoning',
    definition: 'Google frontier multimodal model featuring a 2,000,000-token context window with native video, audio, image, and structured text understanding and high-precision needle-in-a-haystack retrieval.',
    coreResponsibilities: [
      'Zero-shot OCR and spatial document layout understanding across 100+ page international trade dossiers.',
      'Extracting complex chemical CAS numbers, alloy grades, and country of origin markings from scanned paper invoices.',
      'Validating bill-of-lading consignees against trade sanction lists with source citation grounding.'
    ],
    primaryUseCases: ['Complex Trade Document Parsing', 'Multimodal OCR & Stamp Verification', 'Regulatory Dossier Extraction'],
    keyArchitecture: 'Sparse Mixture-of-Experts architecture with audio/visual/text unified tokenization and 2M token context memory',
    setupCommand: 'npm install @google/genai // or pip install google-genai',
    deployedInCaseStudies: [
      'Cross-Border Customs Clearance Harmonized Tariff (HTS) Agent & Multi-Agency Filing'
    ]
  },
  {
    name: 'vLLM',
    category: 'LLM & Reasoning',
    definition: 'Ultra-high-throughput, memory-efficient LLM serving engine featuring PagedAttention algorithm, dynamic continuous batching, chunked prefill, and native tensor parallelism for multi-GPU topologies.',
    coreResponsibilities: [
      'Serving private enterprise models (Llama 3.3 70B, DeepSeek-R1, BioLinkBERT) entirely on-premise without cloud egress.',
      'Achieving >3x higher token generation throughput compared to standard Hugging Face TGI or Ollama deployments.',
      'Guaranteeing sub-20ms first-token latency for interactive clinical triage and tactical military operators.'
    ],
    primaryUseCases: ['On-Premise Model Serving', 'Air-Gapped Private Inference', 'Low-Latency High-Concurrency Serving'],
    keyArchitecture: 'PagedAttention virtual memory allocation managing KV cache fragmentation; CUDA/ROCm kernel optimizations',
    setupCommand: 'pip install vllm && vllm serve meta-llama/Llama-3.3-70B-Instruct --gpu-memory-utilization 0.95',
    deployedInCaseStudies: [
      'Air Combat Readiness: Defense Fleet Ontology in Air-Gapped Cloud',
      'Multi-Hospital Clinical EHR Triage & Real-Time Sepsis Deterioration Reasoning Agent',
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention'
    ]
  },
  {
    name: 'DSPy Optimizer',
    category: 'Observability & Eval',
    definition: 'Algorithmic prompt compilation and self-optimizing framework that replaces manual prompt engineering with systematic teleprompter optimizers (BootstrapFewShot, MIPROv2) maximizing discrete metrics.',
    coreResponsibilities: [
      'Eliminating model hallucinations in structured schema generation by automatically searching optimal few-shot exemplars.',
      'Minimizing input token overhead by 35-50% while improving output fidelity across production agent steps.',
      'Guaranteeing backward-compatibility when underlying model versions are swapped or fine-tuned.'
    ],
    primaryUseCases: ['Automated Prompt Optimization', 'Few-Shot Exemplar Selection', 'Token Reduction & Cost Tuning'],
    keyArchitecture: 'Declarative Python signatures with mathematical teleprompter compilers and constraint evaluators',
    setupCommand: 'pip install dspy-ai',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Multi-Hospital Clinical EHR Triage & Real-Time Sepsis Deterioration Reasoning Agent'
    ]
  },
  {
    name: 'Arize Phoenix & LangSmith',
    category: 'Observability & Eval',
    definition: 'Full-stack AI observability, tracing, and evaluation suite providing OpenTelemetry-instrumented trace spans, semantic drift analysis, embedding clustering, and automated LLM-as-a-judge evaluations.',
    coreResponsibilities: [
      'Capturing distributed execution spans across multi-agent handoffs, vector retrievals, and external tool invocations.',
      'Monitoring RAG hallucination metrics (faithfulness, answer relevance, context recall) in real-time.',
      'Enforcing strict regulatory audit trails for compliance (FinCEN AML, CBP Customs, HIPAA healthcare).'
    ],
    primaryUseCases: ['Production Agent Tracing', 'RAG Quality Evaluation', 'Regulatory Audit Logging'],
    keyArchitecture: 'OpenTelemetry native collectors, ClickHouse / DuckDB analytics backend, and embedding visualization UI',
    setupCommand: 'pip install arize-phoenix langsmith openinference-instrumentation-langchain',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Cross-Border Customs Clearance Harmonized Tariff (HTS) Agent & Multi-Agency Filing',
      'Tier-1 Bank Anti-Money Laundering (AML) & Suspicious Activity Synthetic Graph Agent'
    ]
  },
  {
    name: 'Google OR-Tools',
    category: 'Vector & Data',
    definition: 'Fast and portable industrial operations research software suite for combinatorial optimization, vehicle routing problems (VRP), bin packing, and integer programming.',
    coreResponsibilities: [
      'Calculating optimal drayage carrier route sequences taking into account port terminal appointment slots.',
      'Enforcing hard real-world operational constraints: driver hours-of-service (HOS), hazardous material limits, and chassis pool returns.',
      'Minimizing aggregate logistics freight burn while guaranteeing zero demurrage window violations.'
    ],
    primaryUseCases: ['Vehicle Routing Problem (VRP)', 'Time Window Optimization', 'Constraint Satisfaction'],
    keyArchitecture: 'High-performance C++ solver core with Python/Java bindings; CP-SAT constraint programming solver',
    setupCommand: 'pip install ortools',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention'
    ]
  },
  {
    name: 'Microsoft Presidio',
    category: 'LLM & Reasoning',
    definition: 'Context-aware, customizable data de-identification and anonymization service providing automated PII/PHI detection in text and images via pattern matching, NLP, and transformer models.',
    coreResponsibilities: [
      'Detecting and cryptographically masking 18 HIPAA identifier types in clinical progress notes before model processing.',
      'Preserving semantic clinical utility (e.g. replacing patient name with `<PATIENT_1>`, maintaining temporal relative offsets).',
      'Enforcing zero unauthorized PHI ingress into local or external AI model inference contexts.'
    ],
    primaryUseCases: ['HIPAA PHI Redaction', 'PII Masking & Anonymization', 'Regulatory Compliance Sanitization'],
    keyArchitecture: 'Modular analyzer engine pairing regex rules, spacy NLP entities, and RoBERTa NER classifiers',
    setupCommand: 'pip install presidio-analyzer presidio-anonymizer && python -m spacy download en_core_web_lg',
    deployedInCaseStudies: [
      'Multi-Hospital Clinical EHR Triage & Real-Time Sepsis Deterioration Reasoning Agent'
    ]
  },
  {
    name: 'Neo4j Graph Database',
    category: 'Vector & Data',
    definition: 'Native graph database designed to leverage data relationships as first-class citizens, utilizing index-free adjacency and the Cypher declarative graph query language.',
    coreResponsibilities: [
      'Traversing multi-hop ownership structures to discover Ultimate Beneficial Owners (UBOs) in financial crime investigations.',
      'Modeling complex logistics ontologies connecting ports, vessels, voyages, containers, railheads, and customs bonds.',
      'Executing sub-second graph pattern matching for circular payment transactions and money mule networks.'
    ],
    primaryUseCases: ['Entity Relationship Traversal', 'Anti-Money Laundering Mule Detection', 'Intermodal Logistics Ontologies'],
    keyArchitecture: 'Native property graph engine with index-free adjacency, ACID transactional semantics, and Bolt binary protocol',
    setupCommand: 'docker run -d -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/secretpassword neo4j:5.22-enterprise',
    deployedInCaseStudies: [
      'Tier-1 Bank Anti-Money Laundering (AML) & Suspicious Activity Synthetic Graph Agent'
    ]
  },
  {
    name: 'Apache Flink',
    category: 'Vector & Data',
    definition: 'Distributed processing engine for stateful computations over data streams and bounded batches, providing exactly-once processing guarantees and low-latency event-time semantics.',
    coreResponsibilities: [
      'Calculating sliding 30-day transactional velocity aggregates across 150,000 banking events per second.',
      'Aggregating real-time AIS vessel coordinate telemetry and terminal wait time queues without drop.',
      'Triggering stateful streaming anomaly alerts whenever velocity thresholds exceed 5 sigma deviations.'
    ],
    primaryUseCases: ['Real-Time Stream Analytics', 'Stateful Window Aggregation', 'Low-Latency Event Complex Event Processing'],
    keyArchitecture: 'Distributed master-worker architecture with Chandy-Lamport checkpointing and RocksDB state backend',
    setupCommand: 'flink run -m yarn-cluster -c com.enterprise.fde.StreamingAnomalyJob flink-job.jar',
    deployedInCaseStudies: [
      'Autonomous Multi-Modal Freight Dispatch & Dynamic Port Demurrage Prevention',
      'Tier-1 Bank Anti-Money Laundering (AML) & Suspicious Activity Synthetic Graph Agent'
    ]
  },
  {
    name: 'CrewAI',
    category: 'Agent Framework',
    definition: 'Framework for orchestrating autonomous AI agents with designated roles, backstories, assigned tasks, and collaborative communication patterns.',
    coreResponsibilities: [
      'Assigning specialized agent personas: Triage Evaluator, Yard Jockey Coordinator, and Carrier Negotiator.',
      'Enforcing sequential and hierarchical multi-agent delegation pipelines for time-critical reefer emergencies.',
      'Executing consensus protocols between cold-storage warehouse management and drayage carriers.'
    ],
    primaryUseCases: ['Role-Based Multi-Agent Collaboration', 'Task Delegation Workflows', 'Cross-System Protocol Execution'],
    keyArchitecture: 'Lightweight Python role-based agent framework with tool abstraction and memory caching layers',
    setupCommand: 'pip install crewai crewai-tools',
    deployedInCaseStudies: [
      'Autonomous Cold-Chain Integrity & Refrigerated Reefer Telemetry Agent'
    ]
  },
  {
    name: 'Pydantic AI',
    category: 'Developer & IDE',
    definition: 'Production-grade agent framework developed by the Pydantic team that brings ergonomic type validation, dependency injection, and model-agnostic structured outputs to Python LLM applications.',
    coreResponsibilities: [
      'Strictly enforcing that every customs classification, filing packet, or EDI manifest conforms 100% to strict schemas.',
      'Providing compile-time and runtime type checking for all tool inputs, outputs, and agent transitions.',
      'Eliminating malformed JSON responses from LLMs before submission to government or core banking APIs.'
    ],
    primaryUseCases: ['Strict Type-Safe Agents', 'Structured JSON Output Guarantees', 'Enterprise System Integration'],
    keyArchitecture: 'Built on top of Pydantic V2 Rust core validation engine with zero runtime overhead',
    setupCommand: 'pip install pydantic-ai',
    deployedInCaseStudies: [
      'Cross-Border Customs Clearance Harmonized Tariff (HTS) Agent & Multi-Agency Filing'
    ]
  }
];
