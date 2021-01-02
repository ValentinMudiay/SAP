pipeline {
  agent {
    label "sap-prod"
  }

  stages {
    stage("Download application files") {
      steps {
        echo "Downloading files"
      }
    }

    stage("Validate source code") {
      steps {
        echo "Validating source code"
      }

      stage("Build application") {
        steps {
          echo "Build application"
        }
      }
    }
  }
}