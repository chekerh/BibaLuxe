# Monitoring & CI/CD Setup Guide

This guide explains how to set up all monitoring and CI/CD tools for the BibaLuxe project.

## Current Status

### ✅ Fully Configured

1. **Kubernetes (k8s)**
   - All manifests in `k8s/` directory
   - Backend, Frontend, MongoDB deployments
   - Services, Ingress, HPA, ConfigMaps
   - Ready to deploy to any Kubernetes cluster

2. **Prometheus**
   - Configuration: `monitoring/prometheus/prometheus.yml`
   - Alert rules: `monitoring/prometheus/alert_rules.yml`
   - K8s deployment: `k8s/monitoring.yaml`

3. **Grafana**
   - Datasource: `monitoring/grafana/provisioning/datasources/prometheus.yml`
   - Dashboard: `monitoring/grafana/dashboards/api-metrics.json`
   - K8s deployment: `k8s/monitoring.yaml`

### ⚠️ Partially Configured

4. **Jenkins**
   - ✅ Jenkinsfile exists
   - ❌ Requires Jenkins server installation
   - ❌ Requires credentials setup

### ❌ Newly Added

5. **SonarQube**
   - ✅ GitHub Actions workflow added
   - ✅ K8s manifests added
   - ✅ Project configuration added
   - ❌ Requires SonarQube server setup

---

## Setup Instructions

### 1. Kubernetes Deployment

```bash
# Apply all k8s manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/secrets.example.yaml  # Update with real secrets first!
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/monitoring.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 2. Prometheus & Grafana

Already configured! Just deploy using k8s manifests above.

**Access:**
- Prometheus: `http://prometheus-service.bibaluxe.svc.cluster.local:9090`
- Grafana: `http://grafana-service.bibaluxe.svc.cluster.local:3000`
  - Default credentials (update in secrets):
    - Username: `admin`
    - Password: `admin` (change immediately!)

### 3. Jenkins Setup

**Option A: Install Jenkins on Kubernetes**

```bash
# Install Jenkins using Helm
helm repo add jenkins https://charts.jenkins.io
helm repo update
helm install jenkins jenkins/jenkins -n jenkins --create-namespace

# Get admin password
kubectl exec --namespace jenkins -it svc/jenkins -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password
```

**Option B: Use Jenkins Cloud (Jenkins.io)**

1. Go to https://www.jenkins.io/download/
2. Sign up for Jenkins Cloud
3. Connect your GitHub repository
4. The Jenkinsfile will be automatically detected

**Required Credentials:**
- Docker registry credentials (for pushing images)
- Kubernetes config (for deployments)

### 4. SonarQube Setup

**Option A: Use SonarCloud (Free for public repos)**

1. Go to https://sonarcloud.io
2. Sign up with GitHub
3. Create a new project: `bibaluxe`
4. Get your project key and token
5. Add GitHub Secrets:
   - `SONAR_TOKEN`: Your SonarCloud token
   - `SONAR_HOST_URL`: `https://sonarcloud.io`

**Option B: Self-hosted SonarQube**

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/sonarqube.yaml

# Create secrets first:
kubectl create secret generic sonarqube-secrets \
  --from-literal=jdbc-url=jdbc:postgresql://sonarqube-db-service:5432/sonar \
  --from-literal=jdbc-username=sonar \
  --from-literal=jdbc-password=your-password \
  --from-literal=db-user=sonar \
  --from-literal=db-password=your-password \
  -n bibaluxe

# Create PVCs
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sonarqube-data-pvc
  namespace: bibaluxe
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sonarqube-extensions-pvc
  namespace: bibaluxe
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sonarqube-logs-pvc
  namespace: bibaluxe
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sonarqube-db-pvc
  namespace: bibaluxe
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 20Gi
EOF
```

**Add GitHub Secrets for SonarQube:**
- Go to: `https://github.com/chekerh/BibaLuxe/settings/secrets/actions`
- Add:
  - `SONAR_TOKEN`: Your SonarQube token
  - `SONAR_HOST_URL`: Your SonarQube URL (e.g., `https://sonarcloud.io` or your self-hosted URL)

---

## Summary

| Tool | Status | Action Required |
|------|--------|----------------|
| Kubernetes | ✅ Ready | Deploy manifests |
| Prometheus | ✅ Ready | Deploy via k8s |
| Grafana | ✅ Ready | Deploy via k8s |
| Jenkins | ⚠️ Needs server | Install Jenkins or use Jenkins Cloud |
| SonarQube | ✅ Config ready | Set up SonarCloud or self-host |

---

## Quick Start (Recommended)

For the fastest setup:

1. **Kubernetes**: Deploy manifests when you have a cluster
2. **Prometheus/Grafana**: Deploy via k8s manifests
3. **SonarQube**: Use SonarCloud (free, 5 minutes setup)
4. **Jenkins**: Use GitHub Actions instead (already configured!)

GitHub Actions already provides CI/CD, so Jenkins is optional unless you specifically need it.
