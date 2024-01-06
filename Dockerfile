FROM node

WORKDIR /app

COPY . .

RUN npm i

CMD ["npm", "run", "dev"]