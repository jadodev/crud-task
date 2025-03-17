import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entity/TaskEntity';
import { TaskInterfacePortOut } from 'src/domain/port/out/TaskInterfacePortOut';
import { Task } from 'src/domain/entity/Task';
import { TaskMapperEntity } from '../mapper/EntityMapper';

@Injectable()
export class TaskRepository implements TaskInterfacePortOut {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async save(task: Task): Promise<Task> {
    const taskEntity = TaskMapperEntity.toEntity(task);
    const savedEntity = await this.taskRepository.save(taskEntity);
    return TaskMapperEntity.toDomain(savedEntity);
  }

  async getAllTask(): Promise<Task[]> {
    const taskEntities = await this.taskRepository.find();
    return taskEntities.map(TaskMapperEntity.toDomain);
  }

  async getById(id: number): Promise<Task> {
    const taskEntity = await this.taskRepository.findOne({ where: { id } });
    if (!taskEntity) throw new Error('Task not found');
    return TaskMapperEntity.toDomain(taskEntity);
  }

  async updateTask(id: number, task: Task): Promise<Task> {
  
    const taskEntity = TaskMapperEntity.toEntity(task);
  
    taskEntity.updateAt = new Date();
    await this.taskRepository.update(id, taskEntity);
  
    const updatedEntity = await this.taskRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('Task not found after update');
    }
  
      return TaskMapperEntity.toDomain(updatedEntity);
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}