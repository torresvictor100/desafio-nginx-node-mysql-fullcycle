FROM node:14 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:14
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
CMD ["npm", "start"]
