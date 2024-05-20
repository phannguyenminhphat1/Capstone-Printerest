import multer, { diskStorage } from "multer";

export const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/img",
    filename: (req, file, callback) => {
      let mSecond = new Date().getTime();
      callback(
        null,
        mSecond +
          "-" +
          Math.round(Math.random() * 189) +
          "_" +
          file.originalname
      );
    },
  }),
});
