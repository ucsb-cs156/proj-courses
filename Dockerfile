FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update 
RUN apt-get install -y openjdk-21-jdk  
RUN apt-get install -y  curl  
RUN apt-get install -y  bash  
RUN apt-get install -y maven  
RUN apt-get install -y  python3 
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Verify installation
RUN java -version

WORKDIR /app

# Verify installation
RUN java -version
RUN curl --version

ENV NODE_VERSION=20.17.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN . "$NVM_DIR/nvm.sh" && nvm --version
RUN node --version
RUN npm --version

COPY . /home/app

ENV PRODUCTION=true
ENV NPM_CONFIG_LOGLEVEL=error
RUN mvn \
   -B \
   -ntp \
   -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn \
   -DskipTests \
   -Pproduction \
   -f /home/app/pom.xml clean package

ENTRYPOINT ["sh", "-c", "java -jar /home/app/target/*.jar"]

RUN ["ls", "-ls", "/home/app/target"]

RUN ["chmod", "+x", "/home/app/startup.sh"]
ENTRYPOINT ["/home/app/startup.sh","/home/app/target/courses-1.1.0.jar"]
