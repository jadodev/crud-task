import { TaskEntity } from '../entity/TaskEntity';
import { Task } from 'src/domain/entity/Task';

export class TaskMapperEntity {
  public static toEntity(task: Task): TaskEntity {
    const taskEntity = new TaskEntity();

    if (task.getId()) {
      taskEntity.id = task.getId();
    }

    taskEntity.title = task.getTitle();
    taskEntity.state = task.getState();

    return taskEntity;
  }

  public static toDomain(taskEntity: TaskEntity): Task {
    const task = new Task(
      taskEntity.title,
      taskEntity.state,
    );

    if (taskEntity.id) {
      task['id'] = taskEntity.id;
    }
    if (taskEntity.createAt) {
      task['createAt'] = taskEntity.createAt;
    }
    if (taskEntity.updateAt) {
      task['updateAt'] = taskEntity.updateAt;
    }

    return task;
  }
}
