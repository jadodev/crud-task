import { TaskState } from "src/domain/type/Task.state";
import { Expose, plainToInstance } from 'class-transformer';

export class TaskDTO {
       @Expose()
       readonly id: number;

       @Expose()
       private title: string;

       @Expose()
       private state: TaskState;

       @Expose()
       private createAt: Date;

       @Expose()
       private updateAt: Date;

       constructor(id: number, title: string, state: TaskState, createAt: Date, updateAt: Date) {
        this.id = id;
        this.title = title;
        this.state = state;
        this.createAt = createAt;
        this.updateAt = updateAt;
      }

      public getId(): number {
        return this.id;
      }

      public setTitle(title: string): void {
        this.title = title;
      }

      public getTitle(): string {
        return this.title;
      }

      public setState(state: TaskState): void {
        this.state = state;
      }

      public getState(): TaskState {
        return this.state;
      }

      public getCreateAt(): Date {
        return this.createAt;
      }

      public getUpdateAt(): Date {
        return this.updateAt;
      }
}
