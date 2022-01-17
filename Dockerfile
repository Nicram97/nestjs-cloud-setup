FROM node:14-alpine As build

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

FROM node:14-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3010

CMD ["npm", "run", "start:prod"]