import express from "express";

import { wrapRequestHandler } from "../utils/handlers.js";
import {
  getImage,
  getImages,
  getSaveImage,
  saveImage,
  searchImages,
} from "../controllers/image.controllers.js";
import {
  getImageValidator,
  getImagesValidator,
  getSaveImageValidator,
  saveImageValidator,
  searchImagesValidator,
} from "../middlewares/image.middlewares.js";
import { verifyToken } from "../utils/jwt.js";
const imageRoute = express.Router();

imageRoute.get(
  "/get-images",
  getImagesValidator,
  verifyToken,
  wrapRequestHandler(getImages)
);
imageRoute.post(
  "/search-images",
  searchImagesValidator,
  verifyToken,
  wrapRequestHandler(searchImages)
);
imageRoute.get(
  "/get-image/:id",
  getImageValidator,
  verifyToken,
  wrapRequestHandler(getImage)
);

imageRoute.get(
  "/get-save-image/:id",
  getSaveImageValidator,
  verifyToken,
  wrapRequestHandler(getSaveImage)
);

imageRoute.post(
  "/save-image/:id",
  saveImageValidator,
  verifyToken,
  wrapRequestHandler(saveImage)
);

export default imageRoute;
