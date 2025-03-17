import { TaskState } from "../type/Task.state";

export class Task {
   private id: number;
   private title: string;
   private state: TaskState;
   private createAt: Date;
   private updateAt: Date;

   constructor(title: string, state: TaskState, createAt: Date, updateAt: Date){
    this.title = title;
    this.state = state;
    this.createAt = createAt;
    this.updateAt = updateAt;
   }

   public setId(id: number): void {
    this.id = id;
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

  public setCreateAt(createAt: Date): void {
    this.createAt = createAt;
  }

  public getCreateAt(): Date {
    return this.createAt;
  }

  public setUpdateAt(updateAt: Date): void {
    this.updateAt = updateAt;
  }

  public getUpdateAt(): Date {
    return this.updateAt;
  }
}