FROM node:10-alpine

LABEL MAINTAINER="Lechuck Roh <lechuckroh@gmail.com>"

RUN mkdir -p /app/config

# install packages
ADD ./package.json /app
RUN cd /app && npm install --no-optional --no-shrinkwrap --no-package-lock

# copy files
ADD ./src /app/src
ADD ./config/default.json /app/config/default.json

WORKDIR /app

ENV NODE_ENV production

VOLUME ["/app/config"]

EXPOSE 8000

ENTRYPOINT ["node", "src/app.js"]
