pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    GIT_REPO    = 'https://github.com/Mattimax20/metalmontaggi.git'
    DEPLOY_HOST = '10.0.0.5'
    DEPLOY_USER = 'master'
    DEPLOY_DIR  = '/opt/metalmontaggi'
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'master', url: env.GIT_REPO
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'deploy-server-ssh',
          usernameVariable: 'SSH_USER',
          passwordVariable: 'SSH_PASS'
        )]) {
          sh '''
            export SSHPASS="$SSH_PASS"
            SSH="sshpass -e ssh -o StrictHostKeyChecking=no"
            SCP="sshpass -e scp -o StrictHostKeyChecking=no"

            echo "→ Deploy su ${SSH_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}"

            # Crea directory remota
            $SSH ${SSH_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_DIR}"

            # Sincronizza sorgenti via rsync+sshpass
            sshpass -e rsync -az --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              --exclude='*/node_modules' \
              --exclude='.env' \
              --exclude='public/uploads/*' \
              -e "ssh -o StrictHostKeyChecking=no" \
              . ${SSH_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/

            # Esegui script di deploy remoto
            $SSH ${SSH_USER}@${DEPLOY_HOST} \
              "chmod +x ${DEPLOY_DIR}/scripts/remote-deploy.sh && \
               ${DEPLOY_DIR}/scripts/remote-deploy.sh ${DEPLOY_DIR}"
          '''
        }
      }
    }

    stage('Smoke Test') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'deploy-server-ssh',
          usernameVariable: 'SSH_USER',
          passwordVariable: 'SSH_PASS'
        )]) {
          sh '''
            export SSHPASS="$SSH_PASS"
            SSH="sshpass -e ssh -o StrictHostKeyChecking=no"

            echo "🔍 Test Strapi API..."
            for i in 1 2 3 4 5 6; do
              HTTP=$($SSH ${SSH_USER}@${DEPLOY_HOST} \
                "curl -sk -o /dev/null -w '%{http_code}' http://localhost:1337/api/informazioni-azienda 2>/dev/null || echo 000")
              if [ "$HTTP" = "200" ]; then
                echo "✅ Strapi OK (HTTP 200)"
                break
              fi
              echo "  ... ($i/6) HTTP $HTTP — attesa 10s"
              sleep 10
            done

            echo "🔍 Test Frontend..."
            HTTP=$($SSH ${SSH_USER}@${DEPLOY_HOST} \
              "curl -sk -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 000")
            if [ "$HTTP" = "200" ]; then
              echo "✅ Frontend OK (HTTP 200)"
            else
              echo "⚠️  Frontend risponde HTTP $HTTP"
            fi
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ DEPLOY COMPLETATO — Build #${BUILD_NUMBER} — master"
    }
    failure {
      withCredentials([usernamePassword(
        credentialsId: 'deploy-server-ssh',
        usernameVariable: 'SSH_USER',
        passwordVariable: 'SSH_PASS'
      )]) {
        sh '''
          export SSHPASS="$SSH_PASS"
          echo "❌ DEPLOY FALLITO — ultimi log Strapi:"
          sshpass -e ssh -o StrictHostKeyChecking=no ${SSH_USER}@${DEPLOY_HOST} \
            "cd ${DEPLOY_DIR} && docker compose logs --tail=40 strapi 2>/dev/null || true" || true
        '''
      }
    }
    always {
      cleanWs()
    }
  }
}
