pipeline {
  agent {
    label "sap-prod"
  }

  stages {
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