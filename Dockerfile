FROM node:16-alpine3.11

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./

COPY setup.sh ./
RUN chmod +x setup.sh

USER node

RUN npm ci

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
