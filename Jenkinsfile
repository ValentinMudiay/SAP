pipeline {
  agent {
    label "sap-prod"
  }

  stages {
    stage("Install dependencies") {
      steps {
        npm i
      }
    }

    stage("Start application") {
      steps {
        pm2 start app.js
      }
    }
    
  }
}