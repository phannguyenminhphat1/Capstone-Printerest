import express from "express";
import userRoute from "./user.routes.js";
import imageRoute from "./image.routes.js";
import commentRoute from "./comment.routes.js";
const rootRoute = express.Router();

rootRoute.use("/users", userRoute);
rootRoute.use("/images", imageRoute);
rootRoute.use("/comments", commentRoute);

export default rootRoute;
