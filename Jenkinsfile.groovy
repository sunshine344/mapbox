pipeline {
    agent any

    environment {
        //设置整个流水线的环境变量
        PROJECT_NAME = 'web'
        PROJECT_PORT = '8090'

        IMAGE_PORT = '2375'
        BRIDGE_PORT = '5000'

        
        BRIDGE_HOST = '10.51.100.61'
        TARGER_HOST = '10.51.100.80'

        DOCKER_CONTAINER_PARAMETER = "-i -p ${PROJECT_PORT}:80 --restart=always --name=${PROJECT_NAME} " +
                                     "-v /home/share/front/${PROJECT_NAME}/ambiences.config.json:"+
                                     "/home/share/front/${PROJECT_NAME}/ambiences.config.json "

        IMAGE_TAG = "${env.BUILD_ID}"
        IMAGE_NAME = "${PROJECT_NAME}:${IMAGE_TAG}"
        REGISTRY_URI = "${BRIDGE_HOST}:${BRIDGE_PORT}/"
        
        TCP_REGISTRY_URI = "tcp://${BRIDGE_HOST}:${IMAGE_PORT}"
        TCP_TARGER_URI = "tcp://${TARGER_HOST}:${IMAGE_PORT}"
        REGISTRY_IMAGE = "${REGISTRY_URI}${IMAGE_NAME}"
    }

    options {
        buildDiscarder logRotator(
                daysToKeepStr: '16',
                numToKeepStr: '10'
        )
    }

    stages {
        stage('Environment Show') {
            steps {
                echo "${env.PROJECT_NAME}"
                echo "${env.DOCKER_CONTAINER_PARAMETER}"
                echo "${env.IMAGE_TAG}"
                echo "${env.IMAGE_NAME}"
                echo "${env.REGISTRY_IMAGE}"
            }
        }

        stage('install') {
            options {
                skipDefaultCheckout true
            }
            steps {
                sh 'npm install --unsafe-perm=true'
            }
        }

        stage('Run build') {
            options {
                skipDefaultCheckout true
            }
            steps {
                sh 'npm run build:pro'
            }
        }

        stage('Build Image') {
            options {
                skipDefaultCheckout true
            }
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY_URI}") {
                        def image = docker.build("${IMAGE_NAME}")
                        image.push()
                    }

                }
            }
        }

        stage('Deploy Dev') {
            agent {
                label 'master'
            }
            options {
                skipDefaultCheckout true
            }
            steps {
                script {
                    try {
                        sh "docker ps -f name=${PROJECT_NAME} -q | xargs --no-run-if-empty docker container stop"
                        sh "docker container ls -a -f name=${PROJECT_NAME} -q | xargs -r docker container rm"
                    } catch (Exception ex) {
                        print("stop & remove container failed", ex.getMessage())
                    }
                    docker.withServer("${TCP_REGISTRY_URI}") {
                        docker.image("${REGISTRY_IMAGE}")
                                .run("$DOCKER_CONTAINER_PARAMETER")
                    }
                }
            }
        }

        stage('Approve of Deploy QA') {
            steps {
                input message: 'deploy to QA?'
            }
        }

        stage('Deploy QA') {
            options {
                skipDefaultCheckout true
            }
            steps {
                 script {
                     def remote = [:]
                     remote.name = 'qa'
                     remote.host = "${TARGER_HOST}"
                     remote.user = 'root'
                     remote.password = "${PASSWORD_80}" as String
                     remote.allowAnyHosts = true
                     try{
                         sshCommand remote: remote, command: "docker ps -f name=${PROJECT_NAME} -q | xargs --no-run-if-empty docker container stop"
                         sshCommand remote: remote, command: "docker container ls -a -f name=${PROJECT_NAME} | xargs -r docker container rm"
                     }catch (Exception ex){
                         println "stop & remove container failed"
                         println ex.getMessage()
                     }

                     docker.withServer("${TCP_TARGER_URI}") {
                         docker.image("${REGISTRY_IMAGE}")
                                 .run("${DOCKER_CONTAINER_PARAMETER}")
                     }
                 }
            }
        }
    }
}
