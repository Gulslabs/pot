## Summary
TBD

## Prerequisite
- NodeJS is downloaded from company portal and is working ie. `node -v` and `npm -v` displays certain version. 
- Developer has working knowledge of NestJS Framework. 

## Setup 
- Clone, download, unzip and cd to parent folder `pot`
- Execute `npm i`
- To start the application execute `npm run start`

> Expected Behaviour: I had to comment both modules(app.module.ts); typeorm is not working correctly. Fix is somewhere [here](https://docs.nestjs.com/techniques/database#repository-pattern) 

## Reference
- Below commands are just for reference; they need not run them again. 
```
npm install -g @nestjs/cli
nest new pot
cd pot
npm i --save @nestjs/config
npm i --save @nestjs/event-emitter
npm i --save  @nestjs/typeorm typeorm sqlite3 class-validator
npm i merkle
```
### Bull MQ Setup
`npm install --save @nestjs/bull bull`
### Redis locally 
`https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/`

