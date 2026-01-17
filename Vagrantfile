# Vagrantfile for BibaLuxe Project (Mac)
# This file must be in your project root: /Users/mac/stehabiba/stehabibawebapp

Vagrant.configure("2") do |config|
  # Use Ubuntu 22.04 LTS
  config.vm.box = "ubuntu/jammy64"

  # VM Configuration (Mac with VirtualBox)
  config.vm.provider "virtualbox" do |vb|
    vb.name = "bibaluxe-dev"
    vb.memory = "4096"   # 4GB RAM
    vb.cpus = 2
  end

  # Port Forwarding: VM ports → your Mac
  # Access these at http://localhost:PORT on your Mac
  config.vm.network "forwarded_port", guest: 9090, host: 9090, auto_correct: true   # Prometheus
  config.vm.network "forwarded_port", guest: 3000, host: 3000, auto_correct: true   # Grafana
  config.vm.network "forwarded_port", guest: 9000, host: 9000, auto_correct: true   # SonarQube
  config.vm.network "forwarded_port", guest: 3001, host: 3001, auto_correct: true   # Backend API
  config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true   # Jenkins (optional)

  # Sync: project folder on your Mac → /vagrant inside the VM
  # The folder where this Vagrantfile lives becomes /vagrant in the VM
  config.vm.synced_folder ".", "/vagrant"

  # Provisioning: runs on first vagrant up
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y curl wget git vim

    # Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker vagrant

    # kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    mv kubectl /usr/local/bin/

    # Minikube
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    install minikube-linux-amd64 /usr/local/bin/minikube

    # Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs

    echo "Vagrant VM setup complete. Run: vagrant ssh, then: cd /vagrant"
  SHELL

  config.vm.post_up_message = <<-MESSAGE
  Vagrant VM is ready.

  Next:
  1. vagrant ssh
  2. cd /vagrant
  3. minikube start
  4. Follow SETUP_MONITORING.md

  On your Mac: Prometheus http://localhost:9090, Grafana http://localhost:3000
  MESSAGE
end
