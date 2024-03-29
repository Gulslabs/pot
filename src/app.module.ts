import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Block } from './block/entities/block.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { BlockModule } from './block/block.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      name: 'pot',
      type: 'sqlite',
      database: 'pot.db',
      //FIXME: Set to  dynamic path like below
      // entities: ['dist/**/*.entity.js'],
      entities: [Transaction, Block],
      synchronize: true,
      logging: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          lazyConnect: true,
          keepAlive: 1000,
          connectTimeout: 1000,
        },
      }),
    }),
    // FIXME: Commenting both modules; typeorm is not working correctly
    // BlockModule,
    //TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
