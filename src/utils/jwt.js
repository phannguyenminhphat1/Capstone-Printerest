import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

export const createToken = (data) => {
  return jwt.sign({ data: data }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPRIRE_IN,
  });
};

export const checkToken = (token) =>
  jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (error) => error);

export const decodeToken = (token) => jwt.decode(token);

export const verifyToken = (req, res, next) => {
  let { token } = req.headers;
  let err = checkToken(token);
  if (err == null) {
    next();
    return;
  }

  res.status(401).send(err.message);
};

export const createRefreshToken = (data) => {
  return jwt.sign({ data: data }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPRIRE_IN,
  });
};

export const checkRefreshToken = (token) =>
  jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (error) => error);
