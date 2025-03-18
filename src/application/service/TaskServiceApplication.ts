import { Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { TaskServiceDomain } from "src/domain/service/TaskServiceDomain";
import { TaskDTO } from "../DTO/TaskDTO";
import { TaskMapper } from "../mapper/TaskMapper";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class TaskServiceApplication {
    constructor(
        @Inject('taskServiceDomain')
        private readonly taskServiceDomain: TaskServiceDomain,

        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache  
    ){}

    async create(taskDTO: TaskDTO): Promise<TaskDTO> {
        const task = TaskMapper.toDomain(taskDTO);
        const save = await this.taskServiceDomain.create(task);
        
        await this.cacheManager.del('tasks_all');  
        
        return TaskMapper.toDto(save);
    }

    async getAlls(): Promise<TaskDTO[]> {
        const cachedTasks = await this.cacheManager.get<TaskDTO[]>('tasks_all');
        
        if (cachedTasks) {
            console.log('🟢 Datos obtenidos desde el caché:', cachedTasks);
            return cachedTasks;
        }
    
        console.log('⚠️ No hay datos en caché. Consultando la BD...');
        
        const tasks = await this.taskServiceDomain.getAllTask();
        const mappedTasks = tasks.map(TaskMapper.toDto);
        
        await this.cacheManager.set('tasks_all', mappedTasks, 300);
        console.log('✅ Datos almacenados en caché:', mappedTasks);
    
        return mappedTasks;
    }

    async getById(id: number): Promise<TaskDTO> {
        const cacheKey = `task_${id}`;
        const cachedTask = await this.cacheManager.get<TaskDTO>(cacheKey);

        if (cachedTask) {
            return cachedTask;
        }

        const task = await this.taskServiceDomain.getById(id);
        const taskDto = TaskMapper.toDto(task);
        
        await this.cacheManager.set(cacheKey, taskDto, 300);

        return taskDto;
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
        
        await this.cacheManager.del(`task_${id}`);
        await this.cacheManager.del('tasks_all');  

        return TaskMapper.toDto(saved);
    }

    async delete(id: number): Promise<void> {
        await this.taskServiceDomain.deleteTask(id);
        
        await this.cacheManager.del(`task_${id}`);
        await this.cacheManager.del('tasks_all');
    }
}
