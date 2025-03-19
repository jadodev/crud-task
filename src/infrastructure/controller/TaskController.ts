import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { TaskDTO } from "src/application/DTO/TaskDTO";
import { TaskServiceApplication } from "src/application/service/TaskServiceApplication";
import { TaskExceptionHandler } from "src/exceptions/ExceptionHandler";

@Controller("task")
export class TaskController {
    constructor(
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly taskService: TaskServiceApplication
    ){};

    @Get('/health')
    healthCheck() {
      return { status: 'ok' };
    }

    @Post()
    async create(@Body() taskDto: any): Promise<TaskDTO>{
        try {
            const taskDTOInstance = plainToInstance(TaskDTO, taskDto);
            return this.taskService.create(taskDTOInstance);
        } catch (error) {
            throw TaskExceptionHandler.creationError();
        }
    }

    @Get('set')
    async setCache() {
        await this.cacheManager.set('test_key', 'Hola desde NestJS', 300);
        return { message: 'Clave almacenada en caché' };
    }

    @Get()
    async getAlls (): Promise<TaskDTO[]>{
        try{
            return this.taskService.getAlls()
        }catch(error){
            throw TaskExceptionHandler.notFound();
        }
    }

    @Get(":id")
    async getById(@Param("id") id: number): Promise<TaskDTO>{
        try{
            return this.taskService.getById(id)
        }catch(error){
            throw TaskExceptionHandler.notFound();
        }
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() taskDto: any): Promise<TaskDTO> {
      try {
        const taskDTO = new TaskDTO(
          id, 
          taskDto.title,
          taskDto.state,
          taskDto.createAt, 
          taskDto.updateAt 
        );
    
        return await this.taskService.updateTask(id, taskDTO);
      } catch (error) {
        throw TaskExceptionHandler.updateError();
      }
    }
  
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
      try {
        const existingTask = await this.taskService.getById(id);
        if (!existingTask) {
          throw TaskExceptionHandler.notFound();
        }
  
        await this.taskService.delete(id);
      } catch (error) {
        throw TaskExceptionHandler.deletionError();
      }
    }
  }