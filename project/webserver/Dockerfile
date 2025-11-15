FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm i --only=production

COPY index.js .

CMD ["node", "index.js"]