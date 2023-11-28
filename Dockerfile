FROM node:20.10.0

WORKDIR /app
COPY package*.json .
RUN node
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm","run","start"]