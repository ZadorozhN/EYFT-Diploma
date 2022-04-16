FROM openjdk:17-jdk-alpine
VOLUME /tmp
ARG JAR_FILE=target/server.jar
COPY ${JAR_FILE} app.jar
COPY keystore.p12 keystore.p12
COPY /CWPhotos /CWPhotos
ENTRYPOINT ["java","-jar","/app.jar"]