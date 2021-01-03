pipeline {
  agent {
    label "sap-prod"
  }

  stages {


    stage("Install dependencies") {
      steps {
        sh "cd /home/sap/workspace/saveaplaylist.com_main"
        sh "npm i"
      }
    }

    stage("Start application") {
      steps {
       sh "pm2 start /home/sap/workspace/saveaplaylist.com_main/app.js --watch"
      }
    }
    
  }
}