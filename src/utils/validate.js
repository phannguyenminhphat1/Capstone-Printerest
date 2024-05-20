import express from "express";
import { validationResult } from "express-validator";
import { EntityError, ErrorWithStatus } from "./errors.js";
import HTTP_STATUS from "../constant/httpStatus.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    await validations.run(req);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const objectErrors = errors.mapped();
    const entityError = new EntityError({ errors: {} });
    for (const key in objectErrors) {
      const { msg } = objectErrors[key];
      if (
        msg instanceof ErrorWithStatus &&
        msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY
      ) {
        return next(msg);
      }
      entityError.errors[key] = objectErrors[key];
    }

    next(entityError);
  };
};
