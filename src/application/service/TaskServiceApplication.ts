import { Inject, Injectable } from "@nestjs/common";
import { TaskServiceDomain } from "src/domain/service/TaskServiceDomain";
import { TaskDTO } from "../DTO/TaskDTO";
import { TaskMapper } from "../mapper/TaskMapper";

@Injectable()
export class TaskServiceApplication {
    constructor(
        @Inject('taskServiceDomain')
        private readonly taskServiceDomain: TaskServiceDomain
    ){};

    async create( taskDTO: TaskDTO): Promise <TaskDTO>{
        const task = TaskMapper.toDomain(taskDTO);
        const save = await this.taskServiceDomain.create(task);
        return TaskMapper.toDto(save);
    }

    async getAlls(): Promise<TaskDTO[]>{
        const tasks = await this.taskServiceDomain.getAllTask();
        return tasks.map(TaskMapper.toDto);
    }

    async getById(id: number): Promise<TaskDTO>{
        const task = await this.taskServiceDomain.getById(id);
        const taskMapper = TaskMapper.toDto(task);
        return taskMapper;
    }

    async updateTask(id: number, taskDTO: TaskDTO): Promise<TaskDTO> {      
        const existingTask = await this.taskServiceDomain.getById(id);
      
        const updatedTaskDTO = new TaskDTO(
          existingTask.getId(), 
          taskDTO.getTitle(),  
          taskDTO.getState(), 
          existingTask.getCreateAt(),
          new Date() 
        );
            
        const updateTask = TaskMapper.toDomain(updatedTaskDTO);
        const saved = await this.taskServiceDomain.updateTask(id, updateTask);
      
        return TaskMapper.toDto(saved);
      }

    async delete(id: number): Promise<void>{
        this.taskServiceDomain.deleteTask(id);
    }
} 