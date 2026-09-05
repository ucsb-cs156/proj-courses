FROM maven:3.9.16-eclipse-temurin-21-noble AS builder

WORKDIR /home/app

# Copy of pom & package is a cheap hack to have npm and maven dependencies already loaded;
# Most of the time, they're unlikely to change, so tying them to the file copies allows us not to
# have to reload them constantly.

COPY pom.xml .

RUN mvn -Pproduction dependency:go-offline -B

COPY frontend/package-lock.json frontend/package.json frontend/

RUN mvn -Pproduction com.github.eirslett:frontend-maven-plugin:install-node-and-npm@install-node-and-npm com.github.eirslett:frontend-maven-plugin:npm@npm-install -B

COPY . .

RUN mvn -Pproduction -DskipTests -Dcache.use=true package -B

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN apk add bash curl

COPY --from=builder /home/app/startup.sh .

COPY --from=builder /home/app/target/courses-1.1.0.jar .

ENTRYPOINT ["./startup.sh", "courses-1.1.0.jar"]
