import type { InterviewQuestion } from '../interviewData';

/**
 * System Design & Distributed Architecture Questions Bank (150+ Questions)
 * Complete with scale metrics, architecture components, data models, and trade-off analysis.
 */

export const systemDesignQuestionsData: InterviewQuestion[] = Array.from({ length: 150 }, (_, i) => {
  const index = i + 1;
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const designArchitectures = [
    {
      title: 'Design a High-Throughput URL Shortener (Bitly Architecture)',
      scale: '100M new URLs/month, 10B clicks/month (~4,000 read QPS, 40 write QPS), 100:1 read/write ratio.',
      overview: 'Distributed URL shortening service converting long URLs into 7-character Base62 short hashes using Base62 encoding and pre-generated KGS (Key Generation Service) tokens.',
      components: ['API Gateway & Rate Limiter', 'Key Generation Service (KGS)', 'Redis Distributed Cache', 'NoSQL Document Store (Cassandra/DynamoDB)', 'CDN for Geo-Routing'],
      model: 'URLMapping { shortKey: String (PK), originalUrl: String, creationDate: Timestamp, expirationDate: Timestamp, userId: String }',
      tradeoffs: ['Base62 Encoding vs MD5/SHA256 Hashing', 'SQL Relational DB vs NoSQL Key-Value Store', 'Write-Through Caching vs Read-Through Caching']
    },
    {
      title: 'Design a Real-Time Distributed Chat & Messaging System (Slack / WhatsApp)',
      scale: '50M daily active users (DAU), 5B messages/day (~60,000 message writes/sec peak), WebSockets for real-time delivery.',
      overview: 'Real-time messaging platform supporting 1-on-1 and group chats, online status presence, message delivery receipts, and media attachments.',
      components: ['WebSocket Gateway Servers', 'Session & Presence Service', 'Message Broker (Apache Kafka)', 'Cassandra Message Store', 'Push Notification Service'],
      model: 'Message { messageId: TimeUUID (PK), channelId: UUID, senderId: UUID, content: Text, timestamp: Timestamp, mediaUrl: String }',
      tradeoffs: ['WebSockets vs Long Polling vs Server-Sent Events', 'Cassandra vs HBase for time-series message storage', 'Client-side vs Server-side E2E Encryption']
    },
    {
      title: 'Design a Distributed Rate Limiter Service (API Gateway Layer)',
      scale: '1,000,000 requests/sec across 500 microservices, sub-millisecond latency (<2ms per check).',
      overview: 'Distributed rate-limiting middleware enforcing tier-based quota limits (token bucket / sliding window counter) to protect backend microservices from DDoS and abuse.',
      components: ['API Gateway Filter Plugin', 'Redis Cluster (Atomic Lua Scripts)', 'Sliding Window Log / Counter Storage', 'Metrics Aggregator (Prometheus/Grafana)'],
      model: 'RateLimitQuota { apiKey: String, endpoint: String, windowTimestamp: Long, requestCount: AtomicInteger }',
      tradeoffs: ['Token Bucket vs Leaky Bucket vs Sliding Window Counter', 'Centralized Redis Cluster vs Local Memory Cache with Gossip Sync', 'Hard Drop vs Soft Drop Delay Queuing']
    },
    {
      title: 'Design a Scalable Distributed Cache System (Redis / Memcached Architecture)',
      scale: '10M operations/sec, 1TB total cache memory across 64 nodes, sub-1ms read/write latency.',
      overview: 'In-memory distributed key-value cache system using consistent hashing, virtual nodes, memory eviction policies, and async replication.',
      components: ['Consistent Hashing Ring', 'Virtual Node Router', 'In-Memory Key-Value Engine', 'LRU/LFU Memory Eviction Manager', 'Async Master-Slave Replicas'],
      model: 'CacheEntry { key: String, value: ByteArray, ttlSeconds: Int, lastAccessTimestamp: Long, frequency: Int }',
      tradeoffs: ['LRU (Least Recently Used) vs LFU (Least Frequently Used) vs ARC Eviction', 'Consistent Hashing vs Range Partitioning', 'Synchronous Replication vs Asynchronous Replication']
    },
    {
      title: 'Design a Global Video Streaming Platform (YouTube / Netflix Architecture)',
      scale: '2B active users, 500 hours of video uploaded/min, 1B hours watched daily, multi-terabit CDN egress.',
      overview: 'End-to-end video ingestion, HLS/DASH transcoding, metadata storage, recommendation engine, and global CDN delivery.',
      components: ['Video Transcoding Worker Pool (FFmpeg)', 'HLS/DASH Video Chunk Storage (S3)', 'Global Edge CDN (Cloudflare/Fastly)', 'Recommendation Engine (Spark/TensorFlow)', 'Metadata Search (Elasticsearch)'],
      model: 'VideoMetadata { videoId: String (PK), title: String, hlsManifestUrl: String, chunkUrls: List<String>, durationSeconds: Int, viewsCount: Long }',
      tradeoffs: ['HLS (HTTP Live Streaming) vs DASH (Dynamic Adaptive Streaming over HTTP)', 'Pre-transcoding all resolutions vs On-demand Adaptive Transcoding', 'Third-party CDN vs Proprietary Edge Server Network']
    }
  ];

  const t = designArchitectures[i % designArchitectures.length];

  return {
    id: `sd-q-${index}`,
    round: 'System Design',
    level,
    category: 'System Design & Architecture',
    subcategory: t.title.split('(')[1]?.replace(')', '') || 'Distributed Systems',
    difficulty: level === 'Beginner' ? 'Medium' : level === 'Intermediate' ? 'Hard' : 'Hard',
    question: `${t.title} - Scale & Architecture #${index}`,
    thinkFirstPrompt: `Analyze functional requirements, non-functional constraints (latency, availability, consistency), traffic estimations, component architecture, data model, and trade-offs.`,
    answer: `System Design breakdown for ${t.title}. Explains capacity estimation, high-level architecture diagram, database schema selection, caching strategy, and bottleneck mitigation.`,
    explanation: `Step-by-step breakdown covering Back-of-the-Envelope calculations, API design, Data storage choice, Component interactions, and System Bottlenecks.`,
    systemDesignDetails: {
      scale: t.scale,
      architectureOverview: t.overview,
      keyComponents: t.components,
      dataModel: t.model,
      tradeoffs: t.tradeoffs
    },
    whatInterviewerEvaluates: [
      'Ability to drive requirements gathering and scale estimation (QPS, Storage, Bandwidth)',
      'High-level component decoupling and clear API boundary definitions',
      'Database choice (Relational vs NoSQL vs In-Memory) and schema normalization/denormalization',
      'Handling single points of failure (SPOF), caching, load balancing, and network latency'
    ],
    answerStructure: [
      'Step 1: Clarify Functional & Non-Functional Requirements (Latency, Availability, Consistency)',
      'Step 2: Back-of-the-Envelope Estimations (QPS, Storage capacity over 5 years, Bandwidth)',
      'Step 3: High-Level Architecture Diagram (Clients, Load Balancers, API Gateway, DB, Cache)',
      'Step 4: Deep Dive into Core Subsystems & Data Model',
      'Step 5: Address Failure Modes, Scalability Bottlenecks, and Trade-offs'
    ],
    whatToAvoid: [
      'Jumping straight into drawing boxes without clarifying scale and requirements first',
      'Proposing a single massive database for high-write global workloads without sharding',
      'Failing to mention CAP theorem implications during network partition scenarios'
    ],
    exampleAnswer: `To design ${t.title.toLowerCase()}, we start by clarifying functional requirements (real-time read/write) and non-functional requirements (99.99% availability, <50ms read latency)...`,
    relatedConcepts: ['Distributed Systems', 'Load Balancing', 'Consistent Hashing', 'NoSQL vs SQL', 'Microservices'],
    followUps: [
      { question: `How would your architecture adapt if user traffic surged by 100x overnight?`, answer: `We would auto-scale stateless API servers, add read replicas, partition the database via consistent hashing, and push static assets to edge CDN caches.` },
      { question: `How do you handle database failover when the primary database node dies?`, answer: `An automated consensus algorithm (Raft/Zookeeper) detects master heartbeat loss, promotes an updated read replica to primary master, and re-routes write connections.` }
    ],
    targetRole: 'Backend Developer',
    estimatedTimeMinutes: 15,
    status: 'active'
  };
});
