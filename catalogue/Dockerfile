FROM node:10

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install 

RUN npm install mysql

COPY . .
EXPOSE 3002
CMD [ "node", "app.js" ]