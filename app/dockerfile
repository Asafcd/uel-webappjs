FROM node:16

RUN mkdir -p /usr/app/src
WORKDIR /usr/app


COPY package*.json /usr/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production


COPY . .
#expose es el puerto y debe coindicid con el EXTERNO de docker
EXPOSE 8080
CMD [ "node", "./src/index.js" ]
