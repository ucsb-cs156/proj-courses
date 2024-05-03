
FROM bellsoft/liberica-openjdk-alpine:17.0.2

WORKDIR /app

# For the ARG commands to work, you need to do the following configuration:
#   dokku docker-options:add courses-qa build '--build-arg REPO'
#   dokku docker-options:add courses-qa build '--build-arg BRANCH'

ARG REPO=https://github.com/ucsb-cs156/proj-courses
ARG BRANCH=main

ENV REPO=${REPO}
ENV BRANCH=${BRANCH}

ENV NODE_VERSION=16.20.0
RUN apk add curl
RUN apk add bash
RUN apk add maven
RUN apk add git
RUN apk add --no-cache libstdc++
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN node --version
RUN npm --version

RUN env
RUN echo "\$REPO=${REPO}"
RUN echo "\$BRANCH=${BRANCH}"

RUN pwd
RUN ls -al
RUN mkdir /home/app
RUN cd /home/app; git config --global init.defaultBranch main; git init; git remote add origin ${REPO}; git fetch origin; git checkout -b ${BRANCH}; git pull origin ${BRANCH}

ENV PRODUCTION=true
RUN mvn -B -DskipTests -Pproduction -f /home/app/pom.xml clean package

ENTRYPOINT ["sh", "-c", "java -jar /home/app/target/*.jar"]