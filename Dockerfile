FROM node:16-alpine3.11 as base

WORKDIR /src
COPY package*.json /
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
RUN npm start
