import { Module } from '@nestjs/common';
import { TaskEntity } from './infrastructure/entity/TaskEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './infrastructure/controller/TaskController';
import { TaskServiceApplication } from './application/service/TaskServiceApplication';
import { TaskServiceDomain } from './domain/service/TaskServiceDomain';
import { TaskRepository } from './infrastructure/repository/TaskRepository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'tasks_db',
      entities: [TaskEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity])
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
