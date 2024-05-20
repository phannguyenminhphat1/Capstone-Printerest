import express from "express";
import { verifyToken } from "../utils/jwt.js";
import { getComment, comment } from "../controllers/comment.controllers.js";
import {
  getCommentValidator,
  commentValidator,
} from "../middlewares/comment.middlewares.js";
import { wrapRequestHandler } from "../utils/handlers.js";
const commentRoute = express.Router();

commentRoute.get(
  "/get-comment/:id",
  getCommentValidator,
  verifyToken,
  wrapRequestHandler(getComment)
);

commentRoute.post(
  "/comment/:id",
  commentValidator,
  verifyToken,
  wrapRequestHandler(comment)
);
export default commentRoute;
