import HTTP_STATUS from "../constant/httpStatus.js";
import { USERS_MESSAGES } from "../constant/messages.js";

export class ErrorWithStatus {
  constructor({ message, status }) {
    this.message = message;
    this.status = status;
  }
}

export class EntityError extends ErrorWithStatus {
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY });
    this.errors = errors;
  }
}
