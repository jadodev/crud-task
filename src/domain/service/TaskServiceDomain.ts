import { Inject, Injectable } from "@nestjs/common";
import { TaskInterfacePortIn } from "../port/in/TaskInterfacePortIn";
import { Task } from "../entity/Task";
import { TaskInterfacePortOut } from "../port/out/TaskInterfacePortOut";
import { TaskExceptionHandler } from "src/exceptions/ExceptionHandler";

@Injectable()
export class TaskServiceDomain implements TaskInterfacePortIn{
    
    constructor(
        @Inject('repositoryInterface')
        private readonly repository: TaskInterfacePortOut 
    ){};

    async create(task: Task): Promise<Task> {
      try {
        const newTask = new Task(task.getTitle(), task.getState());
        return await this.repository.save(newTask);
      } catch (error) {
        throw TaskExceptionHandler.creationError();
      }
  }

    async getAllTask(): Promise<Task[]> {
        try{
            return this.repository.getAllTask();
        }catch(error){
            throw TaskExceptionHandler.notFound();
        }
    };

    async getById(id: number): Promise<Task> {
        try{
            return this.repository.getById(id);
        } catch(error){
            throw TaskExceptionHandler.notFound();
        }    
    };

    async updateTask(id: number, task: Task): Promise<Task> {
        try {
          const existingTask = await this.repository.getById(id);
          if (!existingTask) {
            throw TaskExceptionHandler.notFound();
          }
    
          task.updateTimestamps();
          return this.repository.updateTask(id, task);
        } catch (error) {
          throw TaskExceptionHandler.updateError();
        }
      }

    async deleteTask(id: number): Promise<void> {
        try{
            await this.repository.deleteTask(id);
        } catch(error){
            throw TaskExceptionHandler.deletionError()
        }
    };
}