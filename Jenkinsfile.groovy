pipeline {
    agent any

    options {
        buildDiscarder logRotator(
                daysToKeepStr: '16',
                numToKeepStr: '10'
        )
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh """
                echo "Cleaned Up Workspace For Project"
                """
            }
        }

        stage('Code Checkout') {
            steps {
                checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/master']],
                        userRemoteConfigs: [[url: 'git@10.51.100.26:products/emodel.git']]
                ])
            }
        }

        stage('npm install') {
            options {
                skipDefaultCheckout true
            }
            steps {
                sh 'npm install'
            }
        }

        stage('npm run build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker build') {
            steps {
                sh 'docker build -t frontend-template .'
            }
        }

        stage('Deploy') {
            agent {
                label 'master'
            }
            options {
                skipDefaultCheckout true
            }
            steps {
                sh 'docker stop frontend-template'
                sh 'docker rm frontend-template'
                sh 'docker run -t -d -p 8090:8090 \
                        --restart=always \
                        --name=frontend-template \
                        -v /home/share/nginx/html/frontend-template/ambiences.config.json:/home/share/config/ambiences.config.json \
                        frontend-template'
            }
        }
    }
}
