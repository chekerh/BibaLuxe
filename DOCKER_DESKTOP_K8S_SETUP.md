# Quick Guide: Enable Kubernetes in Docker Desktop (Mac)

## Step-by-Step Instructions

### 1. Open Docker Desktop

- Look for the Docker icon in your Mac's menu bar (top right)
- Or open Docker Desktop from Applications

### 2. Open Settings

- Click the Docker Desktop icon → **Settings** (or **Preferences**)
- Or press `Cmd + ,` (Command + Comma)

### 3. Create Kubernetes Cluster

1. In the left sidebar, click **"Kubernetes"**
2. Click the blue **"Create cluster"** button
   - Note: In newer Docker Desktop versions, there's no "Enable Kubernetes" checkbox
   - Instead, you create a cluster which enables Kubernetes automatically
3. Wait for the cluster to be created (this takes 1-2 minutes)
   - You'll see progress indicators
   - The Kubernetes icon in the menu bar should turn **green** when ready

### 4. Verify It's Working

**Where to run:** On your Mac, in Terminal, at `/Users/mac/stehabiba/stehabibawebapp`

```bash
cd /Users/mac/stehabiba/stehabibawebapp
kubectl get nodes
```

**Expected output:**
```
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   ...   v1.x.x
```

If you see this, Kubernetes is working! ✅

### 5. Check Kubernetes Context

```bash
kubectl config current-context
```

Should show: `docker-desktop`

---

## Troubleshooting

### "connection refused" error

**Problem:** `kubectl get nodes` shows "connection refused"

**Solution:**
1. Make sure Docker Desktop is running (check menu bar icon)
2. Go to Docker Desktop → Settings → Kubernetes
3. Verify "Enable Kubernetes" is checked
4. If it's checked but not working, uncheck it, click "Apply & Restart", then check it again and restart

### kubectl not found

**Solution:** Install kubectl:
```bash
brew install kubectl
```

### Wrong context

**Problem:** kubectl is pointing to a different cluster

**Solution:** Switch to Docker Desktop context:
```bash
kubectl config use-context docker-desktop
```

---

## Next Steps

Once Kubernetes is enabled, you can:

1. **Skip Vagrant** - Run all `kubectl` commands directly on your Mac
2. **Deploy to Kubernetes** - Use the `k8s/` folder manifests
3. **Set up monitoring** - Deploy Prometheus and Grafana

All commands should be run at: `/Users/mac/stehabiba/stehabibawebapp`
