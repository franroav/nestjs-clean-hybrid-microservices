# 🌐 Microservices Architecture Overview

This document provides an overview of a microservices architecture built using various services and technologies. The architecture is designed to be scalable, resilient, and flexible.

## 📚 Table of Contents

- [Microservices](#microservices)
- [Service Discovery](#service-discovery)
- [Message Brokers](#message-brokers)
- [Databases](#databases)
- [Health Monitoring](#health-monitoring)
- [Benefits of Microservices Architecture](#benefits-of-microservices-architecture)
- [Challenges](#challenges)
- [Diagram Overview](#diagram-overview)
- [Conclusion](#conclusion)


## Architecture Diagram

![Arquitecture Diagram](https://s3.amazonaws.com/awsfranroavdeveloper.click/resources/images/logo-solicitante/serverless-microservice-architecture.png)

<a name="microservices"/>

## 🛠️ Microservices
The architecture consists of several independent microservices, each responsible for a specific functionality:

- **[Billing Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Handles billing-related operations.
- **[User Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Manages user accounts and profiles.
- **[Order Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Manages customer orders.
- **[Delivery Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Coordinates the delivery of orders.
- **[Payment Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Processes payments and transactions.
- **[Risk Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Evaluates and manages risks.
- **[Notification Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Sends notifications to users.
- **[Email Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Handles email communications.
- **[Cache Service](https://nestjs.com/docs/faq/#what-is-nestjs)**: Provides caching mechanisms for improved performance.

<a name="service-discovery"/>

## 🗺️ Service Discovery
- **[Consul](https://www.consul.io)**: Used for service registration and discovery. It helps microservices locate each other without hardcoded addresses and provides health checks.

<a name="message-brokers"/>

## 📬 Message Brokers
- **[NATS](https://nats.io)**: A lightweight messaging system that supports publish-subscribe and request-reply messaging patterns. It facilitates communication between microservices.
- **[Kafka](https://kafka.apache.org)**: A distributed streaming platform for building real-time data pipelines. It allows for fault-tolerant data processing and is deployed with multiple instances for redundancy.

<a name="databases"/>

## 🗄️ Databases
- **[MongoDB](https://www.mongodb.com)**: A NoSQL database used for flexible data modeling and storage. It operates in a replicated setup with a primary, secondary, and arbiter.
- **[PostgreSQL](https://www.postgresql.org)**: A relational database for structured data storage, offering robust querying capabilities.
- **[Redis](https://redis.io)**: An in-memory data structure store utilized for caching and session management to enhance application performance.
- **[SQLite](https://www.sqlite.org)**: A lightweight, file-based database often used for development or low-scale applications.

<a name="health-monitoring"/>

## 🏥 Health Monitoring
- The architecture includes health checks for services, ensuring that any issues (e.g., unhealthy services) can be promptly addressed.

<a name="benefits-of-microservices-architecture"/>

## ✅ Benefits of Microservices Architecture
- **Scalability**: Each service can be scaled independently based on demand.
- **Flexibility in Technology Stack**: Different services can utilize different technologies.
- **Fault Isolation**: A failure in one service does not affect the entire system.
- **Faster Development and Deployment**: Teams can work on separate services simultaneously.

<a name="challenges"/>

## ⚠️ Challenges
- **Complexity in Management**: Managing multiple services can become complex.
- **Network Latency**: Inter-service communication may introduce latency.
- **Data Consistency**: Ensuring data consistency across services can be challenging.

<a name="diagram-overview"/>

## 🖼️ Diagram Overview
![Microservices Architecture Diagram](link_to_your_diagram.png) <!-- Replace with the actual link to your architecture diagram -->

<a name="conclusion"/>

## 📝 Conclusion
This microservices architecture is designed to facilitate the development of scalable, maintainable, and resilient applications. Each component plays a crucial role in ensuring the overall functionality and flexibility of the system.

# Installation

## NestJS Clean Code Architecture

This repository contains a basic structure for a NestJS application using a clean code architecture and a monorepo approach.

## Prerequisites

- Node.js and npm installed on your machine.
- Install the NestJS CLI globally.

## Instructions
To create the project from scratch with the terminal as new one strating from the start. 
```

- npm install -g @nestjs/cli
- nest new nestjs-clean-code-architecture --monorepo
- cd nestjs-clean-code-architecture
- nest g app user-service
- npm init 
- code package.json
- npm install @nestjs/core @nestjs/common @nestjs/platform-express
- npm install typescript ts-node @nestjs/core @nestjs/common @nestjs/cli --save-dev
- touch tsconfig.json
- code tsconfig.json
- {
    "compilerOptions": {
      "module": "commonjs",
      "declaration": true,
      "removeComments": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "allowSyntheticDefaultImports": true,
      "target": "es6",
      "sourceMap": true,
      "outDir": "./dist",
      "baseUrl": "./",
      "incremental": true,
      "paths": {
        "@app/*": ["apps/*/src"],
        "@shared/*": ["libs/shared/src"]
      }
    },
    "include": [
      "apps/user-service/src/**/*",
      "libs/**/*"
    ],
    "exclude": ["node_modules", "dist"]
  }
  
- npm install ts-loader --save-dev

DONE -> Succesfully build a complete microservice aplication with mono-repos

```

## aditional (optional)

```
npm install @nestjs/testing --save-dev
npm i --save @prisma/client

```