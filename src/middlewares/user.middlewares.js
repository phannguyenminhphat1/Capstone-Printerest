import { checkSchema } from "express-validator";
import { validate } from "../utils/validate.js";
import { USERS_MESSAGES } from "../constant/messages.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { ErrorWithStatus } from "../utils/errors.js";
import HTTP_STATUS from "../constant/httpStatus.js";
import { compareSync } from "bcrypt";
import { createToken } from "../utils/jwt.js";
const model = initModels(sequelize);

const emailSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
  },
  isEmail: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID,
  },
};
const passwordSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 50,
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
  },
};
const nameSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING,
  },
  trim: true,
  isLength: {
    options: {
      min: 3,
      max: 100,
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100,
  },
};
const ageSchema = {
  isNumeric: {
    errorMessage: USERS_MESSAGES.AGE_MUST_BE_NUMERIC,
  },
  custom: {
    options: (value, { req }) => {
      const age = parseInt(value, 10);
      if (isNaN(age)) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.INVALID_AGE_FORMAT,
          status: HTTP_STATUS.BAD_REQUEST,
        });
      }
      if (age <= 0) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.AGE_MUST_BE_GREATER_THAN_ZERO,
          status: HTTP_STATUS.BAD_REQUEST,
        });
      }
      return true;
    },
  },
};

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value, { req }) => {
            const checkEmail = await model.nguoi_dung.findOne({
              where: {
                email: value,
              },
            });
            if (checkEmail) {
              if (
                compareSync(req.body.mat_khau, checkEmail.dataValues.mat_khau)
              ) {
                let token = createToken({
                  userId: checkEmail.dataValues.nguoi_dung_id,
                });
                req.token = token;
              } else {
                throw new Error(USERS_MESSAGES.PASSWORD_IS_INCORRECT);
              }
            } else {
              throw new Error(USERS_MESSAGES.EMAIL_IS_NOT_EXIST);
            }
            return true;
          },
        },
      },
    },
    ["body"]
  )
);

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const result = await model.nguoi_dung.findOne({
              where: {
                email: value,
              },
            });
            if (result) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
                status: HTTP_STATUS.BAD_REQUEST,
              });
            }
            return true;
          },
        },
      },
      mat_khau: passwordSchema,
      ho_ten: nameSchema,
      tuoi: ageSchema,
    },
    ["body"]
  )
);

export const deleteImageValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.IMAGE_ID_IS_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST,
              });
            }
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

export const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({
      errors: [
        {
          msg: USERS_MESSAGES.IMAGE_URL_IS_REQUIRED,
          param: "imgUrl",
          location: "body",
        },
      ],
    });
  }
  next();
};

export const uploadImagesValidator = validate(
  checkSchema(
    {
      imgName: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.IMAGE_NAME_IS_REQUIRED,
        },
        isString: {
          errorMessage: USERS_MESSAGES.IMAGE_NAME_MUST_BE_A_STRING,
        },
      },
      imgDesc: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.DESCRIPTION_IS_REQUIRED,
        },
        isString: {
          errorMessage: USERS_MESSAGES.DESCRIPTION_MUST_BE_A_STRING,
        },
      },
    },
    ["body"]
  )
);

export const updateUserInfoValidator = validate(
  checkSchema({
    mat_khau: {
      ...passwordSchema,
      optional: true,
    },
    ho_ten: { ...nameSchema, optional: true },
    tuoi: { ...ageSchema, optional: true },
  })
);
