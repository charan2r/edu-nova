pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        PROJECT_PATH = '/home/ubuntu/edu-nova'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Env File') {
            steps {
                withCredentials([
                    string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    string(credentialsId: 'OPENAI_API_KEY', variable: 'OPENAI_API_KEY'),
                    string(credentialsId: 'FRONTEND_URL', variable: 'FRONTEND_URL')
                ]) {
                    sh '''
cat <<EOF > backend/.env
PORT=5000
MONGO_URI=$MONGO_URI
JWT_SECRET=$JWT_SECRET
OPENAI_API_KEY=$OPENAI_API_KEY
FRONTEND_URL=$FRONTEND_URL
EOF
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Deploy to EC2') {
            steps {
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
                sshagent(['ec2-ssh-key']) {
                    sh "ssh ${EC2_USER}@${EC2_HOST} docker ps"
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
