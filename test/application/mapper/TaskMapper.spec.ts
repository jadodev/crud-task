import { Task } from "src/domain/entity/Task";
import { TaskDTO } from "src/application/DTO/TaskDTO";
import { TaskMapper } from "src/application/mapper/TaskMapper";
import { TaskState } from "src/domain/type/Task.state";

describe("TaskMapper", () => {
  describe("toDto", () => {
    it("should map Task entity to TaskDTO", () => {
      const task = new Task("Test Task", TaskState.PENDING);
      task["id"] = 1;
      task["createAt"] = new Date("2024-01-01");
      task["updateAt"] = new Date("2024-01-02");

      const taskDTO = TaskMapper.toDto(task);

      expect(taskDTO.getId()).toBe(1);
      expect(taskDTO.getTitle()).toBe("Test Task");
      expect(taskDTO.getState()).toBe(TaskState.PENDING);
      expect(taskDTO.getCreateAt()).toEqual(new Date("2024-01-01"));
      expect(taskDTO.getUpdateAt()).toEqual(new Date("2024-01-02"));
    });
  });

  describe("toDomain", () => {
    it("should map TaskDTO to Task entity", () => {
      const taskDTO = new TaskDTO(1, "Test Task", TaskState.PENDING, new Date("2024-01-01"), new Date("2024-01-02"));
      const task = TaskMapper.toDomain(taskDTO);

      expect(task.getId()).toBe(1);
      expect(task.getTitle()).toBe("Test Task");
      expect(task.getState()).toBe(TaskState.PENDING);
      expect(task.getCreateAt()).toEqual(new Date("2024-01-01"));
      expect(task.getUpdateAt()).toEqual(new Date("2024-01-02"));
    });
  });
});
