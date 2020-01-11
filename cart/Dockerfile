FROM node:10

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3003
CMD [ "node", "app.js" ]