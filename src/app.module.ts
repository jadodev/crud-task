import { Module } from '@nestjs/common';
import { TaskEntity } from './infrastructure/entity/TaskEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './infrastructure/controller/TaskController';
import { TaskServiceApplication } from './application/service/TaskServiceApplication';
import { TaskServiceDomain } from './domain/service/TaskServiceDomain';
import { TaskRepository } from './infrastructure/repository/TaskRepository';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'tasks_db',
      entities: [TaskEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
    CacheModule.register({
      store: redisStore, 
      host: 'redis',
      port: 6379,
      ttl: 60, 
      isGlobal: true, 
    }),
  ],
  controllers: [TaskController],
  providers: [TaskServiceApplication,
    {
      provide:'taskServiceDomain',
      useClass: TaskServiceDomain
    },
    {
      provide: 'repositoryInterface',
      useClass: TaskRepository
    }
  ],
})
export class AppModule {}
