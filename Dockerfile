FROM node:18.13

WORKDIR /app

COPY ["src/", "./src"]

COPY . .
WORKDIR /app/src

RUN apt-get update && apt-get install -y bash
RUN npm install
RUN npm run build

WORKDIR /app

RUN mv ./src/.output ./.output
RUN rm -r ./src

EXPOSE 3000
ENTRYPOINT ["/bin/bash", "-c", "node .output/server/index.mjs"]