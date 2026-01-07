# Monolithic to Microservices Deployment Roadmap (Full Guide)

This project demonstrates the complete journey of a **Node.js +
TypeScript backend**, starting from a simple monolithic CRUD API and
evolving toward Docker, CI/CD, AWS EC2, Nginx, Elastic Beanstalk, and
eventually Microservices with containers and Kubernetes.

---

## PHASE 0 --- Local Development Setup

- Node.js + TypeScript project created
- Clean folder structure (`src`, `tests`, `config`)
- GitHub repository connected
- `.gitignore` added manually
- Jest unit testing configured
- GitHub PR checks running (tests only)

---

## PHASE 1 --- Deploy Monolithic App Directly to EC2 (NO Docker)

**Goal:** Understand basic deployment steps without complexity.

### Steps:

1.  Create EC2 Ubuntu instance (t3.micro -- free tier)

2.  SSH into server

3.  Install Node.js + PM2 manually

4.  Clone GitHub repo

5.  Manually run:

        npm install
        npm run build
        pm2 start dist/server.js

6.  Expose port in EC2 security group

7.  App runs directly on EC2

---

## PHASE 2 --- Add NGINX as Reverse Proxy (Still Monolithic)

**Goal:** Production-grade reverse proxy + process management.

### Steps:

1.  Install Nginx on EC2
2.  Configure Nginx to forward port 80 → 3000
3.  Enable HTTPS later using Certbot
4.  Auto‑restart Node using PM2

---

## PHASE 3 --- Add CI/CD Pipeline to EC2 (GitHub Actions)

**Goal:** Automatic deployment after every push to `main`.

### Steps:

1.  Create `.github/workflows/deploy.yml`
2.  Add SSH private key secrets in GitHub
3.  Workflow auto‑deploys to EC2:
    - pulls latest code
    - builds
    - restarts PM2

---

## PHASE 4 --- Dockerize the Monolithic App

**Goal:** Learn Docker basics.

### Steps:

1.  Create Dockerfile
2.  Create `.dockerignore`
3.  Build and run container locally
4.  Push container manually to EC2
5.  EC2 runs the container via Docker

---

## PHASE 5 --- CI/CD With Docker Deployment to EC2

**Goal:** Automate Docker deployments.

### Steps:

1.  GitHub Actions builds Docker image
2.  Push to Docker Hub/ECR
3.  EC2 pulls new image and restarts

---

## PHASE 6 --- Deploy Using AWS Elastic Beanstalk

**Goal:** Zero‑config deployment & autoscaling.

### Steps:

1.  Create Elastic Beanstalk app
2.  Upload zipped Node.js build OR Docker image
3.  EB manages:
    - EC2 instances
    - Load balancer
    - Autoscaling
    - Health monitoring

---

## PHASE 7 --- Move to Microservices

**Goal:** Break monolith into independent services.

### We will create:

- Auth Service
- User Service
- Order Service
- Payment Service

### Concepts added:

- API Gateway / Ingress Controller
- Distributed logs
- Shared events
- Dead‑letter queues
- Saga pattern
- Retry + compensation

---

## PHASE 8 --- Docker Compose for Local Multi‑Service Development

**Goal:** Run all microservices locally using Docker Compose.

---

## PHASE 9 --- Deploy Microservices Using AWS ECS (Fargate)

**Goal:** Learn container orchestration.

### ECS handles:

- Service discovery
- Task scaling
- Load balancing
- Health monitoring

---

## PHASE 10 --- Kubernetes (EKS)

**Goal:** Industry‑standard microservice orchestration.

### Learn:

- Pods
- Deployments
- Services
- Ingress
- ConfigMaps / Secrets
- Autoscaling
- Rolling updates
- Canary deployments

---

# FINAL SUMMARY

Phase Topic Technology

---

0 Local setup + Jest + PR checks Node.js, TS, Jest, GitHub
1 EC2 manual deployment Node.js, PM2
2 Nginx reverse proxy Nginx, PM2
3 CI/CD to EC2 GitHub Actions
4 Dockerization Docker
5 Docker CI/CD Docker + GitHub Actions
6 Elastic Beanstalk deployment EB
7 Split monolith Microservices
8 Local multi‑service Docker Compose
9 Microservices on ECS ECS + Fargate
10 Kubernetes EKS

---

If you want, I can also generate separate READMEs for each phase.
