# Complete Monitoring & CI/CD Setup Guide

This is a **beginner-friendly, step-by-step guide** to set up all monitoring and CI/CD tools for the BibaLuxe project. Every command is explained in detail.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [What Each Tool Does](#what-each-tool-does)
3. [Kubernetes Setup](#kubernetes-setup)
4. [Prometheus Setup](#prometheus-setup)
5. [Grafana Setup](#grafana-setup)
6. [SonarQube Setup](#sonarqube-setup)
7. [Jenkins Setup](#jenkins-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, you need:

### 1. A Terminal/Command Line

**On Mac/Linux:**
- Open "Terminal" application
- You'll see a prompt like: `mac@Macbook ~ %`

**On Windows:**
- Open "PowerShell" or "Command Prompt"
- Or use "Git Bash" (if you have Git installed)

### 2. Git Installed

Check if Git is installed:
```bash
git --version
```

If you see a version number (like `git version 2.39.0`), you're good!
If not, install Git: https://git-scm.com/downloads

### 3. kubectl (for Kubernetes) - Optional

Only needed if you want to deploy to Kubernetes.

**Install kubectl:**
- Mac: `brew install kubectl`
- Or download from: https://kubernetes.io/docs/tasks/tools/

**Check if installed:**
```bash
kubectl version --client
```

### 4. A Kubernetes Cluster (Optional)

You need a Kubernetes cluster to deploy the monitoring tools. Options:
- **Local**: Minikube, Docker Desktop, or Kind
- **Cloud**: AWS EKS, Google GKE, Azure AKS
- **Free**: Oracle Cloud (always free tier)

---

## What Each Tool Does

### 🎯 Kubernetes (k8s)
**What it is:** A container orchestration platform that manages your applications
**Why you need it:** To run and manage your backend, frontend, and monitoring tools
**When to use:** For production deployments or local development

### 📊 Prometheus
**What it is:** A monitoring system that collects metrics (CPU, memory, requests, etc.)
**Why you need it:** To track how your application is performing
**When to use:** Always running in production to monitor your app

### 📈 Grafana
**What it is:** A visualization tool that creates beautiful dashboards from Prometheus data
**Why you need it:** To see graphs and charts of your application metrics
**When to use:** To view and analyze your monitoring data

### 🔍 SonarQube
**What it is:** Code quality analysis tool that finds bugs, vulnerabilities, and code smells
**Why you need it:** To maintain high code quality and security
**When to use:** Runs automatically on every code push via GitHub Actions

### 🔧 Jenkins
**What it is:** CI/CD automation server (alternative to GitHub Actions)
**Why you need it:** Optional - GitHub Actions already does this for you
**When to use:** Only if you specifically need Jenkins features

---

## Kubernetes Setup

### Step 1: Choose Your Kubernetes Environment

**Option A: Local Development (Easiest for Testing)**

**Using Docker Desktop (Mac/Windows):**
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Open Docker Desktop
3. Go to Settings → Kubernetes
4. Check "Enable Kubernetes"
5. Click "Apply & Restart"
6. Wait for Kubernetes to start (green icon in status bar)

**Using Minikube (Mac/Linux/Windows):**
```bash
# Install Minikube
# Mac:
brew install minikube

# Linux/Windows: Follow instructions at https://minikube.sigs.k8s.io/docs/start/

# Start Minikube
minikube start

# Verify it's running
kubectl get nodes
```

**Option B: Cloud Kubernetes (For Production)**

Choose a cloud provider and follow their setup guide:
- **AWS EKS**: https://aws.amazon.com/eks/
- **Google GKE**: https://cloud.google.com/kubernetes-engine
- **Azure AKS**: https://azure.microsoft.com/services/kubernetes-service/

### Step 2: Navigate to Your Project Directory

Open your terminal and go to your project folder:

```bash
# Change to your project directory
cd /Users/mac/stehabiba/stehabibawebapp

# Verify you're in the right place (you should see k8s folder)
ls -la
```

**What this does:** `cd` means "change directory". This takes you to your project folder where all the configuration files are.

### Step 3: Create the Kubernetes Namespace

A namespace is like a folder in Kubernetes - it organizes your resources.

```bash
# Apply the namespace configuration
kubectl apply -f k8s/namespace.yaml

# Verify it was created
kubectl get namespace bibaluxe
```

**Expected output:**
```
NAME       STATUS   AGE
bibaluxe   Active   5s
```

**If you get an error:** Make sure kubectl is installed and connected to a cluster (see Prerequisites).

### Step 4: Create Secrets

Secrets store sensitive information like passwords and API keys.

**First, create the secrets file from the example:**

```bash
# Copy the example secrets file
cp k8s/secrets.example.yaml k8s/secrets.yaml

# Edit it with your actual values
# On Mac/Linux:
nano k8s/secrets.yaml
# Or use any text editor

# On Windows:
notepad k8s/secrets.yaml
```

**What to fill in:**
- MongoDB connection string
- JWT secret (generate a random string)
- Grafana admin password
- Any other secrets you need

**Then apply the secrets:**

```bash
# Apply secrets (this creates them in Kubernetes)
kubectl apply -f k8s/secrets.yaml

# Verify secrets were created
kubectl get secrets -n bibaluxe
```

**⚠️ Important:** Never commit `secrets.yaml` to Git! It should be in `.gitignore`.

### Step 5: Create ConfigMaps

ConfigMaps store non-sensitive configuration.

```bash
# Apply ConfigMaps
kubectl apply -f k8s/configmaps.yaml

# Verify
kubectl get configmaps -n bibaluxe
```

### Step 6: Deploy MongoDB

```bash
# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Check if MongoDB is running
kubectl get pods -n bibaluxe

# Wait until you see "Running" status (takes 1-2 minutes)
kubectl get pods -n bibaluxe -w
# Press Ctrl+C to stop watching
```

**Expected output:**
```
NAME                      READY   STATUS    RESTARTS   AGE
mongodb-xxxxxxxxx-xxxxx    1/1     Running   0          2m
```

### Step 7: Deploy Backend

```bash
# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Check backend status
kubectl get pods -n bibaluxe | grep backend
```

### Step 8: Deploy Frontend

```bash
# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Check frontend status
kubectl get pods -n bibaluxe | grep frontend
```

### Step 9: Deploy Monitoring (Prometheus & Grafana)

```bash
# Deploy Prometheus and Grafana
kubectl apply -f k8s/monitoring.yaml

# Check monitoring pods
kubectl get pods -n bibaluxe | grep -E "prometheus|grafana"
```

### Step 10: Deploy Ingress (For External Access)

```bash
# Deploy ingress
kubectl apply -f k8s/ingress.yaml

# Check ingress
kubectl get ingress -n bibaluxe
```

### Step 11: Deploy HPA (Auto-scaling)

```bash
# Deploy Horizontal Pod Autoscaler
kubectl apply -f k8s/hpa.yaml

# Check HPA
kubectl get hpa -n bibaluxe
```

### Step 12: Verify Everything is Running

```bash
# Check all pods
kubectl get pods -n bibaluxe

# Check all services
kubectl get services -n bibaluxe

# Check all deployments
kubectl get deployments -n bibaluxe
```

**All pods should show "Running" status and "1/1" or "3/3" in the READY column.**

---

## Prometheus Setup

### What You Need to Know

Prometheus is **already configured** in the Kubernetes manifests. Once you deploy `k8s/monitoring.yaml`, Prometheus will be running.

### Accessing Prometheus

**Option 1: Port Forward (Easiest for Local Testing)**

```bash
# Forward Prometheus port to your local machine
kubectl port-forward -n bibaluxe service/prometheus-service 9090:9090
```

**What this does:** Makes Prometheus accessible at `http://localhost:9090` on your computer.

**Then:**
1. Open your web browser
2. Go to: `http://localhost:9090`
3. You should see the Prometheus web interface

**To stop port forwarding:** Press `Ctrl+C` in the terminal

**Option 2: Access via Ingress (For Production)**

If you set up ingress with a domain name, access via:
- `http://prometheus.yourdomain.com`

### Viewing Metrics

1. In Prometheus web UI, go to the "Graph" tab
2. Type a metric name (e.g., `up`) in the query box
3. Click "Execute"
4. You'll see the metric value

**Common metrics to check:**
- `up` - Shows if services are up (1 = up, 0 = down)
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration

### Configuration Files

Prometheus configuration is in:
- `monitoring/prometheus/prometheus.yml` - Main config
- `monitoring/prometheus/alert_rules.yml` - Alert rules

**To update configuration:**
1. Edit the files
2. Update the ConfigMap:
   ```bash
   kubectl create configmap prometheus-config \
     --from-file=monitoring/prometheus/prometheus.yml \
     --from-file=monitoring/prometheus/alert_rules.yml \
     -n bibaluxe --dry-run=client -o yaml | kubectl apply -f -
   ```
3. Restart Prometheus:
   ```bash
   kubectl rollout restart deployment/prometheus -n bibaluxe
   ```

---

## Grafana Setup

### What You Need to Know

Grafana is **already configured** in the Kubernetes manifests. Once you deploy `k8s/monitoring.yaml`, Grafana will be running.

### Accessing Grafana

**Step 1: Port Forward**

```bash
# Forward Grafana port to your local machine
kubectl port-forward -n bibaluxe service/grafana-service 3000:3000
```

**Step 2: Open in Browser**

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You'll see the Grafana login page

**Step 3: Login**

**Default credentials (change these in secrets!):**
- Username: `admin`
- Password: `admin`

**⚠️ Security:** Grafana will ask you to change the password on first login. **Do it!**

### Setting Up Dashboards

**Step 1: Verify Prometheus Datasource**

1. In Grafana, go to: **Configuration** → **Data Sources**
2. You should see "Prometheus" already configured
3. Click on it to verify it's connected
4. Click "Save & Test" - should show "Data source is working"

**Step 2: Import Dashboard**

1. Go to: **Dashboards** → **Import**
2. Click "Upload JSON file"
3. Select: `monitoring/grafana/dashboards/api-metrics.json`
4. Click "Load"
5. Select "Prometheus" as the data source
6. Click "Import"

**You should now see your API metrics dashboard!**

### Creating Custom Dashboards

1. In Grafana, go to: **Dashboards** → **New Dashboard**
2. Click "Add visualization"
3. Select "Prometheus" as data source
4. Enter a query (e.g., `up`)
5. Click "Apply"
6. Click "Save dashboard" (top right)

---

## SonarQube Setup

### Option A: SonarCloud (Recommended - Free & Easy)

**Step 1: Sign Up**

1. Go to: https://sonarcloud.io
2. Click "Sign in" (top right)
3. Choose "Log in with GitHub"
4. Authorize SonarCloud to access your GitHub account

**Step 2: Create Organization**

1. After logging in, you'll be asked to create an organization
2. Choose a name (e.g., "chekerh" or "bibaluxe")
3. Select the free plan
4. Click "Create Organization"

**Step 3: Create Project**

1. Click "Create Project" or "Add Project"
2. Choose "From GitHub"
3. Select your repository: `chekerh/BibaLuxe`
4. Click "Set Up"
5. Choose "With GitHub Actions" (recommended)
6. Copy the **Project Key** (looks like: `chekerh_BibaLuxe`)

**Step 4: Get Your Token**

1. Click your profile icon (top right)
2. Go to "My Account" → "Security"
3. Under "Generate Tokens", enter a name (e.g., "GitHub Actions")
4. Click "Generate"
5. **Copy the token immediately** (you won't see it again!)

**Step 5: Add GitHub Secrets**

1. Go to your GitHub repository: https://github.com/chekerh/BibaLuxe
2. Click "Settings" (top menu)
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add these secrets:

   **Secret 1:**
   - Name: `SONAR_TOKEN`
   - Value: (paste the token you copied from SonarCloud)
   - Click "Add secret"

   **Secret 2:**
   - Name: `SONAR_HOST_URL`
   - Value: `https://sonarcloud.io`
   - Click "Add secret"

**Step 6: Update sonar-project.properties**

1. Open `sonar-project.properties` in your project
2. Update the `sonar.projectKey` to match your SonarCloud project key:
   ```properties
   sonar.projectKey=chekerh_BibaLuxe
   ```
   (Use the exact key from SonarCloud)

3. Commit and push:
   ```bash
   cd /Users/mac/stehabiba/stehabibawebapp
   git add sonar-project.properties
   git commit -m "chore: update SonarQube project key"
   git push origin BibaLuxe
   ```

**Step 7: Test It**

1. Make a small change to your code
2. Push to GitHub
3. Go to: https://github.com/chekerh/BibaLuxe/actions
4. You should see "SonarQube Analysis" workflow running
5. Once complete, go to SonarCloud to see your code analysis

**That's it! SonarQube will now run automatically on every push.**

### Option B: Self-Hosted SonarQube (Advanced)

**Step 1: Deploy SonarQube to Kubernetes**

```bash
# Make sure you're in your project directory
cd /Users/mac/stehabiba/stehabibawebapp

# Create Persistent Volume Claims (storage for SonarQube)
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

**Step 2: Create Secrets**

```bash
# Create a secure password (replace 'your-secure-password' with a real password)
kubectl create secret generic sonarqube-secrets \
  --from-literal=jdbc-url=jdbc:postgresql://sonarqube-db-service:5432/sonar \
  --from-literal=jdbc-username=sonar \
  --from-literal=jdbc-password=your-secure-password \
  --from-literal=db-user=sonar \
  --from-literal=db-password=your-secure-password \
  -n bibaluxe
```

**Step 3: Deploy SonarQube**

```bash
# Deploy SonarQube and PostgreSQL
kubectl apply -f k8s/sonarqube.yaml

# Check if it's running (wait 2-3 minutes for first startup)
kubectl get pods -n bibaluxe | grep sonarqube
```

**Step 4: Access SonarQube**

```bash
# Port forward to access SonarQube
kubectl port-forward -n bibaluxe service/sonarqube-service 9000:9000
```

1. Open browser: `http://localhost:9000`
2. Default login:
   - Username: `admin`
   - Password: `admin`
3. Change password when prompted

**Step 5: Create Project in SonarQube**

1. In SonarQube UI, click "Create Project"
2. Choose "Manually"
3. Enter:
   - Project key: `bibaluxe`
   - Display name: `BibaLuxe`
4. Click "Set Up"
5. Generate a token (copy it!)

**Step 6: Add GitHub Secrets**

Same as Option A, but use your self-hosted URL:
- `SONAR_HOST_URL`: `http://your-sonarqube-url:9000` (or your domain)

---

## Jenkins Setup

### ⚠️ Note: Jenkins is Optional

You already have **GitHub Actions** doing CI/CD, so Jenkins is only needed if you specifically want it.

### Option A: Jenkins Cloud (Easiest)

1. Go to: https://www.jenkins.io/download/
2. Click "Try Jenkins Cloud" or "Jenkins Cloud"
3. Sign up with GitHub
4. Connect your repository: `chekerh/BibaLuxe`
5. Jenkins will automatically detect the `Jenkinsfile`
6. Your first build will start automatically!

**That's it!** Jenkins Cloud handles everything for you.

### Option B: Self-Hosted Jenkins

**Step 1: Install Jenkins on Your Computer**

**Mac:**
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

**Linux:**
```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

**Windows:**
Download installer from: https://www.jenkins.io/download/

**Step 2: Access Jenkins**

1. Open browser: `http://localhost:8080`
2. Get initial admin password:
   ```bash
   # Mac/Linux:
   sudo cat /var/jenkins_home/secrets/initialAdminPassword
   
   # Or check Jenkins logs:
   sudo journalctl -u jenkins -f
   ```
3. Paste password and continue

**Step 3: Install Plugins**

1. Choose "Install suggested plugins"
2. Wait for installation
3. Create admin user
4. Click "Save and Finish"

**Step 4: Create Pipeline Job**

1. Click "New Item"
2. Enter name: "BibaLuxe Pipeline"
3. Choose "Pipeline"
4. Click "OK"
5. Scroll to "Pipeline" section
6. Under "Definition", choose "Pipeline script from SCM"
7. Configure:
   - SCM: Git
   - Repository URL: `https://github.com/chekerh/BibaLuxe.git`
   - Branch: `*/BibaLuxe`
   - Script Path: `Jenkinsfile`
8. Click "Save"
9. Click "Build Now"

**Step 5: Configure Credentials (For Docker & Kubernetes)**

1. In Jenkins, go to "Manage Jenkins" → "Credentials"
2. Add credentials for:
   - Docker registry (if pushing images)
   - Kubernetes config (if deploying to k8s)

---

## Troubleshooting

### "kubectl: command not found"

**Solution:** Install kubectl
- Mac: `brew install kubectl`
- Or download: https://kubernetes.io/docs/tasks/tools/

### "The connection to the server localhost:8080 was refused"

**Solution:** Kubernetes cluster is not running
- Docker Desktop: Make sure Kubernetes is enabled in settings
- Minikube: Run `minikube start`
- Cloud: Check your kubeconfig is set correctly

### "Error from server (NotFound): namespaces 'bibaluxe' not found"

**Solution:** Create the namespace first
```bash
kubectl apply -f k8s/namespace.yaml
```

### Pods stuck in "Pending" status

**Solution:** Check why:
```bash
# See pod details
kubectl describe pod <pod-name> -n bibaluxe

# Common issues:
# - Not enough resources (CPU/memory)
# - Image pull errors
# - PVC not created
```

### Prometheus/Grafana not accessible

**Solution:** Use port forwarding:
```bash
# For Prometheus
kubectl port-forward -n bibaluxe service/prometheus-service 9090:9090

# For Grafana
kubectl port-forward -n bibaluxe service/grafana-service 3000:3000
```

### SonarQube workflow fails

**Solution:** Check GitHub Secrets are set:
1. Go to: https://github.com/chekerh/BibaLuxe/settings/secrets/actions
2. Verify `SONAR_TOKEN` and `SONAR_HOST_URL` exist
3. Check workflow logs: https://github.com/chekerh/BibaLuxe/actions

### "No space left on device" errors

**Solution:** Clean up unused resources:
```bash
# Delete old pods
kubectl delete pod --field-selector=status.phase==Succeeded -n bibaluxe

# Clean Docker (if using Docker Desktop)
docker system prune -a
```

---

## Quick Reference: Where to Run Commands

### All commands should be run in your terminal:

1. **Open Terminal** (Mac) or PowerShell/Command Prompt (Windows)
2. **Navigate to project:**
   ```bash
   cd /Users/mac/stehabiba/stehabibawebapp
   ```
3. **Run the commands** from the guide above

### Command Structure Explained:

```bash
kubectl apply -f k8s/namespace.yaml
```

- `kubectl` = The command (Kubernetes CLI tool)
- `apply` = The action (apply/create resources)
- `-f` = Flag meaning "from file"
- `k8s/namespace.yaml` = The file path

**Think of it like:** "Hey kubectl, apply/create the resources defined in the file k8s/namespace.yaml"

---

## Summary Checklist

- [ ] Kubernetes cluster running (Docker Desktop, Minikube, or Cloud)
- [ ] kubectl installed and working
- [ ] Namespace created
- [ ] Secrets created and applied
- [ ] ConfigMaps applied
- [ ] MongoDB deployed and running
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Prometheus deployed and accessible
- [ ] Grafana deployed and accessible
- [ ] SonarQube configured (SonarCloud or self-hosted)
- [ ] GitHub Secrets added for SonarQube
- [ ] Jenkins set up (optional)

---

## Need Help?

If you get stuck:
1. Check the error message carefully
2. Use `kubectl describe` to see detailed error info
3. Check pod logs: `kubectl logs <pod-name> -n bibaluxe`
4. Verify all prerequisites are installed
5. Make sure you're in the correct directory when running commands

Good luck! 🚀
