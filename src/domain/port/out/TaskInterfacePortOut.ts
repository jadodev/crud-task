import { Task } from "src/domain/entity/Task";

export interface TaskInterfacePortOut {
        save ( task:Task ): Promise<Task>;
        getAllTask (): Promise<Task[]>;
        getById (id: number): Promise<Task>;
        updateTask (id: number, task: Task): Promise<Task>;
        deleteTask (id: number): void; 
}