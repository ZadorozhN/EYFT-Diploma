FROM openjdk:17-jdk-alpine
VOLUME /eyft-backend-volume
ARG JAR_FILE=target/server-1.0.0.jar
COPY ${JAR_FILE} app.jar
COPY keystore.p12 keystore.p12
COPY /CWPhotos /CWPhotos
ENTRYPOINT ["java","-jar","/app.jar"]