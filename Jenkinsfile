pipeline {
     agent any
     environment {
        REACT_APP_AWS_ACCESS_KEY = credentials('payroll-aws-access-key')
        REACT_APP_AWS_SECRET_KEY = credentials('payroll-aws-secret-key')
        REACT_APP_AWS_BUCKET_NAME = credentials('payroll-aws-bucket-name')
        PORT=80
    }
     stages {
        stage("Build") {
            steps {
                echo "AWS ACCESS KEY ${REACT_APP_AWS_ACCESS_KEY}"
                echo "AWS SECRET KEY ${REACT_APP_AWS_SECRET_KEY}"
                echo "AWS BUCKET NAME ${REACT_APP_AWS_BUCKET_NAME}"
                echo "PORT ${PORT}"

                sh "sudo npm install"
                sh 'sudo REACT_APP_AWS_ACCESS_KEY=${REACT_APP_AWS_ACCESS_KEY} npm run build'
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo rm -rf /var/www/jenkins-react-app"
                sh "sudo cp -r ${WORKSPACE}/build/ /var/www/jenkins-react-app/"
            }
        }
    }
}