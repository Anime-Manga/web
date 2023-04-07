FROM node:18.13

WORKDIR /app

COPY ["src/", "./"]

COPY . .

RUN npm install --production
RUN npm run build

EXPOSE 3000