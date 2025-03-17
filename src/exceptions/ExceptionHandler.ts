export class ExceptionHandler extends Error {
    public code: string;
  
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class TaskExceptionHandler {
    static notFound(message = "Tarea no encontrada") {
      return new ExceptionHandler(message, "TASK_NOT_FOUND");
    }
  
    static validationError(message = "Datos de la tarea inválidos") {
      return new ExceptionHandler(message, "TASK_VALIDATION_ERROR");
    }
  
    static creationError(message = "Error al crear la tarea") {
      return new ExceptionHandler(message, "TASK_CREATION_ERROR");
    }
  
    static updateError(message = "Error al actualizar la tarea") {
      return new ExceptionHandler(message, "TASK_UPDATE_ERROR");
    }
  
    static deletionError(message = "Error al eliminar la tarea") {
      return new ExceptionHandler(message, "TASK_DELETION_ERROR");
    }

    static invalidState (message = "Estado invalido"){
      return new ExceptionHandler(message, "INAVLID_STATE");
    }
  }
  