import fs from "fs";
import path from "path";

export const UPLOAD_IMAGE_FOLDER = path.resolve("public/img");
export const UPLOAD_IMAGE_OPTIMIZE_FOLDER = path.resolve("public/imgOptimize");

export const initFolder = () => {
  [UPLOAD_IMAGE_FOLDER, UPLOAD_IMAGE_OPTIMIZE_FOLDER].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
  });
};
