FROM node:lts-alpine

ENV APP_PORT 8080
ENV APP_TRANSPILE_RUNTIME yes

WORKDIR /var/www/html

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./.eslintrc.json ./

RUN yarn install --non-interactive --ignore-optional

COPY --chown=node:node ./app ./app
RUN chmod +x app/index.js

EXPOSE 8080
USER node:node
CMD ["app/index.js"]
