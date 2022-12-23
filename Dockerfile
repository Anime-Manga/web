FROM node:16.18

WORKDIR /app

COPY ["src/", "./"]

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000