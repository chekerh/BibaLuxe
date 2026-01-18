# Production Deployment Guide

This guide covers deploying BibaLuxe to production with enterprise-grade infrastructure including Docker, Kubernetes, monitoring, and CI/CD.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Production Environment                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │────────▶│   Backend    │             │
│  │  (Next.js)   │         │  (NestJS)    │             │
│  │  3 replicas  │         │  3 replicas  │             │
│  └──────────────┘         └──────┬───────┘             │
│                                   │                      │
│                        ┌──────────▼──────────┐          │
│                        │    MongoDB          │          │
│                        │  (StatefulSet)      │          │
│                        └─────────────────────┘          │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │  Prometheus  │◀────────│   Grafana    │             │
│  │  (Metrics)   │         │  (Dashboards)│             │
│  └──────────────┘         └──────────────┘             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Deployment Options

### Option 1: Docker Compose (Quick Start)

Best for: Development, staging, small production deployments

```bash
# 1. Copy environment file
cp .env.docker.example .env.docker

# 2. Edit .env.docker with your values
nano .env.docker

# 3. Start all services
docker-compose up -d

# 4. Seed the database
docker-compose exec backend npm run seed

# 5. Access services
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
# - Grafana: http://localhost:3001 (configured port mapping)
# - Prometheus: http://localhost:9090
```

### Option 2: Kubernetes (Production)

Best for: Large-scale production, auto-scaling, high availability

**Prerequisites:**
- Kubernetes cluster (v1.24+)
- kubectl configured
- Container registry access (GitHub Container Registry)

**Deployment Steps:**

1. **Create namespace:**
```bash
kubectl apply -f k8s/namespace.yaml
```

2. **Create secrets:**
```bash
kubectl create secret generic backend-secrets \
  --from-literal=mongodb-uri='your-mongodb-uri' \
  --from-literal=jwt-secret='your-jwt-secret' \
  -n bibaluxe

kubectl create secret generic mongodb-secrets \
  --from-literal=root-username='admin' \
  --from-literal=root-password='your-password' \
  -n bibaluxe

kubectl create secret generic grafana-secrets \
  --from-literal=admin-user='admin' \
  --from-literal=admin-password='your-password' \
  -n bibaluxe
```

3. **Create configmaps:**
```bash
kubectl apply -f k8s/configmaps.yaml
```

4. **Deploy services:**
```bash
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/monitoring.yaml
```

5. **Set up autoscaling:**
```bash
kubectl apply -f k8s/hpa.yaml
```

6. **Configure ingress (optional):**
```bash
# Update ingress.yaml with your domain
kubectl apply -f k8s/ingress.yaml
```

### Option 3: Render + Vercel (Current Setup)

Best for: Managed hosting, fast deployment

- **Backend:** Deployed on Render (configured via `render.yaml`)
- **Frontend:** Deployed on Vercel (configured via `vercel.json`)

See root `README.md` for setup instructions.

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

1. **Runs on every push:**
   - Type checking
   - Linting
   - Building
   - Security audits
   - Translation completeness checks

2. **On main branch:**
   - Builds Docker images
   - Pushes to GitHub Container Registry
   - Runs security scanning (Trivy)
   - Performs load testing (k6)

## Monitoring

### Prometheus Metrics

- **Backend metrics endpoint:** `http://backend:3001/metrics`
- **Frontend metrics:** (optional, can be added)

### Grafana Dashboards

Access Grafana at the configured URL and use pre-configured dashboards:
- API Metrics Dashboard
- System Performance Dashboard
- Error Rate Monitoring

### Health Checks

- **Backend:** 
  - `/health` - Full health check (DB, memory, disk)
  - `/health/ready` - Readiness probe
  - `/health/live` - Liveness probe

- **Frontend:**
  - `/api/health` - Basic health check

## Load Testing

Run load tests locally:

```bash
# Install k6
# macOS: brew install k6
# Linux: https://k6.io/docs/getting-started/installation/

cd load-tests

# Smoke test (quick validation)
k6 run smoke-test.js

# Load test (normal traffic simulation)
k6 run load-test.js --env API_URL=http://localhost:3001

# Stress test (find breaking point)
k6 run stress-test.js --env API_URL=http://localhost:3001
```

## Security

### Docker Security
- Non-root users in containers
- Minimal base images (Alpine)
- Multi-stage builds
- Secrets management via environment variables or K8s secrets

### Kubernetes Security
- Network policies (can be added)
- Resource limits
- Health checks for automatic recovery
- TLS/SSL via ingress

### Application Security
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- Input validation
- JWT authentication

## Scaling

### Horizontal Pod Autoscaling (K8s)

Configured in `k8s/hpa.yaml`:
- **Backend:** 3-10 replicas based on CPU (70%) and memory (80%)
- **Frontend:** 3-10 replicas based on CPU (70%) and memory (80%)

### Manual Scaling

```bash
# Docker Compose
docker-compose up -d --scale backend=5 --scale frontend=5

# Kubernetes
kubectl scale deployment backend --replicas=5 -n bibaluxe
kubectl scale deployment frontend --replicas=5 -n bibaluxe
```

## Backup and Recovery

### MongoDB Backups

```bash
# Backup
kubectl exec -it mongodb-0 -n bibaluxe -- mongodump --out=/data/backup

# Restore
kubectl exec -it mongodb-0 -n bibaluxe -- mongorestore /data/backup
```

### Persistent Volumes

All data stored in Kubernetes Persistent Volumes:
- MongoDB: `mongodb-pvc`
- Prometheus: `prometheus-pvc`
- Grafana: `grafana-pvc`

## Troubleshooting

### Check pod status
```bash
kubectl get pods -n bibaluxe
```

### View logs
```bash
kubectl logs -f deployment/backend -n bibaluxe
kubectl logs -f deployment/frontend -n bibaluxe
```

### Check health endpoints
```bash
curl http://backend-service.bibaluxe.svc.cluster.local/health
```

### Monitor resources
```bash
kubectl top pods -n bibaluxe
kubectl top nodes
```

## Production Checklist

- [ ] All environment variables configured
- [ ] Secrets properly secured (not in git)
- [ ] SSL/TLS certificates configured
- [ ] Database backups scheduled
- [ ] Monitoring dashboards configured
- [ ] Alerts configured in Prometheus
- [ ] Load testing completed
- [ ] Security scanning passed
- [ ] DNS records configured
- [ ] CDN configured (optional)
- [ ] Rate limiting configured
- [ ] Log aggregation setup (optional)

## Performance Optimization

1. **Enable CDN** for frontend static assets
2. **Configure Redis** for session management (optional)
3. **Database indexing** - ensure MongoDB indexes are optimized
4. **Image optimization** - use Next.js Image component
5. **Caching** - implement API response caching
6. **Connection pooling** - configure MongoDB connection pooling

## Maintenance

### Updating the application

```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
docker-compose build
docker-compose up -d

# Or in Kubernetes
kubectl rollout restart deployment/backend -n bibaluxe
kubectl rollout restart deployment/frontend -n bibaluxe
```

### Monitoring maintenance

Regularly check:
- Grafana dashboards for anomalies
- Prometheus alerts
- Error logs
- Resource usage
- Database performance
