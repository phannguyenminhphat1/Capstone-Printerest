import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { USERS_MESSAGES } from "../constant/messages.js";
import { Op } from "sequelize";
import { decodeToken } from "../utils/jwt.js";
const model = initModels(sequelize);

export const getImages = async (req, res) => {
  const images = await model.hinh_anh.findAll();
  return res.json({
    message: USERS_MESSAGES.GET_IMAGES_SUCCESS,
    images,
  });
};

export const searchImages = async (req, res) => {
  const { name } = req.body;
  const result = await model.hinh_anh.findAll({
    where: {
      ten_hinh: {
        [Op.like]: `%${name.toLowerCase()}%`,
      },
    },
  });
  return res.json({
    message: USERS_MESSAGES.GET_IMAGES_SUCCESS,
    result,
  });
};

export const getImage = async (req, res) => {
  const { result } = req;
  return res.json({
    message: USERS_MESSAGES.GET_IMAGE_SUCCESS,
    result,
  });
};
export const getSaveImage = async (req, res) => {
  const { result } = req;
  if (result.length <= 0) {
    return res.json({
      message: USERS_MESSAGES.IMAGE_IS_NOT_SAVED,
    });
  }
  return res.json({
    message: USERS_MESSAGES.GET_IMAGE_SAVED_SUCCESS,
    result,
  });
};

export const saveImage = async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const checkSave = await model.luu_anh.findOne({
    where: {
      hinh_id: id,
      nguoi_dung_id: data.userId,
    },
  });
  if (!checkSave) {
    const saveImage = await model.luu_anh.create({
      hinh_id: id,
      nguoi_dung_id: data.userId,
      ngay_luu: new Date(),
    });
    return res.json({
      message: USERS_MESSAGES.SAVE_IMAGE_SUCCESS,
      saveImage,
    });
  }
  const savedImage = await model.luu_anh.destroy({
    where: {
      hinh_id: id,
      nguoi_dung_id: data.userId,
    },
  });
  return res.json({
    message: USERS_MESSAGES.UNSAVED_IMAGE_SUCCESS,
    savedImage,
  });
};
