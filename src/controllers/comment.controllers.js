import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { decodeToken } from "../utils/jwt.js";
import { USERS_MESSAGES } from "../constant/messages.js";
const model = initModels(sequelize);

export const getComment = async (req, res) => {
  const { result } = req;
  return res.json({
    message: USERS_MESSAGES.GET_COMMENTS_SUCCESS,
    result,
  });
};
export const comment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const newComment = {
    nguoi_dung_id: data.userId,
    hinh_id: id,
    ngay_binh_luan: new Date(),
    noi_dung_binh_luan: content,
  };
  const result = await model.binh_luan.create(newComment);
  return res.json({
    message: USERS_MESSAGES.COMMENT_SUCCESS,
    result,
  });
};
