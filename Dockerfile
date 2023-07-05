FROM node:14
COPY exercicios/. /app/exercicios
COPY . /app
WORKDIR /app

RUN npm install

CMD ["node", "eventos.js"]

