FROM node:20.10.0

WORKDIR /app
COPY package*.json .
RUN node
RUN npm install mysql2 --save
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","run","start"]