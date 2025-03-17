import { Task } from 'src/domain/entity/Task';
import { TaskState } from 'src/domain/type/Task.state';
import { TaskEntity } from 'src/infrastructure/entity/TaskEntity';
import { TaskMapperEntity } from 'src/infrastructure/mapper/EntityMapper';

describe('TaskMapperEntity', () => {
  it('should map Task to TaskEntity', () => {
    const task = new Task('Test Task', TaskState.PENDING);
    (task as any).id = 1; 

    const entity = TaskMapperEntity.toEntity(task);

    expect(entity).toBeInstanceOf(TaskEntity);
    expect(entity.id).toBe(1);
    expect(entity.title).toBe('Test Task');
    expect(entity.state).toBe('PENDIENTE');
  });

  it('should map TaskEntity to Task', () => {
    const entity = new TaskEntity();
    entity.id = 2;
    entity.title = 'Mapped Task';
    entity.state = TaskState.PENDING;
    entity.createAt = new Date('2024-03-01');
    entity.updateAt = new Date('2024-03-10');

    const task = TaskMapperEntity.toDomain(entity);

    expect(task).toBeInstanceOf(Task);
    expect((task as any).id).toBe(2);
    expect(task.getTitle()).toBe('Mapped Task');
    expect(task.getState()).toBe('PENDIENTE');
    expect((task as any).createAt).toEqual(new Date('2024-03-01'));
    expect((task as any).updateAt).toEqual(new Date('2024-03-10'));
  });


  it('should handle Task without ID', () => {
    const task = new Task('Task Without ID', TaskState.PENDING);

    const entity = TaskMapperEntity.toEntity(task);

    expect(entity.id).toBeUndefined();
    expect(entity.title).toBe('Task Without ID');
    expect(entity.state).toBe('PENDIENTE');
  });
});
