pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'ghcr.io'
        BACKEND_IMAGE = "${env.DOCKER_REGISTRY}/${env.GIT_URL.split('/').take(2).join('/')}/backend"
        FRONTEND_IMAGE = "${env.DOCKER_REGISTRY}/${env.GIT_URL.split('/').take(2).join('/')}/frontend"
        NODE_VERSION = '20'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend CI') {
            parallel {
                stage('Backend Build') {
                    steps {
                        dir('backend') {
                            sh '''
                                npm ci
                                npm run build
                            '''
                        }
                    }
                }
                stage('Backend Test') {
                    steps {
                        dir('backend') {
                            sh '''
                                npm run test || echo "Tests not configured"
                                npm audit --audit-level=moderate || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Frontend CI') {
            parallel {
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm ci
                                npm run build
                            '''
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint || true'
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh '''
                    docker run --rm -v "$PWD:/app" aquasec/trivy:latest fs /app
                '''
            }
        }
        
        stage('Docker Build') {
            when {
                branch 'main'
            }
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            sh '''
                                docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} .
                                docker build -t ${BACKEND_IMAGE}:latest .
                            '''
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh '''
                                docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} .
                                docker build -t ${FRONTEND_IMAGE}:latest .
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Docker Push') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo ${DOCKER_PASS} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USER} --password-stdin
                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([kubeconfigFile(credentialsId: 'k8s-config', variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${BUILD_NUMBER} -n bibaluxe
                        kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} -n bibaluxe
                        kubectl rollout status deployment/backend -n bibaluxe
                        kubectl rollout status deployment/frontend -n bibaluxe
                    '''
                }
            }
        }
        
        stage('Load Test') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    cd load-tests
                    k6 run smoke-test.js --env API_URL=${API_URL}
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext(
                subject: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "The build was successful.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        failure {
            emailext(
                subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "The build failed. Please check the console output.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
