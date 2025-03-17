import { TaskState } from "../type/Task.state";

export class Task {
   private id: number;
   private title: string;
   private state: TaskState;
   private createAt: Date;
   private updateAt: Date;

   constructor(title: string, state: TaskState){
    this.title = title;
    this.state = state;
    this.createAt = new Date();
    this.updateAt = new Date();
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

  public updateTimestamps(): void {
    this.updateAt = new Date();
  }
}