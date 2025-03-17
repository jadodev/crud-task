import { Test, TestingModule } from "@nestjs/testing";
import { Task } from "../../../src/domain/entity/Task";  
import { TaskInterfacePortOut } from "../../../src/domain/port/out/TaskInterfacePortOut";
import { TaskServiceDomain } from "../../../src/domain/service/TaskServiceDomain";
import { TaskState } from "../../../src/domain/type/Task.state";
import { TaskExceptionHandler } from "../../../src/exceptions/ExceptionHandler";

describe('TaskServiceDomain', () => {
  let taskService: TaskServiceDomain;
  let taskRepository: jest.Mocked<TaskInterfacePortOut>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskServiceDomain,
        {
          provide: 'repositoryInterface',
          useValue: {
            save: jest.fn(),
            getAllTask: jest.fn(),
            getById: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskServiceDomain>(TaskServiceDomain);
    taskRepository = module.get('repositoryInterface');
  });

  it('should create a task successfully', async () => {
    const task = new Task('Test Task', TaskState.PENDING);
    taskRepository.save.mockResolvedValue(task);

    const result = await taskService.create(task);
    expect(result).toEqual(task);
    expect(taskRepository.save).toHaveBeenCalledWith(expect.any(Task));
  });

  it('should throw an error when creating a task fails', async () => {
    const task = new Task('Test Task', TaskState.PENDING);
    taskRepository.save.mockRejectedValue(new Error());

    await expect(taskService.create(task)).rejects.toThrow(TaskExceptionHandler.creationError());
  });

  it('should return all tasks', async () => {
    const tasks = [new Task('Task 1', TaskState.PENDING)];
    taskRepository.getAllTask.mockResolvedValue(tasks);

    const result = await taskService.getAllTask();
    expect(result).toEqual(tasks);
    expect(taskRepository.getAllTask).toHaveBeenCalled();
  });

  it('should throw an error when no tasks are found', async () => {
    taskRepository.getAllTask.mockRejectedValue(TaskExceptionHandler.notFound());

    await expect(taskService.getAllTask()).rejects.toThrow(TaskExceptionHandler.notFound());
  });

  it('should return a task by ID', async () => {
    const task = new Task('Task', TaskState.PENDING);
    taskRepository.getById.mockResolvedValue(task);

    const result = await taskService.getById(1);
    expect(result).toEqual(task);
    expect(taskRepository.getById).toHaveBeenCalledWith(1);
  });

  it('should throw an error when task by ID is not found', async () => {
    taskRepository.getById.mockRejectedValue(TaskExceptionHandler.notFound());

    await expect(taskService.getById(1)).rejects.toThrow(TaskExceptionHandler.notFound());
  });

  it('should update a task', async () => {
    const task = new Task('Updated Task', TaskState.IN_PROCESS);
    taskRepository.getById.mockResolvedValue(task);
    taskRepository.updateTask.mockResolvedValue(task);

    const result = await taskService.updateTask(1, task);
    expect(result).toEqual(task);
    expect(taskRepository.updateTask).toHaveBeenCalledWith(1, expect.any(Task));
  });

  it('should throw an error when updating a non-existing task', async () => {
    taskRepository.getById.mockResolvedValue(null as unknown as Task);

    await expect(taskService.updateTask(1, new Task('Task', TaskState.PENDING)))
      .rejects.toThrow(TaskExceptionHandler.updateError());
  });

  it('should delete a task', async () => {
    taskRepository.deleteTask.mockImplementation(() => Promise.resolve());
  
    await expect(taskService.deleteTask(1)).resolves.toBeUndefined();
    expect(taskRepository.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should throw an error when deleting a task fails', async () => {
    taskRepository.deleteTask.mockImplementation(() => {
      throw TaskExceptionHandler.deletionError();
    });
  
    await expect(taskService.deleteTask(1)).rejects.toThrow(TaskExceptionHandler.deletionError());
  });

  describe('TaskExceptionHandler', () => {
    it('should return creation error', () => {
      const error = TaskExceptionHandler.creationError();
      expect(error.message).toBe('Error al crear la tarea');
    });
  
    it('should return not found error', () => {
      const error = TaskExceptionHandler.notFound();
      expect(error.message).toBe('Tarea no encontrada');
    });
  
    it('should return update error', () => {
      const error = TaskExceptionHandler.updateError();
      expect(error.message).toBe('Error al actualizar la tarea');
    });
  
    it('should return deletion error', () => {
      const error = TaskExceptionHandler.deletionError();
      expect(error.message).toBe('Error al eliminar la tarea');
    });
  });
  
});