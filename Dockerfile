FROM node:20

RUN npm install -g pnpm

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json .

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 3000

RUN nest build

# CMD ["pnpm", "run", "start:prod"]