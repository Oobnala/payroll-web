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
                sh "sudo npm install"
                sh "sudo npm run build"
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