import { Test, TestingModule } from '@nestjs/testing';
import { TaskDTO } from 'src/application/DTO/TaskDTO';
import { TaskServiceApplication } from 'src/application/service/TaskServiceApplication';
import { TaskState } from 'src/domain/type/Task.state';
import { TaskController } from 'src/infrastructure/controller/TaskController';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskServiceApplication;

  const mockTaskService = {
    create: jest.fn(),
    getAlls: jest.fn(),
    getById: jest.fn(),
    updateTask: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskServiceApplication,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskServiceApplication>(TaskServiceApplication);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskDto = new TaskDTO(1, 'Test Task', TaskState.PENDING, new Date(), new Date());
      mockTaskService.create.mockResolvedValue(taskDto);

      await expect(taskController.create(taskDto)).resolves.toEqual(taskDto);
      expect(mockTaskService.create).toHaveBeenCalledWith(expect.any(TaskDTO));
    });
  });

  describe('getAlls', () => {
    it('should return an array of tasks', async () => {
      const tasks = [new TaskDTO(1, 'Test Task', TaskState.PENDING, new Date(), new Date())];
      mockTaskService.getAlls.mockResolvedValue(tasks);

      await expect(taskController.getAlls()).resolves.toEqual(tasks);
      expect(mockTaskService.getAlls).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a single task', async () => {
      const task = new TaskDTO(1, 'Test Task', TaskState.PENDING, new Date(), new Date());
      mockTaskService.getById.mockResolvedValue(task);

      await expect(taskController.getById(1)).resolves.toEqual(task);
      expect(mockTaskService.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return the updated task', async () => {
      const updatedTask = new TaskDTO(1, 'Updated Task', TaskState.COMPLETED, new Date(), new Date());
      mockTaskService.updateTask.mockResolvedValue(updatedTask);

      await expect(taskController.update(1, updatedTask)).resolves.toEqual(updatedTask);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, expect.any(TaskDTO));
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockTaskService.getById.mockResolvedValue(new TaskDTO(1, 'Task', TaskState.PENDING, new Date(), new Date()));
      mockTaskService.delete.mockResolvedValue(undefined);

      await expect(taskController.delete(1)).resolves.toBeUndefined();
      expect(mockTaskService.delete).toHaveBeenCalledWith(1);
    });
  });
});
