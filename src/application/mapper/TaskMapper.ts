import { Task } from "src/domain/entity/Task";
import { TaskDTO } from "../DTO/TaskDTO";

export class TaskMapper {
    public static toDto(task: Task): TaskDTO {
      return new TaskDTO(
        task.getId(), 
        task.getTitle(),
        task.getState(),   
        task.getCreateAt(), 
        task.getUpdateAt()  
      );
    }
  
    public static toDomain(taskDTO: TaskDTO): Task {
    
      const task = new Task(
        taskDTO.getTitle(),
        taskDTO.getState(),
      );
        
      if (taskDTO.getId()) {
        task['id'] = taskDTO.getId();
      }
      if (taskDTO.getCreateAt()) {
        task['createAt'] = taskDTO.getCreateAt();
      }
      if (taskDTO.getUpdateAt()) {
        task['updateAt'] = taskDTO.getUpdateAt();
      }
    
      return task;
    }
}