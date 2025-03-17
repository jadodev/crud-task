import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from 'src/domain/entity/Task';
import { TaskState } from 'src/domain/type/Task.state';
import { TaskEntity } from 'src/infrastructure/entity/TaskEntity';
import { TaskRepository } from 'src/infrastructure/repository/TaskRepository';
import { TaskMapperEntity } from 'src/infrastructure/mapper/EntityMapper';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let repositoryMock: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(TaskEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    repositoryMock = module.get<Repository<TaskEntity>>(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(taskRepository).toBeDefined();
  });

  it('should save a task', async () => {
    const task = new Task('Test Task', TaskState.PENDING);
    const taskEntity = new TaskEntity();
    jest.spyOn(TaskMapperEntity, 'toEntity').mockReturnValue(taskEntity);
    jest.spyOn(repositoryMock, 'save').mockResolvedValue(taskEntity);
    jest.spyOn(TaskMapperEntity, 'toDomain').mockReturnValue(task);

    const result = await taskRepository.save(task);

    expect(repositoryMock.save).toHaveBeenCalledWith(taskEntity);
    expect(result).toEqual(task);
  });

  it('should get all tasks', async () => {
    const taskEntities = [new TaskEntity(), new TaskEntity()];
    jest.spyOn(repositoryMock, 'find').mockResolvedValue(taskEntities);
    jest.spyOn(TaskMapperEntity, 'toDomain').mockImplementation((entity) => new Task('Mapped Task', TaskState.PENDING));

    const result = await taskRepository.getAllTask();

    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].getTitle()).toBe('Mapped Task');
  });

  it('should get task by ID', async () => {
    const taskEntity = new TaskEntity();
    jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(taskEntity);
    jest.spyOn(TaskMapperEntity, 'toDomain').mockReturnValue(new Task('Found Task', TaskState.IN_PROCESS));

    const result = await taskRepository.getById(1);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result.getTitle()).toBe('Found Task');
  });

  it('should throw error if task not found by ID', async () => {
    jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(null);

    await expect(taskRepository.getById(1)).rejects.toThrow('Task not found');
  });

  it('should update a task', async () => {
    const task = new Task('Updated Task', TaskState.PENDING);
    const taskEntity = new TaskEntity();
    jest.spyOn(TaskMapperEntity, 'toEntity').mockReturnValue(taskEntity);
    jest.spyOn(repositoryMock, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(taskEntity);
    jest.spyOn(TaskMapperEntity, 'toDomain').mockReturnValue(task);

    const result = await taskRepository.updateTask(1, task);

    expect(repositoryMock.update).toHaveBeenCalledWith(1, taskEntity);
    expect(result.getTitle()).toBe('Updated Task');
  });

  it('should throw error if task not found after update', async () => {
    jest.spyOn(TaskMapperEntity, 'toEntity').mockReturnValue(new TaskEntity());
    jest.spyOn(repositoryMock, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(null);

    await expect(taskRepository.updateTask(1, new Task('New Task', TaskState.PENDING))).rejects.toThrow(
      'Task not found after update',
    );
  });

  it('should delete a task', async () => {
    jest.spyOn(repositoryMock, 'delete').mockResolvedValue({ affected: 1 } as any);

    await expect(taskRepository.deleteTask(1)).resolves.toBeUndefined();

    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
  });
});
