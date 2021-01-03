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
        sh "npm i"
      }
    }

    stage("Start application") {
      steps {
       sh "pm2 start /home/sap/saveaplaylist.com/app.js --watch"
      }
    }
    
  }
}