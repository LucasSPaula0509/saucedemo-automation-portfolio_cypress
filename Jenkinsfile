// Pipeline opcional equivalente ao GitHub Actions (smoke -> regressão -> defeitos -> report).
// Requer: plugin NodeJS com uma instalação chamada "node-26", Chrome/Firefox no agente, um JDK no
// PATH (o Allure roda na JVM) e o plugin Allure Jenkins (ferramenta "allure").
// Execução sequencial: um cenário por vez, um estágio por vez.
pipeline {
  agent any

  tools {
    nodejs 'node-26'
  }

  options {
    timestamps()
    timeout(time: 60, unit: 'MINUTES')
  }

  parameters {
    choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'edge'], description: 'Navegador da regressão')
    string(name: 'TAGS', defaultValue: 'not @defeito and not @performance', description: 'Tags da regressão')
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Instalar') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Smoke') {
      steps {
        sh 'npx cypress run --browser chrome --expose "tags=@smoke and not @defeito"'
      }
    }

    stage('Regressão') {
      steps {
        // Os resultados do smoke continuam em allure-results para o report.
        sh "npx cypress run --browser ${params.BROWSER} --expose \"tags=${params.TAGS}\""
      }
    }

    stage('Defeitos conhecidos') {
      steps {
        // Falha esperada enquanto o defeito existir: marca o estágio como instável sem quebrar o build.
        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          sh 'npx cypress run --browser chrome --expose tags=@defeito'
        }
      }
    }
  }

  post {
    always {
      allure includeProperties: false, results: [[path: 'allure-results']]
      archiveArtifacts artifacts: 'reports/**, cypress/screenshots/**', allowEmptyArchive: true
    }
  }
}
