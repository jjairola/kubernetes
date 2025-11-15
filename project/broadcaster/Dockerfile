FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --only=production

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
