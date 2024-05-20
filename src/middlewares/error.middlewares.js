import pkg from "lodash";
const { omit } = pkg;
import HTTP_STATUS from "../constant/httpStatus.js";
import { ErrorWithStatus } from "../utils/errors.js";

export const defaultErrorHandler = (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, "status"));
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true });
  });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, "stack"),
  });
};
