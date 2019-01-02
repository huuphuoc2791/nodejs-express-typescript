FROM node:8-slim

WORKDIR /www
ENV NODE_ENV development

COPY package.json /www/package.json

RUN npm install --production

COPY .env /www/.env
COPY . /www

CMD ["npm","start"]

EXPOSE 8080
