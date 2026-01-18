# Infrastructure & CI/CD Setup

This document outlines the complete production infrastructure setup for BibaLuxe.

## What Has Been Created

### Docker Configuration
- ✅ **Backend Dockerfile** - Multi-stage build with health checks
- ✅ **Frontend Dockerfile** - Optimized Next.js production build
- ✅ **docker-compose.yml** - Complete local development stack with MongoDB, Prometheus, Grafana
- ✅ **.dockerignore** files - Optimized build contexts

### Kubernetes Manifests
- ✅ **Namespace** - Isolated bibaluxe namespace
- ✅ **Backend Deployment** - 3 replicas with health probes, resource limits
- ✅ **Frontend Deployment** - 3 replicas with health probes, resource limits
- ✅ **MongoDB StatefulSet** - Persistent storage with health checks
- ✅ **Monitoring Stack** - Prometheus and Grafana deployments
- ✅ **Services** - ClusterIP and LoadBalancer services
- ✅ **Ingress** - Nginx ingress with TLS configuration
- ✅ **HPA** - Horizontal Pod Autoscalers (3-10 replicas based on CPU/memory)
- ✅ **ConfigMaps** - Configuration management
- ✅ **Secrets Example** - Template for secret management

### CI/CD Pipelines

#### GitHub Actions (`.github/workflows/ci-cd.yml`)
- ✅ **Backend CI** - Build, test, lint, type check, security audit
- ✅ **Frontend CI** - Build, lint, type check, translation validation
- ✅ **Docker Build** - Multi-architecture builds, push to GitHub Container Registry
- ✅ **Security Scanning** - Trivy vulnerability scanning
- ✅ **Load Testing** - k6 performance testing
- ✅ **Pre-deployment Checks** - Enhanced validation workflow

#### Jenkins (Jenkinsfile)
- ✅ Complete Jenkins pipeline for CI/CD
- ✅ Parallel builds for backend/frontend
- ✅ Docker image building and pushing
- ✅ Kubernetes deployment automation
- ✅ Email notifications

### Monitoring & Observability

#### Prometheus
- ✅ **Configuration** - Scrape configs for backend, frontend, MongoDB
- ✅ **Alert Rules** - High error rate, response time, service down alerts
- ✅ **Metrics Endpoint** - `/metrics` on backend exposing Prometheus metrics

#### Grafana
- ✅ **Data Source** - Auto-configured Prometheus datasource
- ✅ **Dashboard** - API metrics dashboard (request rate, response time, errors)
- ✅ **Provisioning** - Automatic dashboard and datasource setup

### Health Checks

#### Backend
- ✅ `/health` - Full health check (MongoDB, memory, disk)
- ✅ `/health/ready` - Readiness probe (MongoDB connection)
- ✅ `/health/live` - Liveness probe (service is running)
- ✅ Health check module with @nestjs/terminus

#### Frontend
- ✅ `/api/health` - Basic health check endpoint
- ✅ Next.js API route for health monitoring

### Load Testing

- ✅ **Smoke Test** - Quick validation (10 users)
- ✅ **Load Test** - Normal traffic simulation (50-100 users)
- ✅ **Stress Test** - Breaking point testing (200-500 users)
- ✅ k6 configuration with custom metrics and thresholds

### Documentation

- ✅ **DEPLOYMENT.md** - Complete deployment guide
- ✅ **INFRASTRUCTURE.md** - This file
- ✅ **README.md** - Project overview and setup

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CI/CD Pipeline                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   Build  │→ │   Test   │→ │  Deploy  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Production Environment                  │
│                                                      │
│  ┌──────────────────────────────────────────┐      │
│  │         Ingress (TLS/SSL)                │      │
│  └──────┬─────────────────────┬─────────────┘      │
│         │                     │                     │
│  ┌──────▼──────┐    ┌─────────▼─────────┐         │
│  │  Frontend   │    │     Backend       │         │
│  │  (Next.js)  │───▶│    (NestJS)       │         │
│  │  3-10 pods  │    │    3-10 pods      │         │
│  │  HPA        │    │    HPA            │         │
│  └─────────────┘    └─────────┬─────────┘         │
│                                │                    │
│                       ┌────────▼─────────┐         │
│                       │    MongoDB       │         │
│                       │  (StatefulSet)   │         │
│                       │  Persistent PV   │         │
│                       └──────────────────┘         │
│                                                      │
│  ┌──────────────┐         ┌──────────────┐         │
│  │  Prometheus  │◀────────│   Grafana    │         │
│  │  (Metrics)   │         │ (Dashboards) │         │
│  └──────────────┘         └──────────────┘         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Key Features

