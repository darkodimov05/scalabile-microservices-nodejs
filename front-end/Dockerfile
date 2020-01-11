FROM node:10

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 8079
CMD [ "node", "server.js" ]