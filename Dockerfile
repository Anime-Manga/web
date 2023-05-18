FROM node:18-alpine

WORKDIR /app

COPY ["src/", "./src"]

COPY . .

RUN apt-get update && apt-get install -y bash && cd ./src && npm install && npm run build && cd .. && mv ./src/.output ./.output && rm -r ./src

EXPOSE 3000
ENTRYPOINT ["/bin/bash", "-c", "node .output/server/index.mjs"]