import express from "express";
import rootRoute from "./routes/root.routes.js";
import { defaultErrorHandler } from "./middlewares/error.middlewares.js";
import { initFolder } from "./utils/file.js";

const app = express();
const port = 8080;
initFolder();
app.use(express.json());
app.use(express.static("."));
app.use("/api", rootRoute);
app.use(defaultErrorHandler);

app.listen(port);
