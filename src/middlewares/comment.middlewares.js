import { checkSchema } from "express-validator";
import { validate } from "../utils/validate.js";
import { USERS_MESSAGES } from "../constant/messages.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { ErrorWithStatus } from "../utils/errors.js";
import HTTP_STATUS from "../constant/httpStatus.js";
const model = initModels(sequelize);

export const getCommentValidator = validate(
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
            const result = await model.binh_luan.findAll({
              where: {
                hinh_id: findImage.dataValues.hinh_id,
              },
              include: ["nguoi_dung", "hinh"],
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

export const commentValidator = validate(
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
      content: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONTENT_IS_REQUIRED,
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONTENT_MUST_BE_A_STRING,
        },
        trim: true,
      },
    },
    ["params", "body"]
  )
);
