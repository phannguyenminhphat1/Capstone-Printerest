import express from "express";
import {
  deleteImage,
  getCreatedImage,
  getProfile,
  getSavedImage,
  login,
  register,
  updateUserAvatar,
  updateUserInfo,
  uploadImage,
} from "../controllers/user.controllers.js";
import {
  deleteImageValidator,
  loginValidator,
  registerValidator,
  updateUserInfoValidator,
  uploadImagesValidator,
  validateFile,
} from "../middlewares/user.middlewares.js";
import { wrapRequestHandler } from "../utils/handlers.js";
import { verifyToken } from "../utils/jwt.js";
import { upload } from "../utils/upload.js";
import { filterMiddleware } from "../middlewares/common.middlewares.js";
const userRoute = express.Router();

userRoute.post("/login", loginValidator, wrapRequestHandler(login));
userRoute.post("/register", registerValidator, wrapRequestHandler(register));
userRoute.get("/get-profile", verifyToken, wrapRequestHandler(getProfile));
userRoute.get(
  "/get-saved-image",
  verifyToken,
  wrapRequestHandler(getSavedImage)
);

userRoute.get(
  "/get-created-image",
  verifyToken,
  wrapRequestHandler(getCreatedImage)
);

userRoute.delete(
  "/delete-image/:id",
  deleteImageValidator,
  verifyToken,
  wrapRequestHandler(deleteImage)
);

userRoute.post(
  "/upload-image",
  verifyToken,
  upload.single("imgUrl"),
  validateFile,
  uploadImagesValidator,
  wrapRequestHandler(uploadImage)
);
userRoute.patch(
  "/update-user-info",
  verifyToken,
  updateUserInfoValidator,
  filterMiddleware(["ho_ten", "tuoi", "mat_khau"]),
  wrapRequestHandler(updateUserInfo)
);

userRoute.patch(
  "/update-user-avatar",
  upload.single("imgUrl"),
  validateFile,
  filterMiddleware(["anh_dai_dien"]),
  wrapRequestHandler(updateUserAvatar)
);
export default userRoute;
