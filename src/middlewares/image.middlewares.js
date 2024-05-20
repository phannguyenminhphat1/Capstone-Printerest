import { checkSchema } from "express-validator";
import { validate } from "../utils/validate.js";
import { USERS_MESSAGES } from "../constant/messages.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { ErrorWithStatus } from "../utils/errors.js";
import HTTP_STATUS from "../constant/httpStatus.js";
import { decodeToken } from "../utils/jwt.js";
const model = initModels(sequelize);

export const getImagesValidator = validate(
  checkSchema(
    {
      token: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED,
              });
            }

            return true;
          },
        },
      },
    },
    ["headers"]
  )
);

export const searchImagesValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING,
        },
        trim: true,
      },
    },
    ["body"]
  )
);

export const getImageValidator = validate(
  checkSchema(
    {
      id: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const result = await model.hinh_anh.findOne({
              where: {
                hinh_id: value,
              },
              include: ["nguoi_dung"],
            });
            if (!result) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.IMAGE_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND,
              });
            }
            req.result = result;
          },
        },
      },
    },
    ["params"]
  )
);
export const getSaveImageValidator = validate(
  checkSchema(
    {
      id: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const findImage = await model.hinh_anh.findOne({
              where: {
                hinh_id: value,
              },
            });
            if (!findImage) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.IMAGE_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND,
              });
            }
            const result = await model.luu_anh.findAll({
              where: {
                hinh_id: findImage.dataValues.hinh_id,
              },
              include: ["nguoi_dung"],
            });
            req.result = result;
          },
        },
      },
    },
    ["params"]
  )
);

export const saveImageValidator = validate(
  checkSchema(
    {
      id: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const findImage = await model.hinh_anh.findOne({
              where: {
                hinh_id: value,
              },
            });
            if (!findImage) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.IMAGE_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND,
              });
            }
            return true;
          },
        },
      },
    },
    ["params"]
  )
);
