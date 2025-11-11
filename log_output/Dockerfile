FROM node:24

WORKDIR /app

COPY index.js .
COPY package.json .
COPY package-lock.json .
RUN npm ci


CMD ["node", "index.js"]