FROM node:12-alpine as builder
VOLUME /eyft-frontend-volume
WORKDIR /app
COPY package.json /app/package.json
COPY . /app/
RUN npm install --only=prod
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]