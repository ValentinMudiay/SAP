pipeline {
  agent {
    label "sap-prod"
  }

  stages {
    stage("Stop process") {
      steps {
        sh "pm2 stop 0"
      }
    }

    stage("Install dependencies") {
      steps {
        sh "cd /home/sap/workspace/saveaplaylist.com_main && npm i"
      }
    }

    stage("Start application") {
      steps {
       sh "pm2 start /home/sap/workspace/saveaplaylist.com_main/app.js --watch"
      }
    }
    
  }
}