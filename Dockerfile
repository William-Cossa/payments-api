
FROM node:20

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5400

CMD [ "node", "dist/index.js" ]