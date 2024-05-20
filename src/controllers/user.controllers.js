import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { response } from "../utils/response.js";
import { hashSync } from "bcrypt";
import { USERS_MESSAGES } from "../constant/messages.js";
import { createToken, decodeToken } from "../utils/jwt.js";
import cloudinary from "../utils/cloudinary.js";
import compress_images from "compress-images";
import fs from "fs";
import { where } from "sequelize";
const model = initModels(sequelize);

export const login = async (req, res) => {
  const { token } = req;
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    access_token: token,
  });
};
export const register = async (req, res) => {
  const { email, mat_khau, ho_ten, tuoi } = req.body;
  const newUser = {
    email,
    mat_khau: hashSync(mat_khau, 10),
    ho_ten,
    tuoi,
    anh_dai_dien: process.env.CLOUNDINARY_DEFAULT_AVATAR,
  };
  const user = await model.nguoi_dung.create(newUser);
  const access_token = await createToken(user.dataValues.nguoi_dung_id);
  response(res, access_token, USERS_MESSAGES.REGISTER_SUCCESS, 200);
};

export const getProfile = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const user = await model.nguoi_dung.findOne({
    where: {
      nguoi_dung_id: data.userId,
    },
  });
  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    user,
  });
};

export const getSavedImage = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const result = await model.luu_anh.findAll({
    where: {
      nguoi_dung_id: data.userId,
    },
    include: ["hinh"],
  });
  return res.json({
    message: USERS_MESSAGES.GET_SAVED_IMAGE_SUCCESS,
    result,
  });
};

export const getCreatedImage = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const result = await model.hinh_anh.findAll({
    where: {
      nguoi_dung_id: data.userId,
    },
    include: ["nguoi_dung"],
  });
  if (result.length <= 0) {
    return res.json({
      message: USERS_MESSAGES.USER_HAS_NOT_CREATED_ANY_IMAGES,
    });
  }
  return res.json({
    message: USERS_MESSAGES.GET_CREATED_IMAGE_SUCCESS,
    result,
  });
};

export const deleteImage = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { id } = req.params;
  await model.hinh_anh.destroy({
    where: {
      nguoi_dung_id: data.userId,
      hinh_id: id,
    },
  });
  return res.json({
    message: USERS_MESSAGES.DELETE_IMAGE_SUCCESS,
  });
};

export const uploadImage = async (req, res) => {
  const { imgName, imgDesc } = req.body;
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { file } = req;
  let input = process.cwd() + "/public/img/" + file.filename;
  let output = process.cwd() + "/public/imgOptimize/";

  compress_images(
    input,
    output,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    async function (error, completed, statistic) {
      if (error) {
        return response(res, error, "Compressing image error", 500);
      }
      const cloudinaryResult = await cloudinary.uploader.upload(
        `${output}${file.filename}`
      );
      const newUploadImage = {
        ten_hinh: imgName,
        mo_ta: imgDesc,
        duong_dan: cloudinaryResult.url,
        nguoi_dung_id: data.userId,
      };
      await model.hinh_anh.create(newUploadImage);
      fs.unlink(`${output}${file.filename}`, (err) => {
        if (err) {
          console.error("Error while deleting file: ", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      fs.unlink(input, (err) => {
        if (err) {
          console.error("Error while deleting file: ", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  );
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
  });
};

export const updateUserInfo = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { mat_khau, ho_ten, tuoi } = req.body;
  await model.nguoi_dung.update(
    {
      mat_khau: hashSync(mat_khau, 10),
      ho_ten: ho_ten,
      tuoi: tuoi,
    },
    {
      where: {
        nguoi_dung_id: data.userId,
      },
    }
  );
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
  });
};

export const updateUserAvatar = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { file } = req;
  let input = process.cwd() + "/public/img/" + file.filename;
  let output = process.cwd() + "/public/imgOptimize/";

  compress_images(
    input,
    output,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    async function (error, completed, statistic) {
      if (error) {
        return response(res, error, "Compressing image error", 500);
      }
      const cloudinaryResult = await cloudinary.uploader.upload(
        `${output}${file.filename}`
      );

      await model.nguoi_dung.update(
        {
          anh_dai_dien: cloudinaryResult.url,
        },
        {
          where: {
            nguoi_dung_id: data.userId,
          },
        }
      );
      fs.unlink(`${output}${file.filename}`, (err) => {
        if (err) {
          console.error("Error while deleting file: ", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      fs.unlink(input, (err) => {
        if (err) {
          console.error("Error while deleting file: ", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  );
  return res.json({
    message: USERS_MESSAGES.UPDATE_AVATAR_ME_SUCCESS,
  });
};
