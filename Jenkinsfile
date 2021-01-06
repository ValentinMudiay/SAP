pipeline {
  agent {
    label "sap-prod"
  }

  stages {
    stage("Stop application") {
      steps {
        echo "pm2 stop 1"
      }
    }

    stage("Install dependencies") {
      steps {
        sh "cd /home/sap/workspace/saveaplaylist.com_test && npm i"
      }
    }

    stage("Start application") {
      steps {
       sh "pm2 start /home/sap/workspace/saveaplaylist.com_test/app.js --watch"
      }
    }
    
  }
}