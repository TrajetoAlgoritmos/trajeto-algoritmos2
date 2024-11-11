FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install
RUN npm run build

RUN chmod +x ./init.sh

EXPOSE 2053

CMD ["./init.sh"]
