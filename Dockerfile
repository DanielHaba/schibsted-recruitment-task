FROM node:lts-alpine

ENV APP_PORT 8080
ENV APP_TRANSPILE_RUNTIME yes
ENV APP_STATIC_PATH /var/www/html/static

WORKDIR /var/www/html

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./.eslintrc.json ./
RUN yarn install --non-interactive --ignore-optional

COPY --chown=node:node ./app ./app
RUN chmod +x app/index.js

COPY --chown=node:node ./static ./static
COPY ./webpack.config.js ./
RUN yarn webpack

EXPOSE 8080
USER node:node
CMD ["app/index.js"]
