FROM node:lts-alpine

COPY . ./app
WORKDIR /app

RUN yarn install && \
    yarn build

EXPOSE 3000

USER node

CMD ["yarn", "start"]