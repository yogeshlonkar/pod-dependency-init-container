FROM node:alpine
LABEL maintainer="lonkar.yogeshr@gmail.com"

RUN mkdir -p /opt/yogeshlonkar/pod-dependency
WORKDIR /opt/yogeshlonkar/pod-dependency

COPY package.json /opt/yogeshlonkar/pod-dependency/package.json
COPY package-lock.json /opt/yogeshlonkar/pod-dependency/package-lock.json

RUN npm install

COPY ./src /opt/yogeshlonkar/pod-dependency/src

CMD ["npm", "start"]
