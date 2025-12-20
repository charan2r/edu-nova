pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = "${env.EC2_HOST}"
        PROJECT_PATH = '/home/ubuntu/edu-nova'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code'
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images'
                sh 'docker-compose build'
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2'
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            if [ ! -d ${PROJECT_PATH} ]; then
                                git clone https://github.com/charan2r/edu-nova.git ${PROJECT_PATH}
                            fi

                            cd ${PROJECT_PATH}
                            git pull origin main
                            docker-compose down
                            docker-compose up -d --build
                        '
                    """
                }
            }
        }

        stage('Verify') {
            steps {
                echo 'Verifying deployment'
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh ${EC2_USER}@${EC2_HOST} '
                            docker ps
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
