FROM node:11-alpine

COPY . /usr/local/src/
WORKDIR /usr/local/src/

CMD ["sh", "-c", "yarn && yarn start"]
