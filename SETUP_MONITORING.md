# Complete Monitoring & CI/CD Setup Guide (Mac + Vagrant)

This is a **beginner-friendly, step-by-step guide** to set up all monitoring and CI/CD tools for the BibaLuxe project using **Vagrant on Mac**. Every command shows **where to run it** and the **full path**.

---

## 📋 Table of Contents

1. [Step 0: Create Vagrantfile and Start Vagrant (Do This First)](#step-0-create-vagrantfile-and-start-vagrant-do-this-first)
2. [Prerequisites](#prerequisites)
3. [What Each Tool Does](#what-each-tool-does)
4. [Kubernetes Setup](#kubernetes-setup)
4. [Prometheus Setup](#prometheus-setup)
5. [Grafana Setup](#grafana-setup)
6. [SonarQube Setup](#sonarqube-setup)
7. [Jenkins Setup](#jenkins-setup)
8. [Troubleshooting](#troubleshooting)

---

## Step 0: Create Vagrantfile and Start Vagrant (Do This First)

You must have a **Vagrantfile** in your project folder before `vagrant status` or `vagrant up` will work. Follow these steps on your **Mac**.

### 0.1 Open Terminal on your Mac

- Open **Terminal** (Applications → Utilities → Terminal, or press `Cmd+Space` and type "Terminal").

### 0.2 Go to your project folder

**Where to run:** On your Mac, in Terminal.

```bash
cd /Users/mac/stehabiba/stehabibawebapp
```

**What this does:** `cd` = change directory. This is your project root (where the `k8s` folder and `Vagrantfile` live).

**Check you’re in the right place:**
```bash
ls -la
```
You should see `Vagrantfile`, `k8s`, `backend`, `frontend`, etc.

### 0.3 Create the Vagrantfile (if it doesn’t exist)

**Where to run:** Same place — `/Users/mac/stehabiba/stehabibawebapp` (Mac, Terminal).

**Option A: Vagrantfile already exists**

If you have a `Vagrantfile` in the project (from the repo), you can skip to 0.4.

**Option B: Create it from scratch**

```bash
cd /Users/mac/stehabiba/stehabibawebapp
cp Vagrantfile.example Vagrantfile
```

**Option C: Create a minimal one with `vagrant init`**

```bash
cd /Users/mac/stehabiba/stehabibawebapp
vagrant init ubuntu/jammy64
```

Then edit `Vagrantfile` and add port forwarding and synced folder (or replace its contents with `Vagrantfile.example`).

### 0.4 Start Vagrant

**Where to run:** On your Mac, in Terminal, in `/Users/mac/stehabiba/stehabibawebapp`.

```bash
cd /Users/mac/stehabiba/stehabibawebapp
vagrant up
```

**What this does:** Downloads the VM image (first time only), creates the VM, and runs provisioning. It can take several minutes the first time.

**⚠️ Apple Silicon (M1/M2/M3) Mac Users:**

If you get an error like **"platform architecture x86 is not supported on ARM"**, VirtualBox doesn't work well on Apple Silicon. Here are your options:

**Option A: Use Parallels Desktop (Best for ARM Macs) - Recommended**

**Where to run:** On your Mac, in Terminal.

1. **Install Parallels Desktop:**
   - Download: https://www.parallels.com/
   - Install and activate (paid, but works perfectly on ARM Macs)

2. **Install Vagrant Parallels plugin:**
   ```bash
   cd /Users/mac/stehabiba/stehabibawebapp
   vagrant plugin install vagrant-parallels
   ```

3. **Use Parallels Vagrantfile:**
   ```bash
   cd /Users/mac/stehabiba/stehabibawebapp
   cp Vagrantfile.parallels Vagrantfile
   ```

4. **Start Vagrant:**
   ```bash
   vagrant up
   ```

**Option B: Use Docker Desktop (Easiest - Skip Vagrant)**

Since you need Kubernetes anyway, skip Vagrant and use Docker Desktop:

**Where to run:** On your Mac, in Terminal.

1. **Install Docker Desktop:**
   - Download: https://www.docker.com/products/docker-desktop
   - Install and open Docker Desktop

2. **Create Kubernetes Cluster:**
   - Open Docker Desktop
   - Go to Settings → Kubernetes (or click "Kubernetes" in left sidebar)
   - Click the blue **"Create cluster"** button
   - Wait for the cluster to be created (1-2 minutes)
   - The Kubernetes icon in the menu bar should turn **green** when ready
   - Note: In newer Docker Desktop versions, there's no "Enable Kubernetes" checkbox - just click "Create cluster"

3. **Verify:**
   ```bash
   kubectl get nodes
   ```
   You should see a node running.

4. **Skip to Kubernetes Setup section** - you can run all `kubectl` commands directly on your Mac!

**Option C: Use UTM (Free Alternative)**

1. Install UTM: https://mac.getutm.app/
2. Create Ubuntu 22.04 ARM VM manually
3. More complex setup - not recommended unless you need it

**When it's done:** You should see a message like "Vagrant VM is ready" or the prompt back.

### 0.5 Check Vagrant status

**Where to run:** On your Mac, in Terminal, in `/Users/mac/stehabiba/stehabibawebapp`.

```bash
cd /Users/mac/stehabiba/stehabibawebapp
vagrant status
```

**Expected:** `running` for the default VM. If you see “A Vagrant environment or target machine is required”, you are **not** in the folder that contains `Vagrantfile`. Run:

```bash
cd /Users/mac/stehabiba/stehabibawebapp
```

and try again.

### 0.6 SSH into the VM

**Where to run:** On your Mac, in Terminal, in `/Users/mac/stehabiba/stehabibawebapp`.

```bash
cd /Users/mac/stehabiba/stehabibawebapp
vagrant ssh
```

**What this does:** Logs you into the Linux VM. Your prompt will change (e.g. `vagrant@ubuntu-jammy:~$`).

- **Inside the VM:** project files are at `/vagrant` (same as `/Users/mac/stehabiba/stehabibawebapp` on your Mac).
- **To exit:** type `exit` or press `Ctrl+D`.

---

## Path cheat sheet (Mac)

| Where | Path |
|-------|------|
| **Project on your Mac** | `/Users/mac/stehabiba/stehabibawebapp` |
| **Project inside the VM** | `/vagrant` |
| **Vagrantfile location** | `/Users/mac/stehabiba/stehabibawebapp/Vagrantfile` |

- **`vagrant` commands** → run on your **Mac**, in Terminal, with `cd /Users/mac/stehabiba/stehabibawebapp` first.
- **`kubectl`, `minikube`, builds** → run **inside the VM** (after `vagrant ssh`), usually with `cd /vagrant`.

---

## Prerequisites

Before you start, you need:

### 1. Vagrant and VirtualBox (Mac)

1. **Vagrant:**  
   **Where to run:** On your Mac, in Terminal (any directory).

   ```bash
   vagrant --version
   ```
   You should see something like `Vagrant 2.4.9`. If not: https://www.vagrantup.com/downloads

2. **VirtualBox:**  
   Install from https://www.virtualbox.org/ (required for the default Vagrant provider on Mac).

3. **Vagrantfile and VM:**  
   Follow [Step 0](#step-0-create-vagrantfile-and-start-vagrant-do-this-first) so that:

   ```bash
   cd /Users/mac/stehabiba/stehabibawebapp
   vagrant status
   ```
   shows `running` (and `vagrant ssh` works).

### 2. A Terminal/Command Line

**On Mac/Linux:**
- Open "Terminal" application
- You'll see a prompt like: `mac@Macbook ~ %`

**On Windows:**
- Open "PowerShell" or "Command Prompt"
- Or use "Git Bash" (if you have Git installed)

**Important for Vagrant:**
- Most commands will be run **inside the Vagrant VM** (after `vagrant ssh`)
- Some commands (like accessing web UIs) will be run on your **host machine**

### 3. Git Installed

**On your host machine:**
```bash
git --version
```

**Inside Vagrant VM (after `vagrant ssh`):**
```bash
git --version
```

If you see a version number (like `git version 2.39.0`), you're good!
If not, install Git: https://git-scm.com/downloads

### 4. kubectl (for Kubernetes) - Inside Vagrant VM

**Install kubectl inside your Vagrant VM:**

1. **SSH into Vagrant:**
   ```bash
   vagrant ssh
   ```

2. **Install kubectl:**
   ```bash
   # Download kubectl
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   
   # Make it executable
   chmod +x kubectl
   
   # Move to PATH
   sudo mv kubectl /usr/local/bin/
   
   # Verify
   kubectl version --client
   ```

### 5. A Kubernetes Cluster (Inside Vagrant VM)

**Recommended: Minikube inside Vagrant**

1. **SSH into Vagrant:**
   ```bash
   vagrant ssh
   ```

2. **Install Minikube:**
   ```bash
   # Download Minikube
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   
   # Install
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   
   # Start Minikube
   minikube start
   
   # Verify
   kubectl get nodes
   ```

**Alternative: Kind (Kubernetes in Docker)**
```bash
# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
kind create cluster

# Verify
kubectl get nodes
```

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

## Kubernetes Setup (Vagrant)

### Step 1: Start Your Vagrant VM

**On your HOST machine:**
```bash
# Navigate to your project directory (where Vagrantfile is)
cd /Users/mac/stehabiba/stehabibawebapp

# Check if VM is running
vagrant status

# If not running, start it
vagrant up

# SSH into the VM
vagrant ssh
```

**What this does:** 
- `vagrant up` starts your virtual machine
- `vagrant ssh` connects you to the VM (like SSH into a remote server)
- From now on, most commands will be run **inside the Vagrant VM**

### Step 2: Choose Your Kubernetes Environment (Inside Vagrant)

**Option A: Local Development (Easiest for Testing)**

**Using Minikube (Recommended for Vagrant):**

**Inside your Vagrant VM (after `vagrant ssh`):**
```bash
# Start Minikube (first time takes 2-3 minutes)
minikube start

# Verify it's running
kubectl get nodes

# You should see output like:
# NAME           STATUS   ROLES           AGE   VERSION
# minikube       Ready    control-plane   1m    v1.28.0
```

**If Minikube isn't installed, install it:**
```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify
minikube version

# Start Minikube
minikube start
```

**Using Kind (Alternative - Kubernetes in Docker):**

**Inside your Vagrant VM:**
```bash
# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
kind create cluster --name bibaluxe

# Verify
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

### Step 4: Create the Kubernetes Namespace

**Where to run:** **Inside the Vagrant VM**, in the project directory.

```bash
cd /vagrant
kubectl apply -f k8s/namespace.yaml
kubectl get namespace bibaluxe
```

**Expected output:**
```
NAME       STATUS   AGE
bibaluxe   Active   5s
```

**If you get an error:** Ensure Minikube is running (`minikube start`) and kubectl is installed in the VM (Vagrant provisioning or Prerequisites).

### Step 5: Create Secrets

**Where to run:**  
- **Edit secrets:** On your **Mac** (easier with a GUI editor) in `/Users/mac/stehabiba/stehabibawebapp`, or inside the VM at `/vagrant`.  
- **Apply with kubectl:** **Inside the Vagrant VM**, in `/vagrant`.

**Create and edit the secrets file:**

On your **Mac**, in Terminal:
```bash
cd /Users/mac/stehabiba/stehabibawebapp
cp k8s/secrets.example.yaml k8s/secrets.yaml
open -e k8s/secrets.yaml
```
Or inside the VM:
```bash
cd /vagrant
cp k8s/secrets.example.yaml k8s/secrets.yaml
nano k8s/secrets.yaml
```

Fill in: MongoDB URI, JWT secret, Grafana admin password, etc.

**Apply secrets (inside the VM):**

```bash
cd /vagrant
kubectl apply -f k8s/secrets.yaml
kubectl get secrets -n bibaluxe
```

**⚠️ Important:** Do not commit `secrets.yaml`; keep it in `.gitignore`.

### Step 6: Create ConfigMaps

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/configmaps.yaml
kubectl get configmaps -n bibaluxe
```

### Step 7: Deploy MongoDB

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl get pods -n bibaluxe
kubectl get pods -n bibaluxe -w
```
Press `Ctrl+C` to stop watching. Wait until the MongoDB pod is `Running`.

**Expected:** `mongodb-xxxxxxxxx-xxxxx    1/1     Running   0          2m`

### Step 8: Deploy Backend

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/backend-deployment.yaml
kubectl get pods -n bibaluxe | grep backend
```

### Step 9: Deploy Frontend

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/frontend-deployment.yaml
kubectl get pods -n bibaluxe | grep frontend
```

### Step 10: Deploy Monitoring (Prometheus & Grafana)

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/monitoring.yaml
kubectl get pods -n bibaluxe | grep -E "prometheus|grafana"
```

### Step 11: Deploy Ingress (For External Access)

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/ingress.yaml
kubectl get ingress -n bibaluxe
```

### Step 12: Deploy HPA (Auto-scaling)

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl apply -f k8s/hpa.yaml
kubectl get hpa -n bibaluxe
```

### Step 13: Verify Everything is Running

**Where to run:** **Inside the Vagrant VM**, in `/vagrant`.

```bash
cd /vagrant
kubectl get pods -n bibaluxe
kubectl get services -n bibaluxe
kubectl get deployments -n bibaluxe
```

**All pods should show "Running" and READY like "1/1" or "3/3".**

---

## Prometheus Setup

### What You Need to Know

Prometheus is **already configured** in the Kubernetes manifests. Once you deploy `k8s/monitoring.yaml`, Prometheus will be running.

### Accessing Prometheus (With Vagrant)

**Step 1: Port Forward from Kubernetes to Vagrant VM**

**Inside your Vagrant VM (after `vagrant ssh`):**
```bash
# Forward Prometheus port inside the VM
kubectl port-forward -n bibaluxe service/prometheus-service 9090:9090
```

**What this does:** Makes Prometheus accessible at `http://localhost:9090` inside the Vagrant VM.

**Step 2: Port Forward from Vagrant VM to Your Host Machine**

**In a NEW terminal on your HOST machine (not inside Vagrant):**
```bash
# Forward port from Vagrant VM to your host
vagrant ssh -- -L 9090:localhost:9090 -N
```

**What this does:** 
- `-L 9090:localhost:9090` forwards port 9090 from the VM to your host
- `-N` means "don't execute a remote command" (just forward ports)
- This makes Prometheus accessible on your host machine

**Step 3: Access Prometheus**

1. **On your HOST machine**, open your web browser
2. Go to: `http://localhost:9090`
3. You should see the Prometheus web interface

**To stop port forwarding:** 
- Press `Ctrl+C` in both terminals

**Alternative: Configure Vagrantfile for Automatic Port Forwarding**

Add this to your `Vagrantfile`:
```ruby
config.vm.network "forwarded_port", guest: 9090, host: 9090  # Prometheus
config.vm.network "forwarded_port", guest: 3000, host: 3000  # Grafana
config.vm.network "forwarded_port", guest: 9000, host: 9000  # SonarQube
```

Then restart Vagrant:
```bash
vagrant reload
```

Now you can access services directly at `http://localhost:9090` without manual port forwarding!

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

### Accessing Grafana (With Vagrant)

**Step 1: Port Forward from Kubernetes to Vagrant VM**

**Inside your Vagrant VM (after `vagrant ssh`):**
```bash
# Forward Grafana port inside the VM
kubectl port-forward -n bibaluxe service/grafana-service 3000:3000
```

**Step 2: Port Forward from Vagrant VM to Your Host Machine**

**In a NEW terminal on your HOST machine:**
```bash
# Forward port from Vagrant VM to your host
vagrant ssh -- -L 3000:localhost:3000 -N
```

**Step 3: Open in Browser**

1. **On your HOST machine**, open your web browser
2. Go to: `http://localhost:3000`
3. You'll see the Grafana login page

**Or use Vagrantfile port forwarding (see Prometheus section above)**

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

## Quick Reference: Where to Run Commands (Mac + Vagrant)

### Paths on your Mac

| What | Path |
|------|------|
| **Project folder (Mac)** | `/Users/mac/stehabiba/stehabibawebapp` |
| **Project folder (inside VM)** | `/vagrant` |
| **Vagrantfile** | `/Users/mac/stehabiba/stehabibawebapp/Vagrantfile` |

### 1. Commands on your Mac (HOST)

**Where:** Mac, Terminal. **First run:** `cd /Users/mac/stehabiba/stehabibawebapp`

- `vagrant up`, `vagrant status`, `vagrant ssh`, `vagrant reload`, `vagrant halt`
- Opening `http://localhost:9090` etc. in the browser
- `git` (if you work in the project on your Mac)

```bash
cd /Users/mac/stehabiba/stehabibawebapp
vagrant status
vagrant ssh
```

### 2. Commands inside the Vagrant VM

**Where:** Inside the VM (after `vagrant ssh`). **First run:** `cd /vagrant`

- `kubectl`, `minikube`
- Docker builds, running apps

```bash
cd /vagrant
kubectl get pods -n bibaluxe
minikube start
```

### Port Forwarding Summary (Vagrant)

To access services running in Kubernetes inside Vagrant:

**Method 1: Manual Port Forwarding (Two Steps)**

1. **Inside Vagrant VM:**
   ```bash
   kubectl port-forward -n bibaluxe service/prometheus-service 9090:9090
   ```

2. **On HOST machine (new terminal):**
   ```bash
   vagrant ssh -- -L 9090:localhost:9090 -N
   ```

3. **Access on HOST:** `http://localhost:9090`

**Method 2: Vagrantfile Port Forwarding (Recommended)**

Add to your `Vagrantfile`:
```ruby
# Prometheus
config.vm.network "forwarded_port", guest: 9090, host: 9090

# Grafana
config.vm.network "forwarded_port", guest: 3000, host: 3000

# SonarQube
config.vm.network "forwarded_port", guest: 9000, host: 9000

# Backend API
config.vm.network "forwarded_port", guest: 3001, host: 3001

# Frontend
config.vm.network "forwarded_port", guest: 3000, host: 3000
```

Then:
```bash
# Reload Vagrant to apply changes
vagrant reload
```

Now you can access services directly without manual port forwarding!

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
