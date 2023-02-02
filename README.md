<div align="center">

<img alt='hero logo' src="https://avatars.githubusercontent.com/u/102425191?s=200&v=4" width="50%" height="50%" />

</div>

<h1 align="center">Ceylonuni App - BackEnd</h1>

<p align="center">Bidding App of the F3</p>
<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
    <a href="https://keture.com" target="_blank">
    <img alt="Keture Products" src="https://img.shields.io/badge/Keture-Products-orange?style=flat-square&logo=appveyorlogo=data:image/png;base64" />
  </a>
  <a href="https://twitter.com/keturecom" target="_blank">
    <img alt="Twitter: keturecom" src="https://img.shields.io/twitter/follow/keturecom.svg?style=social" />
  </a>
</p>


# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This repository contains five Fastify services.

## Admin Service

### Setup
1. Setup postgres database locally
2. Change file directory
```
cd .\services\admin\
```
3. Duplicate .env and update the database params
```
cp .env.example .env
```
4. Install project dependencies
```
npm install
```
5. Install db-migrate commands globally
```
npm install -g db-migrate
```
6. Run migration
```
db-migrate up
```
7. Update prisma
```
npx prisma db pull
npx prisma generate
```
8. Run the project
```
npm run dev
```
Open [http://localhost:3004](http://localhost:3004) to view it in the browser.

## Auth Service

### Setup
1. Change file directory
```
cd .\services\auth\
```
2. Duplicate .env and update the database params
```
cp .env.example .env
```
3. Install project dependencies
```
npm install
```
4. Update prisma
```
npx prisma db pull
npx prisma generate
```

5. Run the project
```
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Event Service

### Setup
1. Change file directory
```
cd .\services\event\
```
2. Duplicate .env and update the database params
```
cp .env.example .env
```
3. Install project dependencies
```
npm install
```
4. Update prisma
```
npx prisma db pull
npx prisma generate
```

5. Run the project
```
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## Socializing Service

### Setup
1. Change file directory
```
cd .\services\socializing\
```
2. Duplicate .env and update the database params
```
cp .env.example .env
```
3. Install project dependencies
```
npm install
```
4. Update prisma
```
npx prisma db pull
npx prisma generate
```

5. Run the project
```
npm run dev
```
Open [http://localhost:3002](http://localhost:3002) to view it in the browser.


## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).


<div align="center">

Copyright © Ceylonuni 2023 | All Rights Reserved.

</div>
