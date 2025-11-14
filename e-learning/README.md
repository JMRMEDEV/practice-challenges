# E-Learning

The E-Learning platform project will be built using a Microservices architecture with a modern stack.

## 1. Core Technology Stack

- **Frontend**: Next.js for high performance (SSR/SSG)
- **Backend/API Gateway (BFF)**: Node.js/Express to aggregate requests and handle security
- **Microservices**: Lightweight Node.js/Express services for specific business logic (Authentication, Content)
- **Persistence**: PouchDB will be used to simulate local databases and store user and course data without needing cloud services

## 2. Authentication Microservice (Auth Service)

This service handles the user lifecycle, using PouchDB to persist local data. It implements a security flow with JWT, issuing short-lived Access Tokens and long-lived Refresh Tokens (stored in HttpOnly cookies and in the local DB), simulating a robust authentication system.

## 3. Content Microservice (Content Service)

This service manages courses and lessons. It uses PouchDB for course metadata and simulates video uploading and delivery by referring to local files or mocks instead of S3/CloudFront, avoiding cloud complexity. Asynchronous processes (such as video transcoding) are simulated through local Node.js events.

## 4. Local Deployment

The infrastructure is orchestrated using Docker Compose to bring up and connect containers for the Frontend, the BFF, and the Microservices, as well as a CouchDB container to provide persistence that can replicate to PouchDB in the local environment.