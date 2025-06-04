<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Postman Collection

```
https://drive.google.com/file/d/17ME5_kC0iDFGcYiXLs85kmCrAXuIQmHW/view?usp=sharing
```

## Run tests

```
# unit tests
$ npm run test
```

## yment and run

### Prerequisit:

create the .env file by copying the infor from .env.example

```
docker compose up -d
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


## Architecture Diagram:

![Untitled-2025-06-03-2033(1)](https://github.com/user-attachments/assets/c7a926b8-d71a-490b-96ba-75b090f3ad60)

## Database Schema:

![Untitled](https://github.com/user-attachments/assets/68c44e45-1597-47a4-9525-4b0621e9d246)

## Sequence Diagram:

![Untitled Diagram](https://github.com/user-attachments/assets/3e0faeb8-80db-4f93-82b1-e48f8172949d)


## Deployment Diagrams

Docker Containerization Strategy
The application is deployed using a multi-container Docker architecture with Docker Compose orchestration. Each service is containerized independently to enable isolated deployment, scaling, and maintenance.

### Deployment Diagram

![Screenshot from 2025-06-04 06-58-43](https://github.com/user-attachments/assets/8395b493-984f-4dae-b1bd-47c42904ceca)

![Screenshot from 2025-06-04 07-00-47](https://github.com/user-attachments/assets/7bbfe17d-bc4b-45a1-9e0e-5e2d21f5ed2e)
![Screenshot from 2025-06-04 07-00-33](https://github.com/user-attachments/assets/30f93107-10b6-4418-bbdf-f2f7a6d85c2e)


## Design Choices Documentation:

### Authentication Strategy
#### JWT Token-Based Authentication
The application implements JWT (JSON Web Token) authentication to eliminate server-side session storage requirements. This design choice addresses several architectural concerns:

####  Stateless Operations: 
JWT tokens enable stateless authentication, eliminating the need for session storage on the server side
Reduced Service Dependencies: Routes can independently validate tokens without requiring continuous communication with the user service
Bottleneck Prevention: Avoids creating a single point of failure where the user service would need to validate every incoming request

#### Token Management Strategy
Current implementation uses a simplified logout mechanism where the frontend directly removes the JWT token. The architecture supports future enhancement through:

#### Reduced Access Token Expiry: 
Shorter-lived access tokens minimize security exposure
Refresh Token Implementation: Separate refresh tokens would enable controlled session management, although it is not provided in the current implementation
Implicit Session Termination: Token expiration provides automatic logout functionality

### User Service Architecture
#### Database Design and Constraints
The user service implements strategic database constraints to ensure data integrity:

#### Email Uniqueness Constraint: 
Prevents duplicate user registrations with the same email address
Indexed Email Field: Optimizes user lookup operations during authentication

### Scalability Considerations
Anticipating varying load patterns between authentication operations:

#### Read-Heavy Workload: 
Login operations significantly outnumber signup operations (estimated 10:1 ratio)
Database Replication: Multiple read replicas handle increased login request volume
Horizontal Pod Scaling: User service pods can scale independently based on authentication demand
Database Sharding: Future implementation can partition users by ID segments for extreme scale

#### Error Handling Philosophy
The service implements proactive validation with dual database calls for user-friendly error messages:

#### Explicit Email Validation: 
Separate existence check provides clear user feedback
#### Enhanced User Experience: 
Prioritizes user-friendly error messages over database efficiency
#### Acceptable Performance 
Trade-off: Two database calls acceptable given lower frequency of user operations

### Task Service Architecture
#### Caching Strategy
Redis caching implementation addresses the read-heavy nature of task operations:

#### Read-to-Write Ratio: 
Task retrieval operations significantly exceed creation/modification (estimated 20:1 ratio)
#### Database Load Reduction: 
Cache layer reduces direct database queries for frequently accessed data
#### Improved Response Times: 
Cached responses enable faster API performance

#### Database Optimization
Task service database design prioritizes operational efficiency:

#### User-Based Sharding: 
Tasks can be partitioned by user ID without complex cross-shard queries
Replication Strategy: Read replicas handle the high volume of task retrieval requests
Minimal Interdependencies: Task data structure supports distributed scaling

#### Validation Approach
The service adopts a "fail-fast" validation strategy:

#### Database-Level Validation: 
Leverages PostgreSQL's efficient constraint handling
Reduced API Calls: Eliminates pre-validation checks in favor of direct operations
Error-Driven Flow: Allows database errors to drive validation logic for non-user-facing operations

### Notification Service Architecture
Asynchronous Processing
Notification delivery is designed as a non-blocking operation:

#### Request Completion: 
API requests complete immediately after queuing notifications
Non-Critical Path: Notification delivery doesn't impact core application performance

#### Message Queue Implementation
Kafka integration addresses reliability and scalability concerns:

#### Message Persistence: 
Prevents notification loss during service outages
Load Distribution: Enables graceful handling of high notification volumes
Batch Processing Capability: Supports efficient bulk notification processing for high-traffic scenarios

#### Service Resilience
The notification architecture ensures continued operation despite failures

#### Independent Scaling: 
Notification service pods scale based on processing demand
Fault Tolerance: Message queue prevents data loss during service interruptions
Flexible Output: Current implementation supports logging with future integration capability for services like Amazon SNS

### Code Architecture Principles
#### Modular Design
The NestJS implementation emphasizes maintainable code structure:

#### Single Responsibility: 
Each module handles distinct functional areas
#### DRY Principle: 
Eliminates code duplication across services
#### Testability: 
Modular structure facilitates unit testing and mocking
#### Service Isolation: 
Clear boundaries between authentication, task management, and notification concerns

This architectural approach ensures the application can scale horizontally across all services while maintaining data consistency and operational reliability.

## Assumptions

#### User behaviour:
```
- Average Tasks per User: 20 tasks
- Daily Active Users: 40% of total users
- Peak Traffic: 3x average
- Login Sessions: 2 times/day
```

#### Read/Write Ratios
```
- User Service: 10:1 (Login:Signup ratio)
- Task Service: 20:1 (Read:Write ratio)
- Notification Service: Processing heavy
```

## Calculations

### Small Scale(1000 users)

#### Traffic:
```
Daily Active Users: 1,000 × 40% = 400 users
Peak Concurrent Users: 400 × 20% = 80 users
Login Operations: 400 × 2 = 800 logins/day
Task Operations: 400 × 8 = 3,200 ops/day
Peak Task Operations: 3,200 × 3 ÷ 8 hours = 1,200 ops/hour = 0.33 ops/sec
Peak Login Operations: 800 × 3 ÷ 8 hours = 300 logins/hour = 0.08 logins/sec
```

#### Storage requirements:
```
User Data: 1,000 users × 500 bytes = 500 KB
Task Data: 1,000 × 20 × 2 KB = 40 MB
Database Growth: ~2 MB/month
Redis Cache: 40 MB × 85% = 34 MB
```

Small cache, 1 pod each and 1 db suffices

### Medium Scale(100,000 users)

#### Traffic:

```
Daily Active Users: 100,000 × 40% = 40,000 users
Peak Concurrent Users: 40,000 × 20% = 8,000 users
Login Operations: 40,000 × 2 = 80,000 logins/day
Task Operations: 40,000 × 8 = 320,000 operations/day
Peak Task Operations: 320,000 × 3 ÷ 8 hours = 120,000 ops/hour = 33.3 ops/sec
Peak Login Operations: 80,000 × 3 ÷ 8 hours = 30,000 logins/hour = 8.3 logins/sec
```

#### Storage requirements:

```
User Data: 100,000 users × 500 bytes = 50 MB
Task Data: 100,000 × 20 × 2 KB = 4 GB
Database Growth: ~200 MB/month
Redis Cache: 4 GB × 90% = 3.6 GB
Total Database Size: ~5 GB
```

More replicas of pods, having 2-3 read replicas for db and larger cache is needed

### Large Scale(1 million users)

#### Traffic:

```
Daily Active Users: 1,000,000 × 40% = 400,000 users
Peak Concurrent Users: 400,000 × 20% = 80,000 users
Login Operations: 400,000 × 2 = 800,000 logins/day
Task Operations: 400,000 × 8 = 3,200,000 operations/day
Peak Task Operations: 3,200,000 × 3 ÷ 8 hours = 1,200,000 ops/hour = 333 ops/sec
Peak Login Operations: 800,000 × 3 ÷ 8 hours = 300,000 logins/hour = 83 logins/sec
```

#### Storage requirements:

```
User Data: 1,000,000 users × 500 bytes = 500 MB
Task Data: 1,000,000 × 20 × 2 KB = 40 GB
Database Growth: ~2 GB/month
Redis Cache: 40 GB × 95% = 38 GB
Total Database Size: ~50 GB
```

MUltiple pods of each service, more read replicas for the db and sharded db based on the userId, bigger cache and having master slave architecture(with multiple replicas) is needed

##  Improvements:

There are several improvements that can be done for mitigating failure scenarios. We can use circuit breaker pattern and throttling/rate limiting so that our server do not get over burdened and shuts down. 
Refresh tokens can be added for real time token authentication renew mechanism, also we can use HAproxy and API gateway for traffic routing, but in this project it is not implemented.

