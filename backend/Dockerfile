FROM openjdk:21

WORKDIR /app

COPY target/promptly-0.0.1-SNAPSHOT.jar promptly.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/promptly.jar"]