### Scalability
- **Horizontal Pod Autoscaling** - Automatic scaling based on CPU/memory
- **Multi-replica deployments** - High availability (3-10 replicas)
- **Load balancing** - Kubernetes services distribute traffic

### Reliability
- **Health checks** - Automatic restart of unhealthy pods
- **Rolling updates** - Zero-downtime deployments
- **Resource limits** - Prevents resource exhaustion
- **Persistent storage** - Data survives pod restarts

### Monitoring
- **Prometheus** - Metrics collection and alerting
- **Grafana** - Visualization and dashboards
- **Custom metrics** - Application-specific monitoring
- **Alert rules** - Proactive issue detection

### Security
- **Non-root containers** - Security best practices
- **Secrets management** - Kubernetes secrets
- **Network policies** - (can be added)
- **TLS/SSL** - Encrypted connections via ingress
- **Security scanning** - Automated vulnerability detection

### CI/CD
- **Automated testing** - Runs on every push
- **Automated builds** - Docker images built automatically
- **Automated deployment** - Deploy to K8s on main branch
- **Load testing** - Performance validation before deployment

## Quick Start

### Option 1: Docker Compose (Local Development)
```bash
docker-compose up -d
```

### Option 2: Kubernetes (Production)
```bash
kubectl apply -f k8s/
```

### Option 3: Render + Vercel (Current Setup)
- Backend: Deploy via Render (uses render.yaml)
- Frontend: Deploy via Vercel (uses vercel.json)

## Next Steps

1. **Install dependencies** for new monitoring modules:
   ```bash
   cd backend
   npm install @nestjs/terminus prom-client
   ```

2. **Test locally with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Set up Kubernetes cluster** (if using K8s):
   - GKE, EKS, AKS, or self-hosted
   - Install ingress controller (nginx)
   - Configure cert-manager for TLS

4. **Configure secrets** in Kubernetes or Render/Vercel

5. **Set up monitoring**:
   - Access Grafana dashboards
   - Configure alert notifications
   - Customize Prometheus scrape configs

6. **Run load tests** before production:
   ```bash
   cd load-tests
   k6 run load-test.js
   ```

## Monitoring URLs (when deployed)

- **Grafana**: http://localhost:3001 (docker-compose) or your configured domain
- **Prometheus**: http://localhost:9090 (docker-compose) or your configured domain
- **Backend Metrics**: http://backend:3001/metrics
- **Backend Health**: http://backend:3001/health

## Production Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Secrets properly secured (Kubernetes secrets or Render/Vercel env vars)
- [ ] SSL/TLS certificates configured (via ingress or Render/Vercel)
- [ ] Database backups scheduled
- [ ] Monitoring dashboards configured and tested
- [ ] Alerts configured (email/Slack/PagerDuty)
- [ ] Load testing completed and thresholds acceptable
- [ ] Security scanning passed
- [ ] DNS records configured
- [ ] CDN configured (optional, recommended)
- [ ] Rate limiting tested
- [ ] Health checks verified
- [ ] Auto-scaling tested
- [ ] Backup and restore procedures tested

## Maintenance

- **Update application**: Push to main branch triggers CI/CD
- **Monitor dashboards**: Check Grafana regularly
- **Review alerts**: Respond to Prometheus alerts
- **Scale manually**: `kubectl scale deployment backend --replicas=5`
- **View logs**: `kubectl logs -f deployment/backend`

## Support

For issues:
1. Check health endpoints
2. Review Grafana dashboards
3. Check Prometheus alerts
4. Review application logs
5. Check Kubernetes events: `kubectl get events -n bibaluxe`
