FROM node:16-alpine3.11 as base

WORKDIR /
COPY package*.json /
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production

ADD setup.sh /
RUN chmod +x /setup.sh

RUN npm ci
COPY . /
RUN npm start
