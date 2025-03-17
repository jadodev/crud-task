import { Test, TestingModule } from '@nestjs/testing';
import { TaskDTO } from 'src/application/DTO/TaskDTO';
import { TaskMapper } from 'src/application/mapper/TaskMapper';
import { TaskServiceApplication } from 'src/application/service/TaskServiceApplication';
import { Task } from 'src/domain/entity/Task';
import { TaskServiceDomain } from 'src/domain/service/TaskServiceDomain';
import { TaskState } from 'src/domain/type/Task.state';

describe('TaskServiceApplication', () => {
    let service: TaskServiceApplication;
    let taskServiceDomain: jest.Mocked<TaskServiceDomain>;
    let module: TestingModule; 
  
    beforeEach(async () => {
      module = await Test.createTestingModule({
        providers: [
          TaskServiceApplication,
          {
            provide: 'taskServiceDomain',
            useValue: {
              create: jest.fn(),
              getAllTask: jest.fn(),
              getById: jest.fn(),
              updateTask: jest.fn(),
              deleteTask: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<TaskServiceApplication>(TaskServiceApplication);
      taskServiceDomain = module.get('taskServiceDomain');
    });
  
    afterAll(async () => {
      await module.close(); 
    });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const taskDTO = new TaskDTO(1, 'Test Task', TaskState.PENDING, new Date(), new Date());
    const task = new Task('Test Task', TaskState.PENDING);
    jest.spyOn(TaskMapper, 'toDomain').mockReturnValue(task);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(taskDTO);
    taskServiceDomain.create.mockResolvedValue(task);

    const result = await service.create(taskDTO);
    expect(result).toEqual(taskDTO);
    expect(taskServiceDomain.create).toHaveBeenCalledWith(task);
  });

  it('should get all tasks', async () => {
    const task = new Task('Test Task', TaskState.PENDING);
    const taskDTO = new TaskDTO(1, 'Test Task', TaskState.PENDING, new Date(), new Date());
    taskServiceDomain.getAllTask.mockResolvedValue([task]);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(taskDTO);

    const result = await service.getAlls();
    expect(result).toEqual([taskDTO]);
    expect(taskServiceDomain.getAllTask).toHaveBeenCalled();
  });

  it('should get task by id', async () => {
    const task = new Task('Test Task', TaskState.PENDING);
    const taskDTO = new TaskDTO(1, 'Test Task', TaskState.PENDING, new Date(), new Date());
    taskServiceDomain.getById.mockResolvedValue(task);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(taskDTO);

    const result = await service.getById(1);
    expect(result).toEqual(taskDTO);
    expect(taskServiceDomain.getById).toHaveBeenCalledWith(1);
  });

  it('should update a task', async () => {
    const existingTask = new Task('Old Task', TaskState.PENDING);
    const updatedTask = new Task('Updated Task', TaskState.COMPLETED);
    const updatedTaskDTO = new TaskDTO(1, 'Updated Task', TaskState.COMPLETED, new Date(), new Date());

    taskServiceDomain.getById.mockResolvedValue(existingTask);
    taskServiceDomain.updateTask.mockResolvedValue(updatedTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(updatedTaskDTO);
    jest.spyOn(TaskMapper, 'toDomain').mockReturnValue(updatedTask);

    const result = await service.updateTask(1, updatedTaskDTO);
    expect(result).toEqual(updatedTaskDTO);
    expect(taskServiceDomain.getById).toHaveBeenCalledWith(1);
    expect(taskServiceDomain.updateTask).toHaveBeenCalledWith(1, updatedTask);
  });

  it('should delete a task', async () => {
    taskServiceDomain.deleteTask.mockResolvedValue(undefined);
    await service.delete(1);
    expect(taskServiceDomain.deleteTask).toHaveBeenCalledWith(1);
  });
});
