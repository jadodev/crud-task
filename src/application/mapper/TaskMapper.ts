import { Task } from "src/domain/entity/Task";
import { TaskDTO } from "../DTO/TaskDTO";

export class TaskMapper {
    public static toDto (task: Task): TaskDTO {
        return new TaskDTO(
            task.getTitle(),
            task.getState(),
            task.getCreateAt(),
            task.getUpdateAt()
        );
    }

    public static toDomain(taskDTO: TaskDTO): Task{
        return new Task(
            taskDTO.getTitle(),
            taskDTO.getState(),
            taskDTO.getCreateAt(),
            taskDTO.getUpdateAt()
        );
    }
}