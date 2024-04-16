import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockModule } from './block/block.module';
import { Block } from './block/entities/block.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [    
    TypeOrmModule.forRoot({   
      // https://stackoverflow.com/questions/52904724/nest-cant-resolve-dependencies-of-the-userrepository
      // name: 'pot', 
      type: 'sqlite',
      database: 'pot.db',
      //FIXME: Set to  dynamic path like below
      // entities: ['dist/**/*.entity.js'],
      entities: [Transaction, Block],
      synchronize: true,
      // logging: true,
    }),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     connection: {
    //       host: configService.get<string>('REDIS_HOST', 'localhost'),
    //       port: configService.get<number>('REDIS_PORT', 6379),
    //       lazyConnect: true,
    //       keepAlive: 1000,
    //       connectTimeout: 1000,
    //     },
    //   }),
    // }),    
    BlockModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
