import { Result } from "express-validator";

class ValidationError extends Error {
  public status = 422;
  public error = "";
  constructor(error: Result) {
    super("");
    Object.setPrototypeOf(this, ValidationError.prototype);
    const errors = error.array();
    let message = errors.reduce(
      (prevValue, currentValue) => prevValue + currentValue.msg + ", ",
      ""
    );
    message = message.slice(0, -2);
    this.message = message;
    this.name = "ValidationError";
  }
}

export default ValidationError;
