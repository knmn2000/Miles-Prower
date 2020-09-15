FROM node:latest AS build 

WORKDIR /. 

ENV PATH /app/node_modules/.bin:$PATH 

COPY package.json ./
COPY package-lock.json ./ 

RUN npm install 

COPY . .

RUN ["npm", "run", "build"]
CMD ["npm", "run", "start"]