FROM openjdk:21

WORKDIR /app

COPY target/prompthub-0.0.1-SNAPSHOT.jar prompthub.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/prompthub.jar"]