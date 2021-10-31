# INFO: this container configuration works only with linux alpine images.
FROM node:16-alpine3.11

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./

# add libreoffice package as a OS dependency
RUN apk update
RUN apk add libreoffice

RUN npm ci

# permission set up for upload/download container files
COPY . .
RUN chmod 777 -R public/data/uploads

EXPOSE 3000
CMD [ "npm", "start" ]
